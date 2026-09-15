# NextHire AI - Android Mobile App & APK Guide

This guide provides instructions for running NextHire AI on Android devices via **PWA** (Recommended) or generating a native **Android APK** using Capacitor / Bubblewrap TWA.

---

## Option 1: PWA (Progressive Web App) — Recommended & Instant

1. Deploy the NextHire AI web app to Vercel (or your domain).
2. Open **Google Chrome** on your Android phone.
3. Navigate to your deployed application URL: `https://your-nexthire-domain.vercel.app`
4. Tap the **Install** banner at the bottom of the screen, OR tap the **Chrome Menu (3 vertical dots)** > tap **"Add to Home Screen"** / **"Install App"**.
5. **NextHire AI** will be installed directly on your Android phone home screen as a standalone full-screen app with offline support!

---

## Option 2: Standalone Android APK (via Capacitor)

To package NextHire AI as a standalone `.apk` file for Android:

### Prerequisites:

- Node.js 18+ installed
- Android Studio with Android SDK installed
- Java Development Kit (JDK 17+)

### Steps to Build APK:

1. **Install Capacitor Dependencies**:

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialize & Sync Android Project**:

   ```bash
   npx cap add android
   npx cap sync
   ```

3. **Update `capacitor.config.ts`**:
   Set `server.url` in `capacitor.config.ts` to your production domain:

   ```ts
   server: {
     url: "https://your-nexthire-domain.vercel.app";
   }
   ```

4. **Open in Android Studio & Generate APK**:

   ```bash
   npx cap open android
   ```

   In Android Studio:
   - Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - The generated `.apk` file will be located at:
     `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Transfer `.apk` to Android Phone**:
   - Send `app-debug.apk` to your Android phone via USB, Google Drive, or WhatsApp.
   - Open the file on your Android phone and tap **Install** (Allow installation from unknown sources if prompted).

---

## Option 3: Android TWA APK (via Bubblewrap)

1. **Install Bubblewrap CLI**:

   ```bash
   npm install -g @bubblewrap/cli
   ```

2. **Initialize TWA Project**:

   ```bash
   bubblewrap init --manifest=https://your-nexthire-domain.vercel.app/manifest.webmanifest
   ```

3. **Build Signed APK**:
   ```bash
   bubblewrap build
   ```
   This outputs `app-release-signed.apk` ready for direct installation on Android devices or Google Play Store distribution!
