# Beep boop

A command runner that plays sounds when commands start, succeed, or fail.

## Installation

```bash
npm install -g beep-boop
```

## Usage

```bash
beep-boop <command> [arguments]
```

Examples:

```bash
beep-boop ls -la
beep-boop npm test
beep-boop curl https://example.com
```

The tool will:
- Play a startup sound when the command begins
- Play a success sound when the command succeeds (exit code 0)
- Play a failure sound when the command fails (non-zero exit code)
