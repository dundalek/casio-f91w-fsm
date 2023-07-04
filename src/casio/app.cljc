(ns casio.app
  (:require ["xstate" :as xstate]
            [applied-science.js-interop :as j]))

(def watch-machine
  (xstate/createMachine
   (j/lit {:id "toggle"
           :initial "DateTime"
           :context {:timeMode "24"}
           :states {:DateTime {:initial "Default"
                               :states {:Default {:on {:a-down "Holding"}}
                                        :Holding {:on {:a-up "Default"}
                                                  :entry "toggleTimeMode"
                                                  :after {3000 "Casio"}}
                                        :Casio {:on {:a-up "Default"}}}
                               :on {:c-down "DailyAlarm"}},
                    :DailyAlarm {:on {:c-down "Stopwatch"}}
                    :Stopwatch {:on {:c-down "SetDateTime"}}
                    :SetDateTime {:on {:c-down "DateTime"}}}})
   (j/lit {:actions {:toggleTimeMode
                     (xstate/assign
                      #js {:timeMode (fn [^js context]
                                       (if (= (.-timeMode context) "24")
                                         "12" "24"))})}})))

(defn ^:export ^:dev/after-load main []
  (let [;myCasioF91W (js/CasioF91W.)
        actor (xstate/interpret watch-machine)]

    (.subscribe actor (fn [snapshot]
                        (js/console.log
                         "Value:" (.-value snapshot)
                         "Context:" (.-context snapshot))))
    (.start actor)

    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-up"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-up"})

    (js/console.log "state" (.-state.value actor))))

