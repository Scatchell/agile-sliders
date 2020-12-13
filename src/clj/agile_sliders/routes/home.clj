(ns agile-sliders.routes.home
  (:require
    [agile-sliders.layout :as layout]
    [clojure.java.io :as io]
    [agile-sliders.middleware :as middleware]
    [ring.util.response]
    [ring.util.http-response :as response]
    [agile-sliders.domain.sliders :refer :all]
    [agile-sliders.db.core :as db]
    [struct.core :as st]
    [nano-id.core :refer [nano-id]]
    [clojure.set :as set]))

(defn example-page [request]
  (layout/render request "sliders.html" (assoc (sliders-data (sliders-mock-data)) :example-page true)))

(defn get-session [request]
  (let [session-id (get-in request [:path-params :session-id])
        value (sliders-data (db/get-session session-id))]
    (layout/render request "sliders.html" value)))

(defn about-page [request]
  (layout/render request "about.html"
                 {:about-content (-> "docs/about.md" io/resource slurp)}))

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
    {:message  "Must have no more than 30 sliders for a session."
     :validate #(<= (count %) 30)}
    {:message  "Must have at least 2 sliders for a session."
     :validate #(> (count %) 1)}
    {:message  "Each slider must have a name."
     :validate #(every? (fn [slider] (contains? slider :name)) %)}]])

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

(defn save-new-session-version [request extra-session-data]
  (let [session-version-data (set/rename-keys
                               (get-in request [:body-params])
                               {:version_name :version-name})
        session-id (get-in request [:path-params :session-id])]
    (db/create-session-version
      (merge session-version-data extra-session-data)
      session-id)
    (response/ok {:session-id   session-id
                  :version-name (:version-name session-version-data)}))
  )

(defn new-session-version! [request]
  (save-new-session-version request {}))

(defn new-output-session-version! [request]
  (save-new-session-version request {:output-version true}))

(defn forward-to-create-session-page [request]
  (response/temporary-redirect "/create"))

(defn get-session-or-output-version [request extra-session-data]
  (let [session-id (get-in request [:path-params :session-id])
        version-name (get-in request [:path-params :version-name])]
    (layout/render request "sliders.html"
                   (merge
                     (sliders-data-version
                       (sliders-data
                         (db/get-session session-id)) version-name)
                     extra-session-data)))
  )

(defn get-session-version [request]
  (get-session-or-output-version request {})
  )

(defn get-session-output-version [request]
  (get-session-or-output-version request {:output-session true})
  )

(defn aggregate-all-slider-versions [request]
  (let [session-id (get-in request [:path-params :session-id])]
    (layout/render request "sliders-aggregate.html"
                   (assoc
                     (sliders-data-with-all-versions
                       (sliders-data
                         (db/get-session session-id)))
                     :aggregate true))))

(defn home-routes []
  [""
   {:middleware [middleware/wrap-formats]}
   ["/" {:get forward-to-create-session-page}]
   ["/example" {:get example-page}]
   ["/create" {:get create-session-page}]
   ["/session/:session-id" {:get get-session}]
   ["/session/:session-id/version" {:post new-session-version!}]
   ["/session/:session-id/output" {:post new-output-session-version!}]
   ["/session/:session-id/aggregate" {:get aggregate-all-slider-versions}]
   ["/session/:session-id/output/:version-name" {:get get-session-output-version}]
   ["/session/:session-id/version/:version-name" {:get get-session-version}]
   ["/session" {:post save-session-data!}]
   ["/about" {:get about-page}]])