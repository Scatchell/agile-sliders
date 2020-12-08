(ns agile-sliders.db.core
  (:require
    [monger.core :as mg]
    [monger.collection :as mc]
    [monger.operators :refer :all]
    [mount.core :refer [defstate]]
    [agile-sliders.config :refer [env]]))

(defstate db*
          :start (-> env :database-url mg/connect-via-uri)
          :stop (-> db* :conn mg/disconnect))

(defstate db
          :start (:db db*))

(defn create-session [session]
  (mc/insert db "sessions" session))

(defn create-session-version [session-version session-id]
  ;todo make sure user cannot add two different slider versions (i.e. remove duplicates matched by version-name)
  (mc/update db "sessions"
             {:session-id session-id}
             {$addToSet {:versions session-version}}))

(defn update-session [id first-name last-name email]
  (mc/update db "sessions" {:_id id}
             {$set {:first_name first-name
                    :last_name  last-name
                    :email      email}}))

(defn get-session [session-id]
  (mc/find-one-as-map db "sessions" {:session-id session-id}))
