(ns casio.xstate
  (:require
   [statecharts.service :as service]))

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

