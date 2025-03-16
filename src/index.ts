#!/usr/bin/env node

import { spawn, spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const GREEN = "\u001B[32m";
const RED = "\u001B[31m";
const RESET = "\u001B[0m";

type SoundType = "start" | "failure" | "success";

function printBar(
  color: typeof GREEN | typeof RED,
  width: number = 80,
  fillChar: string = "█",
): void {
  const bar = fillChar.repeat(width);
  console.log(`${color}${bar}${RESET}`);
}

function notify(status: "success" | "failure"): void {
  // Print colored bar
  if (status === "success") {
    printBar(GREEN);
  } else {
    printBar(RED);
  }

  // Use osascript for notifications on macOS
  if (process.platform === "darwin") {
    const notification =
      status === "success"
        ? 'display notification "🟢" with title "⠀"'
        : 'display notification "🔴" with title "⠀"';

    spawn("osascript", ["-e", notification], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
}

function playSound(type: SoundType): void {
  // Try both relative paths (for development) and paths relative to __dirname (for production)
  const soundPaths = [
    // When running from source with ts-node
    path.resolve(process.cwd(), "sounds", `${type}.wav`),
    // When running from compiled dist
    path.resolve(__dirname, "sounds", `${type}.wav`),
    // Another possible location
    path.resolve(__dirname, "../sounds", `${type}.wav`),
  ];

  // Find the first path that exists
  const filePath = soundPaths.find((path) => fs.existsSync(path));

  if (!filePath) {
    throw new Error(
      `Sound file not found for type: ${type}. Tried paths: ${soundPaths.join(", ")}`,
    );
  }

  spawn("afplay", [filePath], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

function main(): void {
  const args = process.argv.slice(2);

  // Check for --version flag as first argument
  if (args.length > 0 && args[0] === "--version") {
    // Read version from package.json
    const packageJsonPath = path.resolve(__dirname, "../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    console.log(packageJson.version);
    process.exit(0);
  }

  if (args.length === 0) {
    console.error("Please provide a command to run");
    process.exit(1);
  }

  playSound("start");

  // Run the provided command
  const command = args[0];
  const commandArgs = args.slice(1);

  // Start timing
  const startTime = process.hrtime.bigint();

  try {
    const result = spawnSync(command, commandArgs, { stdio: "inherit" });

    // Calculate elapsed time in milliseconds
    const endTime = process.hrtime.bigint();
    const elapsedMs = Number(endTime - startTime) / 1_000_000;
    console.log(`... ${elapsedMs.toFixed(0)}ms`);

    if (result.error) {
      throw new Error(`Error executing command: ${result.error.message}`);
    } else if (result.status !== 0) {
      throw new Error(`Command exited with code ${result.status}`);
    }
    playSound("success");
    notify("success");
    process.exit(0);
  } catch (error) {
    console.error(`Exception executing command: ${error}`);
    playSound("failure");
    notify("failure");
    process.exit(1);
  }
}

main();
