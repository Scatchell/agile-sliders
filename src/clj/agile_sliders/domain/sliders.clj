(ns agile-sliders.domain.sliders
  (:require [clojure.set :as set]))

(defn sliders-data [session-data]
  (let [new-session-data
        (->> session-data
             :sliders
             (map #(set/rename-keys % {:initial_pos :initial-pos}))
             (assoc session-data :sliders))]

    (select-keys new-session-data [:name :sliders])))

(defn- matching-slider-position [slider-name sliders]
  (:current_pos (first (filter
                         (fn [version-slider]
                           (= (:name version-slider) slider-name))
                         sliders)))
  )

(defn sliders-data-version [session-data version-name]
  (let [selected-version-sliders (:sliders (->> session-data
                                                :versions
                                                (filter #(= (:version-name %) version-name))
                                                first))
        session-data-without-versions (dissoc session-data :versions)]

    (->> (:sliders session-data)
         (map (fn [session-slider]
                (assoc session-slider :initial_pos
                                      (matching-slider-position
                                        (:name session-slider)
                                        selected-version-sliders))))
         (assoc session-data-without-versions :sliders))))

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
