(ns casio.app-test
  (:require
   ["xstate" :as xstate]
   [casio.app :refer [watch-machine make-machine]]
   [clojure.test :refer [async deftest is testing]]
   [statecharts.core :as fsm]
   [statecharts.service :as service]))

(def ^:dynamic *bip-counter* nil)

(defn play-bip-mocked []
  (is (some? *bip-counter*)
      "Unexpected playBip action. Wrap in `with-expected-bip` in case it is expected.")
  (swap! *bip-counter* inc))

(defn make-xstate-watch-actor []
  (let [actor (-> watch-machine
                  (.withConfig #js {:actions #js {:playBip play-bip-mocked}})
                  xstate/interpret)]
    (.start actor)
    actor))

(deftype XStateService [actor]
  service/IService
  (start [_this]
    (.start actor))
  (send [_this event]
    (assert (keyword? event))
    (.send actor #js {:type (name event)}))
  (state [_this]
    (let [context (js->clj (.-context (.getSnapshot actor))
                           :keywordize-keys true)
          value (js->clj (.-value (.getSnapshot actor))
                         :keywordize-keys true)
          ret (assoc context :_state value)]
      ret))
  (add-listener [_this _id _listener]
    (throw (js/Error. "Not implemented")))
  (reload [_this _fsm]
    (throw (js/Error. "Not implemented"))))

(defn transform-state [state]
  (cond (keyword? state) (name state)
        (vector? state) {(first state)
                         (name (second state))}
        :else state))

(defn state-value [actor]
  (-> (fsm/value actor)
      (update-vals transform-state)))

(defn get-context [actor]
  (fsm/state actor))

(defn send [actor event]
  (assert (keyword? event))
  (fsm/send actor event))

(defn make-clj-statecharts-watch-actor []
  (let [action-overrides {:playBip play-bip-mocked}
        machine (make-machine action-overrides)
        service (fsm/service (fsm/machine machine)
                             {:transition-opts {:ignore-unknown-event? true}})]
    (fsm/start service)
    service))

(defn test-machine [f]
  (f (make-clj-statecharts-watch-actor))
  (f (->XStateService (make-xstate-watch-actor))))

(defn with-expected-bip [f]
  (let [!counter (atom 0)]
    (try
      (binding [*bip-counter* !counter]
        (f))
      (finally
        (is (= 1 @!counter))))))

(defn press-c-button [actor]
  (send actor :c-down)
  (send actor :c-up))

(defn press-c-button-with-bip [actor]
  (with-expected-bip #(press-c-button actor)))

(defn press-a-button [actor]
  (send actor :a-down)
  (send actor :a-up))

(defn press-a-button-with-bip [actor]
  (with-expected-bip #(press-a-button actor)))

(defn press-l-button [actor]
  (send actor :l-down)
  ;; Light turns on in all states even when switching alarm or setting date time.
  (is (= "on" (:light (state-value actor))))
  (send actor :l-up))

(deftest cycle-through-modes
  (test-machine
   (fn [actor]
     (is (= {:dateTime "default"} (:watch (state-value actor))))
     (press-c-button-with-bip actor)
     (is (= {:dailyAlarm "default"} (:watch (state-value actor))))
     (press-c-button-with-bip actor)
     (is (= {:stopwatch "default"} (:watch (state-value actor))))
     (press-c-button-with-bip actor)
     (is (= {:setDateTime "default"} (:watch (state-value actor))))
     (press-c-button-with-bip actor)
     (is (= {:dateTime "default"} (:watch (state-value actor)))))))

(deftest toggle-light
  (test-machine
   (fn [actor]
     (is (= "off" (:light (state-value actor))))
     (send actor :l-down)
     (is (= "on" (:light (state-value actor))))
     (send actor :l-up)
     (is (= "off" (:light (state-value actor)))))))

(deftest toggle-time-mode
  (test-machine
   (fn [actor]
     (is (= "24" (:timeMode (get-context actor))))
     (press-a-button actor)
     (is (= "12" (:timeMode (get-context actor))))
     (press-a-button actor)
     (is (= "24" (:timeMode (get-context actor)))))))

(deftest cycle-alarm-modes
  (test-machine
   (fn [actor]
     (press-c-button-with-bip actor)
     (is (= false (:alarmOnMark (get-context actor))))
     (is (= false (:timeSignalOnMark (get-context actor))))
     (press-a-button-with-bip actor)
     (is (= true (:alarmOnMark (get-context actor))))
     (is (= false (:timeSignalOnMark (get-context actor))))
     (press-a-button-with-bip actor)
     (is (= false (:alarmOnMark (get-context actor))))
     (is (= true (:timeSignalOnMark (get-context actor))))
     (press-a-button-with-bip actor)
     (is (= true (:alarmOnMark (get-context actor))))
     (is (= true (:timeSignalOnMark (get-context actor))))
     (press-a-button-with-bip actor)
     (is (= false (:alarmOnMark (get-context actor))))
     (is (= false (:timeSignalOnMark (get-context actor))))
     (testing "c button after alarm mode was changed goes back to main date time screen"
       (press-c-button-with-bip actor)
       (is (= {:dateTime "default"} (:watch (state-value actor))))))))

(deftest set-alarm
  (test-machine
   (fn [actor]
     (press-c-button-with-bip actor)
     (press-l-button actor)
     (press-a-button actor)
     (press-a-button actor)
     (press-l-button actor)
     (press-a-button actor)
     (press-a-button actor)
     (press-a-button actor)
     (press-l-button actor)
     (let [{:keys [dailyAlarmDateTime alarmOnMark]} (get-context actor)]
       (is (= true alarmOnMark))
       (is (= 9 (.getHours dailyAlarmDateTime)))
       (is (= 3 (.getMinutes dailyAlarmDateTime))))
     (testing "c button after alarm was set goes back to main date time screen"
       (press-c-button-with-bip actor)
       (is (= {:dateTime "default"} (:watch (state-value actor))))))))

(deftest stopwatch
  (test-machine
   (fn [actor]
     (press-c-button-with-bip actor)
     (press-c-button-with-bip actor)
     (is (= {:stopwatch "default"} (:watch (state-value actor))))
     (is (nil? (:stopwatchInterval (get-context actor))))
     (is (= 0 (.getMilliseconds (:stopwatchDateTime (get-context actor)))))
     (is (= nil (:stopwatchDateTimeSplit (get-context actor))))
     (testing "start stopwatch"
       (press-a-button-with-bip actor)
       (is (some? (:stopwatchInterval (get-context actor)))))
     (async done
            (js/setTimeout
             (fn []
               (testing "set lap time"
                 (press-l-button actor)
                 (is (inst? (:stopwatchDateTimeSplit (get-context actor)))))
               (testing "stopwatch keeps running when switching back to time screen and back"
                 (is (pos? (.getMilliseconds (:stopwatchDateTime (get-context actor)))))
                 (is (some? (:stopwatchInterval (get-context actor))))
                 (press-c-button-with-bip actor)
                 (is (= {:dateTime "default"} (:watch (state-value actor))))
                 (press-c-button-with-bip actor)
                 (press-c-button-with-bip actor)
                 (is (= {:stopwatch "default"} (:watch (state-value actor))))
                 (is (pos? (.getMilliseconds (:stopwatchDateTime (get-context actor)))))
                 (is (some? (:stopwatchInterval (get-context actor))))
                 (is (inst? (:stopwatchDateTimeSplit (get-context actor)))))
               (testing "clear lap time"
                 (press-l-button actor)
                 (is (nil? (:stopwatchDateTimeSplit (get-context actor)))))
               (testing "stop"
                 (press-a-button-with-bip actor)
                 (is (pos? (.getMilliseconds (:stopwatchDateTime (get-context actor)))))
                 (is (nil? (:stopwatchInterval (get-context actor)))))
               (testing "clear stopwatch"
                 (press-l-button actor)
                 (is (= 0 (.getMilliseconds (:stopwatchDateTime (get-context actor))))))
               (done))
             15)))))

(deftest set-datetime
  (test-machine
   (fn [actor]
     (press-c-button-with-bip actor)
     (press-c-button-with-bip actor)
     (press-c-button-with-bip actor)
     (is (= {:setDateTime "default"} (:watch (state-value actor))))
     (is (= 0 (:dateTimeOffset (get-context actor))))
     ;; TODO reset seconds
     (testing "increment hour"
       (press-l-button actor)
       (press-a-button actor)
       (is (= 3600000 (:dateTimeOffset (get-context actor)))))
     (testing "increment minute"
       (press-l-button actor)
       (press-a-button actor)
       (is (= 3660000 (:dateTimeOffset (get-context actor)))))
     ;; TODO increment month
     ;; TODO increment day of month
     (press-c-button-with-bip actor)
     (is (= {:dateTime "default"} (:watch (state-value actor)))))))
