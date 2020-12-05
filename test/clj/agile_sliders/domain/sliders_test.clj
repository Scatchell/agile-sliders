(ns agile-sliders.domain.sliders-test
  (:require [clojure.test :refer :all])
  (:require [agile-sliders.domain.sliders :refer [sliders-data]]))

(deftest sliders-data-test
  (is (= [{:name "slider 1"
           :step 1
           :initial-pos 50
           }

          {:name "slider 2"
           :step 1
           :initial-pos 50
           }]
         (sliders-data 2 {:step 1
                          :initial-pos 50})))
  )
