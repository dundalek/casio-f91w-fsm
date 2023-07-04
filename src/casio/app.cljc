(ns casio.app
  (:require
   ["xstate" :as xstate]
   [applied-science.js-interop :as j]
   [goog.object :as gobj]))

(defn make-time [hours minutes seconds]
  (doto (js/Date.)
    (.setHours hours)
    (.setMinutes minutes)
    (.setSeconds seconds)))

(def watch-machine
  (xstate/createMachine
   (j/lit {:id "toggle"
           :initial "dateTime"
           :context {:timeMode "24"
                     :alarmOnMark false
                     :timeSignalOnMark false
                     :dailyAlarmDateTime (make-time 7 0 0)}
           :states {:dateTime {:initial "default"
                               :states {:default {:on {:a-down "Holding"}}
                                        :Holding {:on {:a-up "default"}
                                                  :entry "toggleTimeMode"
                                                  :after {3000 "Casio"}}
                                        :Casio {:on {:a-up "default"}}}
                               :on {:c-down "dailyAlarm"}},
                    :dailyAlarm {:initial "default"
                                 :states {:default {:on {:l-down {:target "edit-hours"
                                                                  :actions ["enableAlarmOnMark"]}}}
                                          ;; TODO: continuously increment while holding the button
                                          :edit-hours {:on {:l-down "edit-minutes"
                                                            :a-down {:actions ["incrementAlarmHours"]}}}
                                          :edit-minutes {:on {:l-down "default"
                                                              :a-down {:actions ["incrementAlarmMinutes"]}}}}
                                 :on {:c-down "stopwatch"
                                      :a-down {:actions ["toggleAlarmMode"]}}}
                    :stopwatch {:initial "default"
                                :states {:default {}}
                                :on {:c-down "setDateTime"}}
                    :setDateTime {:initial "default"
                                  :on {:c-down "dateTime"}
                                  :states {:default {:on {:l-down "edit-minutes"}}
                                           :edit-minutes {:on {:l-down "edit-hours"}}
                                           :edit-hours {:on {:l-down "edit-month"}}
                                           :edit-month {:on {:l-down "edit-day-number"}}
                                           :edit-day-number {:on {:l-down "default"}}}}}})

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

(defn ^:dev/after-load reload []
  (js/location.reload))

(defn ^:export  main []
  (let [os (js/CasioF91WOperatingSystem.)
        actor (xstate/interpret watch-machine)]

    (.subscribe actor (fn [snapshot]
                        (js/console.log
                         "Value:" (.-value snapshot)
                         "Context:" (.-context snapshot))
                        (let [context ^js (.-context snapshot)
                              activeMenu (-> (.-value snapshot)
                                             (js/Object.keys)
                                             (first))
                              activeAction (gobj/get (.-value snapshot) activeMenu)]
                          (set! (.-activeMenu os) activeMenu)
                          (set! (.-activeAction os) activeAction)
                          (js/Object.assign os (j/select-keys context
                                                              [:timeMode
                                                               :alarmOnMark
                                                               :timeSignalOnMark
                                                               :dailyAlarmDateTime])))))
    (.start actor)

    (bind-events actor)))

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

