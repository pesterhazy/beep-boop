import { spawn, spawnSync } from "child_process";
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

  // Use spawn (not spawnSync) to run in background without waiting
  spawn("afplay", [filePath], {
    detached: true,
    stdio: 'ignore'
  }).unref(); // Unreference the child process so parent can exit
}

function main(): void {
  // Get command arguments (skip node and script path)
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Please provide a command to run");
    process.exit(1);
  }

  // Play start sound
  playSound("start");

  // Run the provided command
  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    console.log(`Running command: ${command} ${commandArgs.join(" ")}`);
    const result = spawnSync(command, commandArgs, { stdio: "inherit" });
    
    if (result.error) {
      console.error(`Error executing command: ${result.error.message}`);
      playSound("failure");
      process.exit(1);
    } else if (result.status !== 0) {
      console.log(`Command exited with code ${result.status}`);
      playSound("failure");
      process.exit(result.status);
    } else {
      console.log("Command executed successfully");
      playSound("success");
      process.exit(0);
    }
  } catch (error) {
    console.error(`Exception executing command: ${error}`);
    playSound("failure");
    process.exit(1);
  }
}

main();
