# beep-boop 🤖

**Audible and visual feedback for test runs**

![screenshot](screenshot.png)

🎶 plays a pleasant sound if your tests succeed and a melancholy sound if your tests fail

## Installation

1. Install [bbin](https://github.com/babashka/bbin)
2. `bbin install io.github.pesterhazy/beep-boop`

## Usage

Use `beep-boop` as a wrapper command to envelop your test runner:

```
watchexec -- beep-boop npm test
```

or 

```
watchexec -- beep-boop lein test
```

Turn your audio volume up so you can hear the sound!
