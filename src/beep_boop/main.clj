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

(def green "\u001B[32m")
(def red "\u001B[31m")

(defn bar [color width fill-char]
  (let [reset-color "\u001B[0m"
        bar (apply str (repeat width fill-char))]
    (println (str color bar reset-color))))

(defn -main [& args]
  (play "start")
  (let [[elapsed-ms prc] (time-ret (apply shell {:continue true} args))]
    (bar (if (zero? (:exit prc))
           green
           red)
         60
         "\u2588")
    (println "... " (long elapsed-ms) "ms")
    (if (zero? (:exit prc))
      (play "success")
      (play "fail"))
    (System/exit (:exit prc))))
