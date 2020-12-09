(ns agile-sliders.domain.sliders-test
  (:require [clojure.test :refer :all])
  (:require [agile-sliders.domain.sliders :refer :all]))

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
                        :sliders    [{:name "slider 1" :initial_pos 50 :step 1}
                                     {:name "slider 2" :initial_pos 50 :step 1}
                                     ]}))))


(deftest sliders-data-version-test
  (is (= {:name         "session 1"
          :version-name "Bob Jones"
          :sliders      [{:name        "slider 1"
                          :step        1
                          :initial_pos 20
                          }

                         {:name        "slider 2"
                          :step        1
                          :initial_pos 80
                          }]}
         (let [sliders-data-with-versions {:name     "session 1"
                                           :sliders  [{:name "slider 1" :initial_pos 50 :step 1}
                                                      {:name "slider 2" :initial_pos 50 :step 1}
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

(deftest sliders-data-with-versions-test
  (is (= {:name    "session 1"
          :sliders [{:name        "slider 1"
                     :step        1
                     :initial-pos 50
                     :versions    [{:name        "James John"
                                    :initial-pos 70}
                                   {:name        "Bob Jones"
                                    :initial-pos 20}]
                     }
                    {:name        "slider 2"
                     :step        1
                     :initial-pos 50
                     :versions    [{:name        "James John"
                                    :initial-pos 30}
                                   {:name        "Bob Jones"
                                    :initial-pos 80}]
                     }]}
         (sliders-data-with-all-versions {:session-id "blah"
                                          :name       "session 1"
                                          :sliders    [{:name "slider 1" :initial_pos 50 :step 1}
                                                       {:name "slider 2" :initial_pos 50 :step 1}
                                                       ]
                                          :versions   [{:version-name "James John"
                                                        :sliders      [{:name "slider 1" :current_pos 70}
                                                                       {:name "slider 2" :current_pos 30}]}
                                                       {:version-name "Bob Jones"
                                                        :sliders      [{:name "slider 1" :current_pos 20}
                                                                       {:name "slider 2" :current_pos 80}]}
                                                       ]})))
  )
