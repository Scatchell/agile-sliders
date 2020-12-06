(ns agile-sliders.domain.sliders
  (:require [clojure.set :as set]))

(defn sliders-data [session-data]
  (let [new-session-data
        (->> session-data
             :sliders
             (map #(set/rename-keys % {:initial_pos :initial-pos}))
             (assoc session-data :sliders))]

    (select-keys new-session-data [:name :sliders]))
  )

(defn sliders-mock-data []
  {:name    "Example of a sliders prioritization session"
   :sliders [{:name        "Budget"
              :step        10
              :initial-pos 50
              }
             {:name        "Scope"
              :step        10
              :initial-pos 50
              }
             {:name        "Quality"
              :step        10
              :initial-pos 50
              }
             {:name        "Resiliency"
              :step        10
              :initial-pos 50
              }]})
