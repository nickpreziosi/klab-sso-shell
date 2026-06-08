import type { CapacitorConfig } from "@capacitor/cli";

// Set CAPACITOR_SERVER_URL to your deployed Next.js URL before running `npx cap sync`.
// For local live-reload dev, use `npm run mobile:dev:android` instead — no env var needed.
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.klab.shell",
  appName: "K-Lab",
  webDir: "mobile",
  ...(serverUrl && {
    server: {
      url: serverUrl,
      // Only allow cleartext (HTTP) when explicitly opted in (never in production)
      cleartext: process.env.CAPACITOR_ALLOW_CLEARTEXT === "true",
    },
  }),
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: "#0c0e12",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0c0e12",
    },
  },
  ios: {
    // Let the system manage content insets (handles notch / Dynamic Island automatically)
    contentInset: "automatic",
    scrollEnabled: false,
    // Restrict navigation to the app's own domain in production
    limitsNavigationsToAppBoundDomains: !serverUrl,
  },
  android: {
    backgroundColor: "#0c0e12",
    allowMixedContent: false,
    // Enable Chrome DevTools remote debugging — disable before Play Store submission
    webContentsDebuggingEnabled: process.env.CAPACITOR_DEBUG !== "false",
  },
};

export default config;
