(ns casio.app
  (:require
   ["/casio/machine" :as machine]
   ["@xstate/inspect" :refer [inspect]]
   [casio.machine :refer [context-actions make-context]]
   [casio.statecharts-service :refer [transform-state]]
   [casio.xstate-service :as xstate-service]
   [clojure.string :as str]
   [clojure.walk :as walk]
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
        watch-state (transform-state watch)
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
    (set! (.-light os) (= (transform-state light) "on"))
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

(defn init-bip-mute-toggle [^js os]
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

(defn start [os service]
  (init-bip-mute-toggle os)
  (service/add-listener service :f91w
                        (fn [_old new]
                          (set-os-state! os new)))
  (fsm/start service)
  (bind-events service))

(defn ^:export ^:dev/after-load reload []
  (js/location.reload))

(defn ^:export xstate-main []
  (let [os (js/CasioF91WOperatingSystem.)
        inspect? true
        _ (when inspect?
            (let [iframe (js/document.createElement "iframe")]
              (set! (.-style iframe) "flex-grow: 1; align-self: stretch;")
              (.appendChild js/document.body iframe)
              (inspect #js {:iframe iframe})))
        service (xstate-service/make-service {:actions {:playBip #(.playBip os)}
                                              :options #js {:devTools inspect?}})]
    (start os service)))

(defn transform-absolute-state-name [s]
  (->> (str/split (subs s 1) #"\.")
       (drop 1)
       (map keyword)
       (into [:>])))

(defn resolve-actions [registry actions]
  (cond
    (keyword? actions) (get registry actions actions)
    (vector? actions) (mapv #(resolve-actions registry %) actions)
    :else actions))

(defn make-machine [action-overrides]
  (let [action-registry (merge (update-vals context-actions fsm/assign)
                               action-overrides)
        actions->fns #(resolve-actions action-registry %)
        machine (->> (js->clj (.-config machine/machine))
                     (walk/postwalk (fn [x]
                                      (cond
                                        (string? x) (if (str/starts-with? x "#")
                                                      (transform-absolute-state-name x)
                                                      ;; parse numbers e.g. for :after transitions
                                                      (if-some [number (parse-long x)]
                                                        number
                                                        (keyword x)))

                                        (and (map? x) (:actions x)) (update x :actions actions->fns)

                                        :else x))))
        machine (-> machine
                    (assoc :context (make-context))
                    (dissoc :states)
                    (assoc :regions (:states machine)))]
    (js/console.log "machine" machine)
    machine))

(defn ^:export statechart-main []
  (let [os (js/CasioF91WOperatingSystem.)
        action-overrides {:playBip #(.playBip os)}
        machine (make-machine action-overrides)
        service (fsm/service (fsm/machine machine)
                             {:transition-opts {:ignore-unknown-event? true}})]
    (start os service)))

(defn ^:export main []
  ; (statechart-main))
  (xstate-main))
