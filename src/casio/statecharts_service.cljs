(ns casio.statecharts-service
  (:require
   [statecharts.core :as fsm]
   [clojure.string :as str]
   [clojure.walk :as walk]
   [casio.machine :refer [context-actions make-context]]
   ["/casio/machine" :as machine]))

(defn transform-state [state]
  (cond (keyword? state) (name state)
        (vector? state) {(first state)
                         (name (second state))}
        :else state))

(defn state-value [actor]
  (-> (fsm/value actor)
      (update-vals transform-state)))

(defn transform-absolute-state-name [s]
  (->> (str/split (subs s 1) #"\.")
       (drop 1)
       (map keyword)
       (into [:>])))

(defn resolve-actions [registry actions]
  (cond
    (keyword? actions) (get registry actions actions)
    (vector? actions) (mapv #(resolve-actions registry %) actions)
    :else actions))

(defn make-machine [action-overrides]
  (let [action-registry (merge (update-vals context-actions fsm/assign)
                               action-overrides)
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
                    (assoc :context (make-context))
                    (dissoc :states)
                    (assoc :regions (:states machine)))]
    machine))

(defn make-service [{:keys [actions]}]
  (let [machine (make-machine actions)
        service (fsm/service (fsm/machine machine)
                             {:transition-opts {:ignore-unknown-event? true}})]
    service))
