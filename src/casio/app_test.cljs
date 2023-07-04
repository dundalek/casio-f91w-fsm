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
  (js->clj (.-state.value actor)
           :keywordize-keys true))

(defn make-watch-actor []
  (let [actor (xstate/interpret watch-machine)]
    (.start actor)
    actor))

(deftest cycle-through-modes
  (let [actor (make-watch-actor)]
    (is (= {:DateTime "Default"} (state-value actor)))
    (press-c-button actor)
    (is (= "DailyAlarm" (state-value actor)))
    (press-c-button actor)
    (is (= "Stopwatch" (state-value actor)))
    (press-c-button actor)
    (is (= "SetDateTime" (state-value actor)))
    (press-c-button actor)
    (is (= {:DateTime "Default"} (state-value actor)))))

(deftest toggle-time-mode
  (let [actor (make-watch-actor)]
    (is (= "24" (.-state.context.timeMode actor)))
    (press-a-button actor)
    (is (= "12" (.-state.context.timeMode actor)))
    (press-a-button actor)
    (is (= "24" (.-state.context.timeMode actor)))))

#_(deftest toggle-casio-screen)
