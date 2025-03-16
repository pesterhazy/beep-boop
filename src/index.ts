import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const soundFilePath = path.resolve(__dirname, "../sounds/sounds_start.wav");

// Function to play sound on macOS using spawnSync
function playSound(filePath: string): void {
  try {
    const result = spawnSync("afplay", [filePath], { stdio: "inherit" });

    if (result.error) {
      console.error(`Error playing sound: ${result.error.message}`);
    } else if (result.status !== 0) {
      console.log(`Sound process exited with code ${result.status}`);
    } else {
      console.log("Sound played successfully");
    }
  } catch (error) {
    console.error(`Exception playing sound: ${error}`);
  }
}

playSound(soundFilePath);
