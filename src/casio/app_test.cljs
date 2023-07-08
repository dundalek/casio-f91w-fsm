(ns casio.app-test
  (:require
   [casio.app :refer [watch-machine]]
   [clojure.test :refer [deftest is]]
   ["xstate" :as xstate]))

(defn send [actor event]
  (assert (keyword? event))
  (.send actor #js {:type (name event)}))

(defn press-c-button [actor]
  (send actor :c-down)
  (send actor :c-up))

(defn press-a-button [actor]
  (send actor :a-down)
  (send actor :a-up))

(defn state-value [^Actor actor]
  (js->clj (.-value (.getSnapshot actor))
           :keywordize-keys true))

(defn get-context [^Actor actor]
  (js->clj (.-context (.getSnapshot actor))
           :keywordize-keys true))

(defn make-watch-actor []
  (let [actor (xstate/interpret watch-machine)]
    (.start actor)
    actor))

(defn test-machine [f]
  (let [actor (make-watch-actor)]
    (f actor)))

(deftest cycle-through-modes
  (test-machine
   (fn [actor]
     (is (= {:dateTime "default"} (:watch (state-value actor))))
     (press-c-button actor)
     (is (= {:dailyAlarm "default"} (:watch (state-value actor))))
     (press-c-button actor)
     (is (= {:stopwatch "default"} (:watch (state-value actor))))
     (press-c-button actor)
     (is (= {:setDateTime "default"} (:watch (state-value actor))))
     (press-c-button actor)
     (is (= {:dateTime "default"} (:watch (state-value actor)))))))

(deftest toggle-time-mode
  (test-machine
   (fn [actor]
     (is (= "24" (:timeMode (get-context actor))))
     (press-a-button actor)
     (is (= "12" (:timeMode (get-context actor))))
     (press-a-button actor)
     (is (= "24" (:timeMode (get-context actor)))))))

#_(deftest toggle-casio-screen)

#_(deftest cycle-alarm-modes
    (let [actor (make-watch-actor)]
      (.send actor #js {:type "c-down"})
      (.send actor #js {:type "a-down"})
      (.send actor #js {:type "a-down"})
      (.send actor #js {:type "a-down"})
      (.send actor #js {:type "a-down"})

      alarmOnMark timeSignalOnMark))

(deftest set-alarm
  (test-machine
   (fn [actor]
     (send actor :c-down)
     (send actor :l-down)
     (send actor :a-down)
     (send actor :a-down)
     (send actor :l-down)
     (send actor :a-down)
     (send actor :a-down)
     (send actor :a-down)
     (send actor :l-down)
     (let [{:keys [dailyAlarmDateTime alarmOnMark]} (get-context actor)]
       (is (= {:dailyAlarm "modified"} (:watch (state-value actor))))
       (is (= true alarmOnMark))
       (is (= 9 (.getHours dailyAlarmDateTime)))
       (is (= 3 (.getMinutes dailyAlarmDateTime)))))))
