(ns casio.app-test
  (:require
   [casio.app :refer [watch-machine]]
   [clojure.test :refer [deftest is]]
   ["xstate" :as xstate]))

(defn press-c-button [actor]
  (.send actor #js {:type "c-down"})
  (.send actor #js {:type "c-up"}))

(defn press-a-button [actor]
  (.send actor #js {:type "a-down"})
  (.send actor #js {:type "a-up"}))

(defn state-value [^Actor actor]
  (js/console.log "actor")
  (js->clj (.-value (.getSnapshot actor))
           :keywordize-keys true))

(defn ^js get-context [^Actor actor]
  (.-context (.getSnapshot actor)))

(defn make-watch-actor []
  (let [actor (xstate/interpret watch-machine)]
    (.start actor)
    actor))

(deftest cycle-through-modes
  (let [actor (make-watch-actor)]
    (is (= {:dateTime "default"} (state-value actor)))
    (press-c-button actor)
    (is (= {:dailyAlarm "default"} (state-value actor)))
    (press-c-button actor)
    (is (= {:stopwatch "default"} (state-value actor)))
    (press-c-button actor)
    (is (= {:setDateTime "default"} (state-value actor)))
    (press-c-button actor)
    (is (= {:dateTime "default"} (state-value actor)))))

(deftest toggle-time-mode
  (let [actor (make-watch-actor)]
    (is (= "24" (.-timeMode (get-context actor))))
    (press-a-button actor)
    (is (= "12" (.-timeMode (get-context actor))))
    (press-a-button actor)
    (is (= "24" (.-timeMode (get-context actor))))))

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
  (let [actor (make-watch-actor)]
    (.send actor #js {:type "c-down"})
    (.send actor #js {:type "l-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "l-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "a-down"})
    (.send actor #js {:type "l-down"})
    (let [context (get-context actor)
          dailyAlarmDateTime (.-dailyAlarmDateTime context)]
      (is (= {:dailyAlarm "default"} (state-value actor)))
      (is (= true (.-alarmOnMark context)))
      (is (= 9 (.getHours dailyAlarmDateTime)))
      (is (= 3 (.getMinutes dailyAlarmDateTime))))))
