(ns casio.xstate-service
  (:require
   ["/casio/machine" :as machine]
   [casio.machine :refer [context-actions make-context]]
   [statecharts.service :as service]
   ["xstate" :as xstate]))

;; In practice we should be less wasteful and use clj->js and js->clj less,
;; but it should be good enough for demo purposes.

(defn snapshot->state [snapshot]
  (let [context (js->clj (.-context snapshot)
                         :keywordize-keys true)
        value (js->clj (.-value snapshot)
                       :keywordize-keys true)]
    (assoc context :_state value)))

(deftype XStateService [actor]
  service/IService
  (start [_this]
    (.start actor))
  (send [_this event]
    (assert (keyword? event))
    (.send actor #js {:type (name event)}))
  (state [_this]
    (snapshot->state (.getSnapshot actor)))
  (add-listener [_this _id listener]
    (.subscribe actor
                (fn [snapshot]
                  (listener nil (snapshot->state snapshot)))))
  (reload [_this _fsm]
    (throw (js/Error. "Not implemented"))))

(defn xstate-assign-context [f]
  (xstate/assign
   (fn [^js params]
     (let [context params] ; for xstate v4
           ;context (.-context params) ; for v5
       (clj->js (f (js->clj context :keywordize-keys true)))))))

(def watch-machine
  (-> machine/machine
      (.withConfig #js {:actions (clj->js (update-vals context-actions xstate-assign-context))})))

(defn make-service [{:keys [actions options]}]
  (let [actor (-> watch-machine
                  (.withConfig #js {:actions (clj->js actions)})
                  (.withContext (clj->js (make-context)))
                  (xstate/interpret options))
        service (->XStateService actor)]
    service))
