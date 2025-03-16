#!/usr/bin/env node

import { spawn, spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type SoundType = "start" | "failure" | "success";

function playSound(type: SoundType): void {
  // Try both relative paths (for development) and paths relative to __dirname (for production)
  const soundPaths = [
    // When running from source with ts-node
    path.resolve(process.cwd(), "sounds", `${type}.wav`),
    // When running from compiled dist
    path.resolve(__dirname, "sounds", `${type}.wav`),
    // Another possible location
    path.resolve(__dirname, "../sounds", `${type}.wav`)
  ];
  
  // Find the first path that exists
  const filePath = soundPaths.find(path => fs.existsSync(path));
  
  if (!filePath) {
    throw new Error(`Sound file not found for type: ${type}. Tried paths: ${soundPaths.join(", ")}`);
  }

  spawn("afplay", [filePath], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Please provide a command to run");
    process.exit(1);
  }

  playSound("start");

  // Run the provided command
  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    const result = spawnSync(command, commandArgs, { stdio: "inherit" });

    if (result.error) {
      throw new Error(`Error executing command: ${result.error.message}`);
    } else if (result.status !== 0) {
      throw new Error(`Command exited with code ${result.status}`);
    } else {
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
