(ns beep-boop.main
  (:require [babashka.process :refer [sh shell process]]
            [babashka.fs :as fs]))

(def root (-> *file* fs/parent fs/parent fs/parent))

(defn play [fname]
  (process "afplay" (str root "/sounds/" fname ".wav")))

(defmacro time-ret
  [expr]
  `(let [start# (. System (nanoTime))
         ret# ~expr]
     [(/ (double (- (. System (nanoTime)) start#)) 1000000.0) ret#]))

(defn -main [& args]
  (play "start")
  (let [[elapsed-ms prc] (time-ret (apply shell {:continue true} args))]
    (println "... " elapsed-ms "ms")
    (if (zero? (:exit prc))
      (play "success")
      (play "fail"))
    (System/exit (:exit prc))))
