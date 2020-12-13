(ns agile-sliders.domain.sliders
  (:require [clojure.set :as set]))

(def default-step 10)

(defn- round [num]
  (Math/round (double num))
  )

(defn max-slider-val-for [sliders]
  (* default-step (- (count sliders) 1))
  )

(defn- items-present-in-all-cols [cols]
  (->> cols
       flatten
       frequencies
       (filter #(= (val %) (count cols)))
       keys)
  )

(defn middle-slider-values-for [sliders]
  (/ (max-slider-val-for sliders) 2)
  )

(defn best-step-for [numbers]
  (let [
        steps (->> numbers
                   (filter #(not (= 0 %)))
                   (map (fn [num]
                          (filter #(= 0 (mod num %))
                                  (range 1 (+ 1 num))))))
        ]

    (->> steps
         items-present-in-all-cols
         (apply max)))
  )

(defn sliders-data [session-data]
  (let [middle-slider-value (middle-slider-values-for (:sliders session-data))
        formatted-session-data
        (->> session-data
             :sliders
             (map #(assoc % :initial-pos middle-slider-value))
             (map #(assoc % :step default-step))
             (assoc session-data :sliders))]

    (-> formatted-session-data
        (dissoc :session-id)
        (assoc :max-slider-val (max-slider-val-for (:sliders session-data))))))

(defn- matching-slider-position [slider-name sliders]
  (:current_pos (first (filter
                         (fn [version-slider]
                           (= (:name version-slider) slider-name))
                         sliders)))
  )

(defn- matching-slider-versions-for [slider versions]
  (merge slider
         {:versions (->> versions
                         (map (fn [slider-version]
                                {:name        (:version-name slider-version)
                                 :initial-pos (:current_pos (first (filter #(= (:name %) (:name slider))
                                                                           (:sliders slider-version))))})))})
  )

(defn sliders-data-version [session-data version-name]
  (let [selected-version-sliders (:sliders (->> session-data
                                                :versions
                                                (filter #(= (:version-name %) version-name))
                                                first))
        session-data-without-versions (dissoc session-data :versions)]

    (->> (:sliders session-data)
         (map (fn [session-slider]
                (assoc session-slider :initial-pos
                                      (matching-slider-position
                                        (:name session-slider)
                                        selected-version-sliders))))
         (assoc session-data-without-versions :sliders)
         (#(assoc % :version-name version-name)))))

(defn sliders-average-for [sliders]
  (let [average (/ (reduce (fn [total slider] (+ total (:initial-pos slider))) 0 sliders) (count sliders))]
    (round average)))

(defn sliders-data-with-all-versions [session-data]
  (let [session-data-with-relevant-versions
        (assoc session-data :versions
                            (remove :output-version (:versions session-data)))
        slider-positions
        (->> session-data-with-relevant-versions
             :sliders
             (map (fn [slider] (matching-slider-versions-for slider (:versions session-data-with-relevant-versions))))
             (map (fn [slider] (assoc slider :initial-pos (sliders-average-for (:versions slider))))))

        best-step (->> slider-positions
                       (map :initial-pos)
                       best-step-for)]

    (->> slider-positions
         (map #(assoc % :step best-step))
         (assoc session-data-with-relevant-versions :sliders)
         (#(dissoc % :versions)))
    ))

(defn sliders-mock-data []
  {:name    "Example of a sliders prioritization session"
   :sliders [{:name "Budget"
              }
             {:name "Scope"
              }
             {:name "Quality"
              }
             {:name "Resiliency"
              }]})
