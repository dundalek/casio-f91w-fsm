(ns casio.app
  (:require ["xstate" :as xstate]
            [applied-science.js-interop :as j]))

(def toggleMachine
  (xstate/createMachine
   (j/lit {:id "toggle",
           :initial "Inactive",
           :states {:Inactive {:on {:toggle "Active"}},
                    :Active {:on {:toggle "Inactive"}}}})))

(defn ^:export ^:dev/after-load main []
  (let [;myCasioF91W (js/CasioF91W.)
        actor (xstate/interpret toggleMachine)]

    (.subscribe actor (fn [snapshot] (.log js/console "Value:" (.-value snapshot))))
    (.start actor)

    (.send actor #js {:type "toggle"})
    (.send actor #js {:type "toggle"})))
