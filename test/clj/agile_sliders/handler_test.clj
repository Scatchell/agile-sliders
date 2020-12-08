(ns agile-sliders.handler-test
  (:require
    [clojure.test :refer :all]
    [ring.mock.request :refer :all]
    [agile-sliders.handler :refer :all]
    [agile-sliders.middleware.formats :as formats]
    [muuntaja.core :as m]
    [mount.core :as mount]
    [agile-sliders.db.core :as db]
    [monger.collection :as mc]
    ))

(defn parse-json [body]
  (m/decode formats/instance "application/json" body))

(use-fixtures
  :once
  (fn [f]
    (mount/start #'agile-sliders.config/env
                 #'agile-sliders.db.core/db*
                 #'agile-sliders.db.core/db
                 #'agile-sliders.handler/app-routes)
    (f)))

(use-fixtures
  :each
  (fn [f]
    (f)
    (mc/drop db/db "sessions")))

(deftest test-app
  (testing "main route"
    (let [response ((app) (request :get "/"))]
      (is (= 307 (:status response)))))

  (testing "not-found route"
    (let [response ((app) (request :get "/invalid"))]
      (is (= 404 (:status response)))))

  #_(testing "should"
    (db/create-session {:session-id "12345"
                        :name       "session 1"
                        :sliders    [{:name        "slider 1"
                                      :step        10
                                      :initial-pos 50
                                      }

                                     {:name        "slider 2"
                                      :step        10
                                      :initial-pos 50
                                      }]})
    (let [response ((app) (request :get "/"))])
    )
  )

