(ns casio.app
  (:require
   ["@xstate/inspect" :refer [inspect]]
   [casio.statecharts-service :as statecharts-service]
   [casio.xstate-service :as xstate-service]
   [statecharts.core :as fsm]
   [statecharts.service :as service]))

(defn bind-events [actor]
  (let [button-l (js/document.querySelector "#buttonL")
        button-c (js/document.querySelector "#buttonC")
        button-a (js/document.querySelector "#buttonA")]
    (.addEventListener button-l "mousedown" #(fsm/send actor :l-down))
    (.addEventListener button-l "mouseup" #(fsm/send actor :l-up))
    (.addEventListener button-c "mousedown" #(fsm/send actor :c-down))
    (.addEventListener button-c "mouseup" #(fsm/send actor :c-up))
    (.addEventListener button-a "mousedown" #(fsm/send actor :a-down))
    (.addEventListener button-a "mouseup" #(fsm/send actor :a-up))))

(defn set-os-state! [^js os new]
  (let [{:keys [watch light]} (:_state new)
        watch-state (statecharts-service/transform-state watch)
        active-menu (first (keys watch-state))
        active-action (get watch-state active-menu)
        ;; The `holding` and `modified` states are part of the machine for accuracy of the model,
        ;; but such actions are not present in the original implementation,
        ;; so we render the `default` action insted of them.
        ;; Otherwise for example time does not increment when holding A on the time screen.
        active-action (if (#{"holding" "modified"} active-action)
                        "default" active-action)]
    (set! (.-activeMenu os) (name active-menu))
    (set! (.-activeAction os) active-action)
    (set! (.-light os) (= (statecharts-service/transform-state light) "on"))
    (js/Object.assign os (-> (select-keys new
                                          [:timeMode
                                           :alarmOnMark
                                           :timeSignalOnMark
                                           :dailyAlarmDateTime
                                           :dateTimeOffset
                                           :stopwatchDateTime
                                           :stopwatchDateTimeSplit])
                             (clj->js)))
    ;; Lap is derived based on whether split time is set, we don't need to keep it in state separately.
    (set! (.-lap os) (boolean (:stopwatchDateTimeSplit new)))))
    ; (js/console.log "state: " new)))

(defn init-bip-mute-toggle! [^js os]
  (let [soundOnOffBtn (.querySelector js/document "#SoundOnOff")
        muteBip (fn [mute]
                  (.apply
                   (.-remove (.-classList soundOnOffBtn))
                   (.-classList soundOnOffBtn)
                   #js ["on" "off"])
                  (if mute
                    (.add (.-classList soundOnOffBtn) "off")
                    (.add (.-classList soundOnOffBtn) "on"))
                  (set! (.. os -bip -muted) mute)
                  (.setItem js/localStorage "isBipMuted" mute))]

    (when (.getItem js/localStorage "isBipMuted")
      (muteBip (= (.getItem js/localStorage "isBipMuted") "true")))

    (.addEventListener soundOnOffBtn "click"
                       (fn [e] (muteBip (.contains (.. e -currentTarget -classList) "on"))))))

(defn init-xstate-inspector! []
  (let [iframe (js/document.createElement "iframe")]
    (set! (.-style iframe) "flex-grow: 1; align-self: stretch;")
    (.appendChild js/document.body iframe)
    (inspect #js {:iframe iframe})))

(defn ^:export ^:dev/after-load reload []
  (js/location.reload))

(defn ^:export main []
  (let [use-xstate? true ; false to use clj-statecharts implementation
        show-inspector? true
        _ (when (and use-xstate? show-inspector?)
            (init-xstate-inspector!))
        os (js/CasioF91WOperatingSystem.)
        actions {:playBip #(.playBip os)}
        service (if use-xstate?
                  (xstate-service/make-service {:actions actions
                                                :options #js {:devTools show-inspector?}})
                  (statecharts-service/make-service {:actions actions}))]
    (init-bip-mute-toggle! os)
    (service/add-listener service :f91w
                          (fn [_old new]
                            (set-os-state! os new)))
    (fsm/start service)
    (bind-events service)))
