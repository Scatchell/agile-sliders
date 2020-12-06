(ns agile-sliders.domain.sliders-test
  (:require [clojure.test :refer :all])
  (:require [agile-sliders.domain.sliders :refer [sliders-data]]))

(deftest sliders-data-test
  (is (= {:name    "session 1"
          :sliders [{:name        "slider 1"
                     :step        1
                     :initial-pos 50
                     }

                    {:name        "slider 2"
                     :step        1
                     :initial-pos 50
                     }]}
         (sliders-data {:session-id "blah"
                        :name       "session 1"
                        :sliders    [{:name "slider 1", :initial_pos 50, :step 1}
                                     {:name "slider 2", :initial_pos 50, :step 1}
                                     ]})))
  )
