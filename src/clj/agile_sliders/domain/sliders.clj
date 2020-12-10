(ns agile-sliders.domain.sliders
  (:require [clojure.set :as set]))


(defn sliders-data [session-data]
  (let [new-session-data
        (->> session-data
             :sliders
             (map #(set/rename-keys % {:initial_pos :initial-pos}))
             (assoc session-data :sliders))]

    (dissoc new-session-data :session-id)))

(defn- matching-slider-position [slider-name sliders]
  (:current_pos (first (filter
                         (fn [version-slider]
                           (= (:name version-slider) slider-name))
                         sliders)))
  )

(defn- matching-slider-versions-for [slider versions]
  (merge slider
         {:versions (map (fn [slider-version]
                           {:name        (:version-name slider-version)
                            :initial-pos (:current_pos (first (filter #(= (:name %) (:name slider))
                                                                      (:sliders slider-version)))
                                           )}) versions)})
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
         (assoc session-data-without-versions :sliders)
         (#(assoc % :version-name version-name)))))

(defn sliders-average-for [sliders]
  (let [average (/ (reduce (fn [total slider] (+ total (:initial-pos slider))) 0 sliders) (count sliders))]
    (Math/round (double average))))

(defn- items-present-in-all-cols [cols]
  (->> cols
       flatten
       frequencies
       (filter #(= (val %) (count cols)))
       keys)
  )

(defn best-step-for [numbers]
  (let [steps (map (fn [num]
                     (filter #(= 0 (mod num %))
                             (range 1 (+ 1 num))))
                   numbers)]

    (->> steps
         items-present-in-all-cols
         (apply max)))
  )

(defn sliders-data-with-all-versions [session-data]
  (let [sliders-data (sliders-data session-data)
        slider-positions
        (->> sliders-data
             :sliders
             (map (fn [slider] (matching-slider-versions-for slider (:versions session-data))))
             (map (fn [slider] (assoc slider :initial-pos (sliders-average-for (:versions slider))))))

        best-step (->> slider-positions
                       (map :initial-pos)
                       best-step-for)]

    (->> slider-positions
         (map #(assoc % :step best-step))
         (assoc sliders-data :sliders)
         (#(dissoc % :versions)))
    ))

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
