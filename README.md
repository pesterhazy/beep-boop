# beep-boop 🤖

**Audible and visual feedback for test runs**

![screenshot](screenshot.png)

🎶 plays a pleasant sound if your tests succeed and a melancholy sound if your tests fail

## Installation

1. Install [bbin](https://github.com/babashka/bbin)
2. `bbin install io.github.pesterhazy/beep-boop`

## Usage

Typically `beep-boop` is used as a prefix command wrapping your test runner:

```
watchexec -- beep-boop npm test
```

or 

```
watchexec -- beep-boop lein test
```

Turn your audio volume up so you can hear the sound effect! On macOS you'll also see a temporary display notification with a red or green icon.

`beep-boop` works by inspecting the exit status of the command it wraps, so you can easily try it like this:

```
beep-boop true
beep-boop false
```
