(ns casio.machine)

(defn make-time [hours minutes seconds]
  (doto (js/Date.)
    (.setHours hours)
    (.setMinutes minutes)
    (.setSeconds seconds)
    (.setMilliseconds 0)))

(defn update-datetime-handler-fsm [f]
  (fn [context]
    (update context :dateTimeOffset
            (fn [dateTimeOffset]
              (let [now (js/Date.now)
                    current (js/Date. (+ now dateTimeOffset))]
                (f current)
                (- (.getTime current) now))))))

(defn make-context []
  {:timeMode "24"
   :alarmOnMark false
   :timeSignalOnMark false
   :dailyAlarmDateTime (make-time 7 0 0)
   :dateTimeOffset 0
   :stopwatchInterval nil
   :stopwatchDateTime (make-time 0 0 0)
   :stopwatchDateTimeSplit nil})

(def context-actions
  {:toggleTimeMode (fn [context]
                     (update context :timeMode #(if (= % "24") "12" "24")))
   :toggleAlarmMode (fn [{:keys [alarmOnMark timeSignalOnMark] :as context}]
                      (merge context (cond
                                       (and alarmOnMark timeSignalOnMark) {:alarmOnMark false :timeSignalOnMark false}
                                       alarmOnMark {:alarmOnMark false :timeSignalOnMark true}
                                       timeSignalOnMark {:alarmOnMark true :timeSignalOnMark true}
                                       :else {:alarmOnMark true :timeSignalOnMark false})))
   :enableAlarmOnMark #(assoc % :alarmOnMark true)
   :incrementAlarmHours (fn [context]
                          (update context :dailyAlarmDateTime #(doto (js/Date. %)
                                                                 (.setHours (inc (.getHours %))))))
   :incrementAlarmMinutes (fn [context]
                            (update context :dailyAlarmDateTime #(doto (js/Date. %)
                                                                   (.setMinutes (inc (.getMinutes %))))))
   :resetTimeSeconds (update-datetime-handler-fsm #(.setSeconds % 0))
   :incrementTimeMinutes (update-datetime-handler-fsm #(.setMinutes % (inc (.getMinutes %))))
   :incrementTimeHours (update-datetime-handler-fsm #(.setHours % (inc (.getHours %))))
   :incrementDateMonth (update-datetime-handler-fsm #(.setMonth % (inc (.getMonth %))))
   :incrementDateDay (update-datetime-handler-fsm #(.setDate % (inc (.getDate %))))
   :toggleStopwatch (fn [{:keys [stopwatchInterval stopwatchDateTime] :as context}]
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
                                10))))
   :toggleSplitOrClearStopwatch (fn [{:keys [stopwatchInterval stopwatchDateTime stopwatchDateTimeSplit] :as context}]
                                  (cond
                                    ;; Reset if there is a saved split time.
                                    stopwatchDateTimeSplit (assoc context :stopwatchDateTimeSplit nil)
                                    ;; If the stopwatch is running then save a split time.
                                    stopwatchInterval (assoc context :stopwatchDateTimeSplit (js/Date. stopwatchDateTime))
                                    ;; Otherwise clear stopwatch date time.
                                    :else (assoc context :stopwatchDateTime (make-time 0 0 0))))})

