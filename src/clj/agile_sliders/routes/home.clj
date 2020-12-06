(ns agile-sliders.routes.home
  (:require
    [agile-sliders.layout :as layout]
    [clojure.java.io :as io]
    [agile-sliders.middleware :as middleware]
    [ring.util.response]
    [ring.util.http-response :as response]
    [agile-sliders.domain.sliders :refer [sliders-data]]))

(defn sliders-page [request]
  (layout/render request "sliders.html" {:sliders
                                         (sliders-data 3
                                                       {:step        10
                                                        :initial-pos 50})}))

(defn about-page [request]
  (layout/render request "about.html"))

(defn home-routes []
  [""
   {:middleware [middleware/wrap-csrf
                 middleware/wrap-formats]}
   ["/" {:get sliders-page}]
   ["/about" {:get about-page}]])

