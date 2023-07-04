(ns casio.app
  (:require ["xstate" :as xstate]
            [applied-science.js-interop :as j]))

(defn make-time [hours minutes seconds]
  (doto (js/Date.)
    (.setHours hours)
    (.setMinutes minutes)
    (.setSeconds seconds)))

(def watch-machine
  (xstate/createMachine
   (j/lit {:id "toggle"
           :initial "DateTime"
           :context {:timeMode "24"
                     :alarmOnMark false
                     :timeSignalOnMark false
                     :dailyAlarmDateTime (make-time 7 0 0)}
           :states {:DateTime {:initial "Default"
                               :states {:Default {:on {:a-down "Holding"}}
                                        :Holding {:on {:a-up "Default"}
                                                  :entry "toggleTimeMode"
                                                  :after {3000 "Casio"}}
                                        :Casio {:on {:a-up "Default"}}}
                               :on {:c-down "DailyAlarm"}},
                    :DailyAlarm {:initial "Default"
                                 :states {:Default {:on {:l-down {:target "EditHours"
                                                                  :actions ["enableAlarmOnMark"]}}}
                                          ;; TODO: continuously increment while holding the button
                                          :EditHours {:on {:l-down "EditMinutes"
                                                           :a-down {:actions ["incrementAlarmHours"]}}}
                                          :EditMinutes {:on {:l-down "Default"
                                                             :a-down {:actions ["incrementAlarmMinutes"]}}}}
                                 :on {:c-down "Stopwatch"
                                      :a-down {:actions ["toggleAlarmMode"]}}}
                    :Stopwatch {:on {:c-down "SetDateTime"}}
                    :SetDateTime {:on {:c-down "DateTime"}}}})

   (j/lit {:actions {:toggleTimeMode (xstate/assign
                                      #js {:timeMode (fn [^js context]
                                                       (if (= (.-timeMode context) "24")
                                                         "12" "24"))})
                     :toggleAlarmMode (xstate/assign
                                       (fn [^js context]
                                         (let [alarmOnMark (.-alarmOnMark context)
                                               timeSignalOnMark (.-timeSignalOnMark context)]
                                           (cond
                                             (and alarmOnMark timeSignalOnMark) #js {:alarmOnMark false :timeSignalOnMark false}
                                             alarmOnMark #js {:alarmOnMark false :timeSignalOnMark true}
                                             timeSignalOnMark #js {:alarmOnMark true :timeSignalOnMark true}
                                             :else #js {:alarmOnMark true :timeSignalOnMark false}))))
                     :enableAlarmOnMark (xstate/assign #js {:alarmOnMark (constantly true)})
                     :incrementAlarmHours (xstate/assign
                                           (fn [^js context]
                                             #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                                        (.setHours (inc (.getHours (.-dailyAlarmDateTime context)))))}))
                     :incrementAlarmMinutes (xstate/assign
                                             (fn [^js context]
                                               #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                                          (.setMinutes (inc (.getMinutes (.-dailyAlarmDateTime context)))))}))}})))

(defn ^:export ^:dev/after-load main []
  (let [;myCasioF91W (js/CasioF91W.)
        actor (xstate/interpret watch-machine)]

    (.subscribe actor (fn [snapshot]
                        (js/console.log
                         "Value:" (.-value snapshot)
                         "Context:" (.-context snapshot))))
    (.start actor)

    (.send actor #js {:type "c-down"})
    (.send actor #js {:type "l-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "l-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "l-down"})))

; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})))

    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-up"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-up"})
    ;
    ; (js/console.log "state" (.-state.value actor))))

