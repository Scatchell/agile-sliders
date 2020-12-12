(ns agile-sliders.domain.sliders-test
  (:require [clojure.test :refer :all])
  (:require [agile-sliders.domain.sliders :refer :all]))

(deftest sliders-data-test
  (is (= {:name           "session 1"
          :max-slider-val 10
          :sliders        [{:name        "slider 1"
                            :step        10
                            :initial-pos 5
                            }

                           {:name        "slider 2"
                            :step        10
                            :initial-pos 5
                            }]}
         (sliders-data {:session-id "blah"
                        :name       "session 1"
                        :sliders    [{:name "slider 1"}
                                     {:name "slider 2"}
                                     ]}))))


(deftest sliders-data-version-test
  (is (= {:name         "session 1"
          :version-name "Bob Jones"
          :sliders      [{:name        "slider 1"
                          :step        1
                          :initial-pos 20
                          }

                         {:name        "slider 2"
                          :step        1
                          :initial-pos 80
                          }]}
         (let [sliders-data-with-versions {:name     "session 1"
                                           :sliders  [{:name "slider 1" :initial-pos 50 :step 1}
                                                      {:name "slider 2" :initial-pos 50 :step 1}
                                                      ]
                                           :versions [{:version-name "James John"
                                                       :sliders      [{:name "slider 1" :current_pos 70}
                                                                      {:name "slider 2" :current_pos 30}]}
                                                      {:version-name "Bob Jones"
                                                       :sliders      [{:name "slider 1" :current_pos 20}
                                                                      {:name "slider 2" :current_pos 80}]}
                                                      ]}
               ]
           (sliders-data-version sliders-data-with-versions "Bob Jones"))))
  )

(deftest sliders-data-with-all-versions-test
  (is (= {:name    "session 1"
          :sliders [{:name        "slider 1"
                     :step        5
                     :initial-pos 45
                     :versions    [{:name        "James John"
                                    :initial-pos 70}
                                   {:name        "Bob Jones"
                                    :initial-pos 20}]
                     }
                    {:name        "slider 2"
                     :step        5
                     :initial-pos 55
                     :versions    [{:name        "James John"
                                    :initial-pos 30}
                                   {:name        "Bob Jones"
                                    :initial-pos 80}]
                     }]}
         (sliders-data-with-all-versions {:name     "session 1"
                                          :sliders  [{:name "slider 1" :initial-pos 50 :step 1}
                                                     {:name "slider 2" :initial-pos 50 :step 1}
                                                     ]
                                          :versions [{:version-name "James John"
                                                      :sliders      [{:name "slider 1" :current_pos 70}
                                                                     {:name "slider 2" :current_pos 30}]}
                                                     {:version-name "Bob Jones"
                                                      :sliders      [{:name "slider 1" :current_pos 20}
                                                                     {:name "slider 2" :current_pos 80}]}
                                                     ]})))
  )

(deftest sliders-average-for-test
  (is (= 45
         (sliders-average-for [{:initial-pos 70}
                               {:initial-pos 20}])))
  )

(deftest best-step-for-test
  (is (= 5 (best-step-for [25 20 50])))
  (is (= 5 (best-step-for [45 55 5])))
  )


(deftest middle-slider-values-for-test
  (is (= 10 (middle-slider-values-for [{:name "slider 1"}
                                       {:name "slider 2"}
                                       {:name "slider 3"}
                                       ])))
  (is (= 15 (middle-slider-values-for [{:name "slider 1"}
                                       {:name "slider 3"}
                                       {:name "slider 4"}
                                       {:name "slider 5"}
                                       ])))
  (is (= 20 (middle-slider-values-for [{:name "slider 1"}
                                       {:name "slider 3"}
                                       {:name "slider 4"}
                                       {:name "slider 5"}
                                       {:name "slider 6"}
                                       ])))
  )

(deftest max-slider-val-for-test
  (is (= 20 (max-slider-val-for [{:name "slider 1"}
                                 {:name "slider 1"}
                                 {:name "slider 1"}
                                 ])))

  (is (= 30 (max-slider-val-for [{:name "slider 1"}
                                 {:name "slider 1"}
                                 {:name "slider 1"}
                                 {:name "slider 1"}
                                 ])))

  )
