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

(defn sliders-mock-data [num-of-sliders options]
  (map #(assoc options :name (str "num-" %))
       (range 1 (inc num-of-sliders)))
  )

