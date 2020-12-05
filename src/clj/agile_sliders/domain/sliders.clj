(ns agile-sliders.domain.sliders)

(defn sliders-data [num-of-sliders options]
  (map #(assoc options :name (str "slider " %))
       (range 1 (inc num-of-sliders)))
  )
