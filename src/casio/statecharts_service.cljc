(ns casio.statecharts-service
  (:require
   [statecharts.core :as fsm]))

(defn transform-state [state]
  (cond (keyword? state) (name state)
        (vector? state) {(first state)
                         (name (second state))}
        :else state))

(defn state-value [actor]
  (-> (fsm/value actor)
      (update-vals transform-state)))
