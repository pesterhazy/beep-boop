(ns beep-boop.main
  (:require [babashka.process :refer [sh shell process]]
            [babashka.fs :as fs]))

(def root (-> *file* fs/parent fs/parent fs/parent))

(defn play [fname]
  (process "afplay" (str root "/sounds/" fname ".wav")))

(defn -main [& args]
  (play "start")
  (let [prc (apply shell {:continue true} args)]
    (if (zero? (:exit prc))
      (play "success")
      (play "fail"))
    (System/exit (:exit prc))))
