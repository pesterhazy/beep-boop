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

(defn parse [args]
  (let [args (into [] args)]
    (if (= "--secondary" (first args))
      (let [end (.indexOf args "END_OF_SECONDARY")]
        (when (= -1 end)
          (throw "Expected END_OF_SECONDARY"))
        (concat [(subvec args 1 end)] (parse (subvec args (inc end)))))
      [args])))

(defn -main [& args]
  (let [cmds (parse args)]
    (play "start")
    (let [secondaries (->> (butlast cmds)
                           (mapv (fn [cmd] (apply process {:out :string
                                                           :err :string}
                                                  cmd))))]
      (let [[elapsed-ms prc] (time-ret (apply shell {:continue true} (last cmds)))]
        (let [primary-succeeded? (zero? (:exit prc))
              [secondary-elapsed-ms secondaries-succeeded?]
              (time-ret (->> secondaries
                             (mapv (fn [prc]
                                     (when-not (zero? (:exit @prc))
                                       (println "Secondary command failed:" (:cmd prc))
                                       (println "********************")
                                       (print (:out @prc))
                                       (print (:err @prc))
                                       (println "********************"))
                                     prc))
                             (every? (fn [prc]
                                       (zero? (:exit @prc))))))
              success (and primary-succeeded? secondaries-succeeded?)]
          (bar (if success
                 green
                 red)
               60
               "\u2588")
          (if (> secondary-elapsed-ms 10)
            (println "..." (long elapsed-ms) "ms"
                     (str "(+" (long secondary-elapsed-ms)) "ms for secondary processes)")
            (println "..." (long elapsed-ms) "ms"))
          (if success
            (do
              (notify "success")
              (play "success"))
            (do
              (notify "fail")
              (play "fail"))))
        (System/exit (:exit prc))))))
