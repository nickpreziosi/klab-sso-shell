# Mobile Testing with Capacitor

How to run and test the K-Lab shell app on Android devices and emulators.

> iOS requires a Mac — the scripts are in place but cannot be run on Windows.

---

## Prerequisites

### Android Studio
Download and install [Android Studio](https://developer.android.com/studio). During setup, make sure to install:
- Android SDK
- Android SDK Platform Tools
- At least one Android Virtual Device (AVD)

### Environment
Make sure `ANDROID_HOME` is set in your environment variables and that `platform-tools` is on your `PATH`. Android Studio's SDK Manager will show you the SDK path.

```
ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\platform-tools
```

### Dependencies
After applying the Capacitor stash, install packages if you haven't already:

```bash
npm install
```

---

## Option A — Live-reload dev (fastest)

Capacitor points the app at your running Next.js dev server. No build step needed — changes hot-reload just like in the browser.

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run mobile:dev:android
```

Capacitor will automatically pick the correct local address. The app opens in the emulator or connected device and reflects code changes in real time.

### On a physical device with live-reload
Your device and machine must be on the **same Wi-Fi network**.

1. Enable **Developer Options** on the device:
   - Go to Settings > About Phone
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect via USB and accept the "Allow USB Debugging" prompt on the device
4. Run `adb devices` to confirm the device is listed
5. Then run `npm run mobile:dev:android` — Capacitor detects connected devices automatically

---

## Option B — Full production-like build

Closer to what gets deployed to the Play Store. Required if you want to test splash screen, status bar, or service worker behaviour.

```bash
# 1. Build Next.js (outputs to the `mobile/` folder)
npm run build

# 2. Sync the build + plugins into the Android project
npm run mobile:sync

# 3. Open Android Studio
npm run mobile:open:android
```

In Android Studio, hit the green **Run** button (or `Shift + F10`) to deploy to the selected emulator or connected device.

---

## Setting up an Android Emulator

If you don't have an AVD yet:

1. In Android Studio, open **Device Manager** (right sidebar or Tools > Device Manager)
2. Click **Create Device**
3. Pick a phone profile — **Pixel 8** is a good baseline
4. Select a system image — use the latest stable API level (API 35 recommended)
5. Click **Finish** and then the play button to start it

The emulator needs to be running before you execute `npm run mobile:dev:android` or the Android Studio run button.

---

## Debugging

Chrome DevTools works against the Capacitor WebView because `CAPACITOR_DEBUG=true` is set by default.

1. Open Chrome on your machine
2. Go to `chrome://inspect/#devices`
3. Your app will appear under **Remote Targets** — click **inspect**

You get full DevTools: console, network, elements, sources.

> Set `CAPACITOR_DEBUG=false` in your `.env.local` before doing any Play Store build.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in as needed:

| Variable | Purpose | Default |
|---|---|---|
| `CAPACITOR_SERVER_URL` | Points the app at a deployed URL instead of local dev | empty (uses local) |
| `CAPACITOR_DEBUG` | Enables Chrome DevTools on the WebView | `true` |
| `CAPACITOR_ALLOW_CLEARTEXT` | Allows HTTP (non-HTTPS) connections | `false` |

Leave `CAPACITOR_SERVER_URL` empty during local development — live-reload handles the URL automatically.

---

## npm scripts reference

| Script | What it does |
|---|---|
| `npm run mobile:dev:android` | Live-reload on Android (emulator or device) |
| `npm run mobile:dev:ios` | Live-reload on iOS (Mac only) |
| `npm run mobile:sync` | Sync built web assets + plugins into native projects |
| `npm run mobile:open:android` | Open the Android project in Android Studio |
| `npm run mobile:open:ios` | Open the iOS project in Xcode (Mac only) |

---

## iOS (Mac only)

The setup is complete — `ios/` scaffold, `capacitor.config.ts`, and scripts are all in place. To use them you need a Mac with Xcode installed. Steps are the same as Android but swap `android` for `ios` in the commands above.
