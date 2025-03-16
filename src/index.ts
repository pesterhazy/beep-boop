import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type SoundType = "start" | "failure" | "success";

function playSound(type: SoundType): void {
  const soundFiles: Record<SoundType, string> = {
    start: path.resolve(__dirname, "../sounds/start.wav"),
    failure: path.resolve(__dirname, "../sounds/failure.wav"),
    success: path.resolve(__dirname, "../sounds/success.wav"),
  };

  const filePath = soundFiles[type];

  const result = spawnSync("afplay", [filePath], { stdio: "inherit" });

  if (result.error) {
    throw new Error("Error running command");
  } else if (result.status !== 0) {
    throw new Error("Nonzero exit status");
  }
}

playSound("start");
