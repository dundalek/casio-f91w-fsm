(ns casio.app
  (:require
   ["xstate" :as xstate]
   [applied-science.js-interop :as j]
   [goog.object :as gobj]
   ["/casio/machine" :refer [machine]]
   ["@xstate/inspect" :refer [inspect]]))

(defn make-time [hours minutes seconds]
  (doto (js/Date.)
    (.setHours hours)
    (.setMinutes minutes)
    (.setSeconds seconds)))

(defn assign-context [f]
  (xstate/assign
   (fn [^js params]
     ;; for xstate v4
     (f params)
     ;; for v5
     #_(f (.-context params)))))

(defn update-datetime-handler [f]
  (assign-context
   (fn [^js context]
     (let [now (js/Date.now)
           current (js/Date. (+ now (.-dateTimeOffset context)))
           _ (f current)
           dateTimeOffset (- (.getTime current) now)]
       #js {:dateTimeOffset dateTimeOffset}))))

(def actions
  (j/lit {:toggleTimeMode (assign-context
                           (fn [^js context]
                             (let [mode (if (= (.-timeMode context) "24")
                                          "12" "24")]
                               #js {:timeMode mode})))
          :toggleAlarmMode (assign-context
                            (fn [^js context]
                              (let [alarmOnMark (.-alarmOnMark context)
                                    timeSignalOnMark (.-timeSignalOnMark context)]
                                (cond
                                  (and alarmOnMark timeSignalOnMark) #js {:alarmOnMark false :timeSignalOnMark false}
                                  alarmOnMark #js {:alarmOnMark false :timeSignalOnMark true}
                                  timeSignalOnMark #js {:alarmOnMark true :timeSignalOnMark true}
                                  :else #js {:alarmOnMark true :timeSignalOnMark false}))))
          :enableAlarmOnMark (assign-context (constantly #js {:alarmOnMark true}))
          :incrementAlarmHours (assign-context
                                (fn [^js context]
                                  #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                             (.setHours (inc (.getHours (.-dailyAlarmDateTime context)))))}))
          :incrementAlarmMinutes (assign-context
                                  (fn [^js context]
                                    #js {:dailyAlarmDateTime (doto (js/Date. (.-dailyAlarmDateTime context))
                                                               (.setMinutes (inc (.getMinutes (.-dailyAlarmDateTime context)))))}))
          :resetTimeSeconds (update-datetime-handler #(.setSeconds % 0))
          :incrementTimeMinutes (update-datetime-handler #(.setMinutes % (inc (.getMinutes %))))
          :incrementTimeHours (update-datetime-handler #(.setHours % (inc (.getHours %))))
          :incrementDateMonth (update-datetime-handler #(.setMonth % (inc (.getMonth %))))
          :incrementDateDay (update-datetime-handler #(.setDate % (inc (.getDate %))))}))

(def watch-machine
  (-> machine
      (.withConfig #js {:actions actions})
      (.withContext (j/lit {:timeMode "24"
                            :alarmOnMark false
                            :timeSignalOnMark false
                            :dailyAlarmDateTime (make-time 7 0 0)
                            :dateTimeOffset 0}))))

(defn bind-events [actor]
  (let [button-l (js/document.querySelector "#buttonL")
        button-c (js/document.querySelector "#buttonC")
        button-a (js/document.querySelector "#buttonA")]
    (.addEventListener button-l "mousedown" #(.send actor #js {:type "l-down"}))
    (.addEventListener button-l "mouseup" #(.send actor #js {:type "l-up"}))
    (.addEventListener button-c "mousedown" #(.send actor #js {:type "c-down"}))
    (.addEventListener button-c "mouseup" #(.send actor #js {:type "c-up"}))
    (.addEventListener button-a "mousedown" #(.send actor #js {:type "a-down"}))
    (.addEventListener button-a "mouseup" #(.send actor #js {:type "a-up"}))))

(defn ^:dev/after-load reload []
  (js/location.reload))

(defn ^:export  main []
  (let [os (js/CasioF91WOperatingSystem.)
        inspect? false
        _ (when inspect?
            (let [iframe (js/document.createElement "iframe")]
              (set! (.-style iframe) "flex-grow: 1; align-self: stretch;")
              (.appendChild js/document.body iframe)
              (inspect #js {:iframe iframe})))
        actor (xstate/interpret watch-machine
                                #js {:devTools inspect?})]

    (.subscribe actor (fn [snapshot]
                        (js/console.log
                         "Value:" (.-value snapshot)
                         "Context:" (.-context snapshot))
                        (let [context ^js (.-context snapshot)
                              activeMenu (-> (.-value snapshot)
                                             (js/Object.keys)
                                             (first))
                              activeAction (gobj/get (.-value snapshot) activeMenu)]
                          (set! (.-activeMenu os) activeMenu)
                          (set! (.-activeAction os) activeAction)
                          (js/Object.assign os (j/select-keys context
                                                              [:timeMode
                                                               :alarmOnMark
                                                               :timeSignalOnMark
                                                               :dailyAlarmDateTime
                                                               :dateTimeOffset])))))
    (.start actor)

    (bind-events actor))

  #_(let [;myCasioF91W (js/CasioF91W.)
          actor (xstate/interpret machine
                                  (j/lit {:input {:timeMode "24"
                                                  :alarmOnMark false
                                                  :timeSignalOnMark false
                                                  :dailyAlarmDateTime (make-time 7 0 0)}}))]

      (.subscribe actor (fn [snapshot] (.log js/console "Value:" (.-value snapshot))))
      (.start actor)

      (.send actor #js {:type "toggle"})
      (.send actor #js {:type "toggle"})))

; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-down"})))

    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-up"})
    ; (.send actor #js {:type "a-down"})
    ; (.send actor #js {:type "a-up"})
    ;
    ; (js/console.log "state" (.-state.value actor))))
