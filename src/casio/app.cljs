(ns casio.app
  (:require
   ["/casio/machine" :as machine]
   ["@xstate/inspect" :refer [inspect]]
   ["xstate" :as xstate]
   [applied-science.js-interop :as j]
   [clojure.string :as str]
   [clojure.walk :as walk]
   [goog.object :as gobj]
   [statecharts.core :as fsm]
   [statecharts.service :as service]))

(defn make-time [hours minutes seconds]
  (doto (js/Date.)
    (.setHours hours)
    (.setMinutes minutes)
    (.setSeconds seconds)
    (.setMilliseconds 0)))

(defn assign-context [f]
  (xstate/assign
   (fn [^js params]
     ;; for xstate v4
     (f params)
     ;; for v5
     #_(f (.-context params)))))

(defn update-datetime-handler [f]
  (assign-context
   (fn [^js context]
     (let [now (js/Date.now)
           current (js/Date. (+ now (.-dateTimeOffset context)))
           _ (f current)
           dateTimeOffset (- (.getTime current) now)]
       #js {:dateTimeOffset dateTimeOffset}))))

(def actions
  (j/lit {:toggleTimeMode (assign-context
                           (fn [^js context]
                             (let [mode (if (= (.-timeMode context) "24")
                                          "12" "24")]
                               #js {:timeMode mode})))
          :toggleAlarmMode (assign-context
                            (fn [^js context]
                              (let [alarmOnMark (.-alarmOnMark context)
                                    timeSignalOnMark (.-timeSignalOnMark context)]
                                (cond
                                  (and alarmOnMark timeSignalOnMark) #js {:alarmOnMark false :timeSignalOnMark false}
                                  alarmOnMark #js {:alarmOnMark false :timeSignalOnMark true}
                                  timeSignalOnMark #js {:alarmOnMark true :timeSignalOnMark true}
                                  :else #js {:alarmOnMark true :timeSignalOnMark false}))))
          :enableAlarmOnMark (assign-context (constantly #js {:alarmOnMark true}))
          :incrementAlarmHours (assign-context
                                (fn [^js context]
                                  #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                             (.setHours (inc (.getHours (.-dailyAlarmDateTime context)))))}))
          :incrementAlarmMinutes (assign-context
                                  (fn [^js context]
                                    #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                               (.setMinutes (inc (.getMinutes (.-dailyAlarmDateTime context)))))}))
          :resetTimeSeconds (update-datetime-handler #(.setSeconds % 0))
          :incrementTimeMinutes (update-datetime-handler #(.setMinutes % (inc (.getMinutes %))))
          :incrementTimeHours (update-datetime-handler #(.setHours % (inc (.getHours %))))
          :incrementDateMonth (update-datetime-handler #(.setMonth % (inc (.getMonth %))))
          :incrementDateDay (update-datetime-handler #(.setDate % (inc (.getDate %))))
          :toggleStopwatch (assign-context
                            (fn [^js context]
                              (let [stopwatchInterval (.-stopwatchInterval context)
                                    stopwatchDateTime (.-stopwatchDateTime context)]
                                (if stopwatchInterval
                                  (do
                                    (js/clearInterval stopwatchInterval)
                                    #js {:stopwatchInterval nil})
                                  (let [interval (js/setInterval
                                                  (fn []
                                                    ;; hack: mutating the stopwatchDateTime
                                                    ;; note: mimicking the original implementation, setInterval can accumulate inaccuracies
                                                    (.setMilliseconds stopwatchDateTime
                                                                      (+ (.getMilliseconds stopwatchDateTime) 10)))
                                                  10)]
                                    #js {:stopwatchInterval interval})))))
          :toggleSplitOrClearStopwatch (assign-context
                                        (fn [^js context]
                                          (let [stopwatchInterval (.-stopwatchInterval context)
                                                stopwatchDateTime (.-stopwatchDateTime context)
                                                stopwatchDateTimeSplit (.-stopwatchDateTimeSplit context)]
                                            (cond
                                              ;; Reset if there is a saved split time.
                                              stopwatchDateTimeSplit #js {:stopwatchDateTimeSplit nil}
                                              ;; If the stopwatch is running then save a split time.
                                              stopwatchInterval #js {:stopwatchDateTimeSplit (js/Date. stopwatchDateTime)}
                                              ;; Otherwise clear stopwatch date time.
                                              :else #js {:stopwatchDateTime (make-time 0 0 0)}))))
          :playBip #(js/console.log "Playing bip")}))

(def watch-machine
  (-> machine/machine
      (.withConfig #js {:actions actions})
      (.withContext (j/lit {:timeMode "24"
                            :alarmOnMark false
                            :timeSignalOnMark false
                            :dailyAlarmDateTime (make-time 7 0 0)
                            :dateTimeOffset 0
                            :stopwatchInterval nil
                            :stopwatchDateTime (make-time 0 0 0)
                            :stopwatchDateTimeSplit nil}))))

(defn bind-events [actor]
  (let [button-l (js/document.querySelector "#buttonL")
        button-c (js/document.querySelector "#buttonC")
        button-a (js/document.querySelector "#buttonA")]
    (.addEventListener button-l "mousedown" #(.send actor #js {:type "l-down"}))
    (.addEventListener button-l "mouseup" #(.send actor #js {:type "l-up"}))
    (.addEventListener button-c "mousedown" #(.send actor #js {:type "c-down"}))
    (.addEventListener button-c "mouseup" #(.send actor #js {:type "c-up"}))
    (.addEventListener button-a "mousedown" #(.send actor #js {:type "a-down"}))
    (.addEventListener button-a "mouseup" #(.send actor #js {:type "a-up"}))))

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

(defn ^:export ^:dev/after-load reload []
  (js/location.reload))

(defn ^:export xstate_main []
  (let [os (js/CasioF91WOperatingSystem.)
        inspect? true
        _ (when inspect?
            (let [iframe (js/document.createElement "iframe")]
              (set! (.-style iframe) "flex-grow: 1; align-self: stretch;")
              (.appendChild js/document.body iframe)
              (inspect #js {:iframe iframe})))
        actor (xstate/interpret (.withConfig watch-machine
                                             (j/lit {:actions {:playBip #(.playBip os)}}))
                                #js {:devTools inspect?})]

    (.subscribe actor (fn [snapshot]
                        (let [context ^js (.-context snapshot)
                              watch-value ^js (.-value.watch snapshot)
                              light-value ^js (.-value.light snapshot)
                              activeMenu (-> watch-value
                                             (js/Object.keys)
                                             (first))
                              activeAction (gobj/get watch-value activeMenu)
                              ;; The `holding` and `modified` states are part of the machine for accuracy of the model,
                              ;; but such actions are not present in the original implementation,
                              ;; so we render the `default` action insted of them.
                              activeAction (if (#{"holding" "modified"} activeAction)
                                             "default" activeAction)]
                          (js/console.log "Value:" watch-value "Context:" context)
                          (set! (.-activeMenu os) activeMenu)
                          (set! (.-activeAction os) activeAction)
                          (set! (.-light os) (= light-value "on"))
                          (js/Object.assign os (j/select-keys context
                                                              [:timeMode
                                                               :alarmOnMark
                                                               :timeSignalOnMark
                                                               :dailyAlarmDateTime
                                                               :dateTimeOffset
                                                               :stopwatchDateTime
                                                               :stopwatchDateTimeSplit]))
                          ;; Lap is derived based on whether split time is set, we don't need to keep it in state separately.
                          (set! (.-lap os) (boolean (.-stopwatchDateTimeSplit context))))))
    (.start actor)
    (init-bip-mute-toggle os)
    (bind-events actor)))

    ; (.send actor #js {:type "c-down"})
    ; (.send actor #js {:type "a-down"})

(defn transform-absolute-state-name [s]
  (->> (str/split (subs s 1) #"\.")
       (drop 1)
       (map keyword)
       (into [:>])))

(defn update-datetime-handler-fsm [f]
  (fsm/assign
   (fn [context]
     (update context :dateTimeOffset
             (fn [dateTimeOffset]
               (let [now (js/Date.now)
                     current (js/Date. (+ now dateTimeOffset))]
                 (f current)
                 (- (.getTime current) now)))))))

(def clj-actions
  {:toggleTimeMode  (fsm/assign
                     (fn [context]
                       (update context :timeMode #(if (= % "24") "12" "24"))))
   :toggleAlarmMode (fsm/assign
                     (fn [{:keys [alarmOnMark timeSignalOnMark] :as context}]
                       (merge context (cond
                                        (and alarmOnMark timeSignalOnMark) {:alarmOnMark false :timeSignalOnMark false}
                                        alarmOnMark {:alarmOnMark false :timeSignalOnMark true}
                                        timeSignalOnMark {:alarmOnMark true :timeSignalOnMark true}
                                        :else {:alarmOnMark true :timeSignalOnMark false}))))
   :enableAlarmOnMark (fsm/assign #(assoc % :alarmOnMark true))
   :incrementAlarmHours (fsm/assign
                         (fn [context]
                           (update context :dailyAlarmDateTime #(doto (js/Date. %)
                                                                  (.setHours (inc (.getHours %)))))))
   :incrementAlarmMinutes (fsm/assign
                           (fn [context]
                             (update context :dailyAlarmDateTime #(doto (js/Date. %)
                                                                    (.setMinutes (inc (.getMinutes %)))))))
   :resetTimeSeconds (update-datetime-handler-fsm #(.setSeconds % 0))
   :incrementTimeMinutes (update-datetime-handler-fsm #(.setMinutes % (inc (.getMinutes %))))
   :incrementTimeHours (update-datetime-handler-fsm #(.setHours % (inc (.getHours %))))
   :incrementDateMonth (update-datetime-handler-fsm #(.setMonth % (inc (.getMonth %))))
   :incrementDateDay (update-datetime-handler-fsm #(.setDate % (inc (.getDate %))))
   :toggleStopwatch (fsm/assign
                     (fn [{:keys [stopwatchInterval stopwatchDateTime] :as context}]
                       (assoc context :stopwatchInterval
                              (if stopwatchInterval
                                (do
                                  (js/clearInterval stopwatchInterval)
                                  nil)
                                (js/setInterval
                                 (fn []
                                   ;; hack: mutating the stopwatchDateTime
                                   ;; note: mimicking the original implementation, setInterval can accumulate inaccuracies
                                   (.setMilliseconds stopwatchDateTime
                                                     (+ (.getMilliseconds stopwatchDateTime) 10)))
                                 10)))))
   :toggleSplitOrClearStopwatch (fsm/assign
                                 (fn [{:keys [stopwatchInterval stopwatchDateTime stopwatchDateTimeSplit] :as context}]
                                   (cond
                                     ;; Reset if there is a saved split time.
                                     stopwatchDateTimeSplit (assoc context :stopwatchDateTimeSplit nil)
                                     ;; If the stopwatch is running then save a split time.
                                     stopwatchInterval (assoc context :stopwatchDateTimeSplit (js/Date. stopwatchDateTime))
                                     ;; Otherwise clear stopwatch date time.
                                     :else (assoc context :stopwatchDateTime (make-time 0 0 0)))))})

(defn resolve-actions [registry actions]
  (cond
    (keyword? actions) (get registry actions actions)
    (vector? actions) (mapv #(resolve-actions registry %) actions)
    :else actions))

(defn make-machine [action-overrides]
  (let [action-registry (merge clj-actions action-overrides)
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
                    (assoc :context {:timeMode "24"
                                     :alarmOnMark false
                                     :timeSignalOnMark false
                                     :dailyAlarmDateTime (make-time 7 0 0)
                                     :dateTimeOffset 0
                                     :stopwatchInterval nil
                                     :stopwatchDateTime (make-time 0 0 0)
                                     :stopwatchDateTimeSplit nil})
                    (dissoc :states)
                    (assoc :regions (:states machine)))]
    (js/console.log "machine" machine)
    machine))

(defn xbind-events [actor]
  (let [button-l (js/document.querySelector "#buttonL")
        button-c (js/document.querySelector "#buttonC")
        button-a (js/document.querySelector "#buttonA")]
    (.addEventListener button-l "mousedown" #(fsm/send actor {:type :l-down}))
    (.addEventListener button-l "mouseup" #(fsm/send actor {:type :l-up}))
    (.addEventListener button-c "mousedown" #(fsm/send actor {:type :c-down}))
    (.addEventListener button-c "mouseup" #(fsm/send actor {:type :c-up}))
    (.addEventListener button-a "mousedown" #(fsm/send actor {:type :a-down}))
    (.addEventListener button-a "mouseup" #(fsm/send actor {:type :a-up}))))

(defn ^:export main []
  (let [os (js/CasioF91WOperatingSystem.)
        action-overrides {:playBip #(.playBip os)}
        machine (make-machine action-overrides)
        service (fsm/service (fsm/machine machine)
                             {:transition-opts {:ignore-unknown-event? true}})]

    (service/add-listener service :f91w
                          (fn [_old new]
                            (let [{:keys [watch light]} (:_state new)
                                  [active-menu active-action] watch]
                              (set! (.-activeMenu os) (name active-menu))
                              (set! (.-activeAction os) (name active-action))
                              (set! (.-light os) (= light :on))
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
                              (set! (.-lap os) (boolean (:stopwatchDateTimeSplit new)))
                              (js/console.log "state: " new))))

    ;; start the service
    (fsm/start service)
    (xbind-events service)
    ;
    (println (fsm/value service))))
    ;
    ; (fsm/send service :l-down)
    ; (fsm/send service :l-up)
    ; (fsm/send service :c-down)))
