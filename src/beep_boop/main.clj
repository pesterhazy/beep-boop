(ns beep-boop.main
  (:require [babashka.process :refer [sh shell process]]
            [babashka.fs :as fs]))

(def root (-> *file* fs/parent fs/parent fs/parent))

(defn play [fname]
  (process (or (fs/which "aplay")
               (fs/which "afplay")
               (fs/which "play"))
           (str root "/sounds/" fname ".wav")))

(defn notify [status]
  (when (fs/which "osascript")
    (if (= "success" status)
      (process "osascript" "-e" "display notification \"\uD83D\uDFE2\" with title \"\u2800\"")
      (process "osascript" "-e" "display notification \"\uD83D\uDD34\" with title \"\u2800\""))))

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
      (do
        (notify "success")
        (play "success"))
      (do
        (notify "fail")
        (play "fail")))
    (System/exit (:exit prc))))
