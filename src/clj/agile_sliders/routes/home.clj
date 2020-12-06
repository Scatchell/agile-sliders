(ns agile-sliders.routes.home
  (:require
    [agile-sliders.layout :as layout]
    [clojure.java.io :as io]
    [agile-sliders.middleware :as middleware]
    [ring.util.response]
    [ring.util.http-response :as response]
    [agile-sliders.domain.sliders :refer [sliders-data sliders-mock-data]]
    [agile-sliders.db.core :as db]
    [struct.core :as st]
    [nano-id.core :refer [nano-id]]
    ))

(defn example-page [request]
  (layout/render request "example.html" (sliders-mock-data)))

(defn get-session [request]
  (let [session-id (get-in request [:path-params :session-id])]
    (clojure.pprint/pprint (db/get-session session-id))
    (layout/render request "sliders.html" (sliders-data (db/get-session session-id)))))

(defn about-page [request]
  (layout/render request "about.html"))

(defn create-session-page [request]
  (layout/render request "create-session.html"))

(def session-schema
  [[:name
    [st/required :message "Each session requires a name."]
    st/string
    {:message  "Session name must be less than 100 characters."
     :validate #(< (count %) 100)}]

   [:sliders
    st/required
    st/coll
    {:message  "Must have at least 2 sliders for a session."
     :validate #(> (count %) 1)}
    {:message  "Each slider must have a name."
     :validate #(every? (fn [item] (contains? item :name)) %)}
    ]])

(defn validate-session [params]
  (first (st/validate params session-schema)))

(defn save-session-data! [request]
  (let [session-data (get-in request [:body-params])
        session-id (nano-id 10)]
    (if-let [errors (validate-session session-data)]
      (response/unprocessable-entity (assoc session-data :errors errors))
      (do
        (db/create-session (merge session-data {:session-id session-id}))
        (response/ok {:session-id session-id})))))

(defn forward-to-create-session-page [request]
  (response/temporary-redirect "/create"))

(defn home-routes []
  [""
   {:middleware [middleware/wrap-formats]}
   ["/" {:get forward-to-create-session-page}]
   ["/example" {:get example-page}]
   ["/create" {:get create-session-page}]
   ["/session/:session-id" {:get get-session}]
   ["/session" {:post save-session-data!}]
   ["/about" {:get about-page}]])

