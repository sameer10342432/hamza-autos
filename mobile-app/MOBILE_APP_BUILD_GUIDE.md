# Hamza Autos - Mobile Application Build & Deployment Guide

This guide provides instructions to run, develop, and build the **Hamza Autos Mobile Application** (`mobile-app`).

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.0.0` or higher (tested on Node `v24.14.0`).
* **npm**: `v9.0.0` or higher.
* **Expo Go** app installed on your physical Android or iPhone device (available on Google Play Store and Apple App Store).
* Or **Android Studio** (for Android Emulator) / **Xcode** (for macOS iOS Simulator).

---

## 2. Running the Development Server

### Step 1: Start the Backend Server
In the root directory (`Hamza Autos App`), start the existing Express backend:
```bash
npm run start
```
The server will start on port `3000` (e.g. `http://localhost:3000`).

### Step 2: Start the Mobile Application
In a separate terminal, navigate to the `mobile-app` directory:
```bash
cd mobile-app
npx expo start
```

### Step 3: Launching on Devices
* **Physical Android / iPhone**:
  1. Make sure your phone is connected to the same Wi-Fi network as your computer.
  2. In `mobile-app/config/api.ts`, set `DEV_LAN_HOST` to your computer's local Wi-Fi IP address (e.g. `192.168.100.15`).
  3. Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.
* **Android Emulator**:
  Press `a` in the terminal to launch on the running Android emulator (automatically maps to `http://10.0.2.2:3000`).
* **iOS Simulator** (macOS only):
  Press `i` in the terminal to launch on iOS Simulator.
* **Web Preview**:
  Press `w` in the terminal to view in a desktop browser.

---

## 3. Running Automated Tests & Validation

### Type Checking:
```bash
cd mobile-app
npx tsc --noEmit
```
Expected output: Exits cleanly with zero errors.

### Backend Integration Tests:
```bash
npx tsx mobile-app/scripts/test-api-integration.mjs
```
Expected output: `TEST SUMMARY: 23 PASSED, 0 FAILED`.

---

## 4. Production Build Instructions (EAS Build)

To generate release APK / AAB for Android and IPA for iOS:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Log into Expo Account**:
   ```bash
   eas login
   ```

3. **Configure EAS Project**:
   ```bash
   cd mobile-app
   eas build:configure
   ```

4. **Build Android APK (for Direct Testing / Sideloading)**:
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build Android AAB (for Google Play Store Release)**:
   ```bash
   eas build --platform android --profile production
   ```

6. **Build iOS IPA (for Apple TestFlight / App Store Release)**:
   ```bash
   eas build --platform ios --profile production
   ```

---

## 5. Production API Deployment Configuration

When deploying the Express backend to a production server (VPS, Cloud Run, AWS, DigitalOcean):
1. In `mobile-app/config/api.ts`, update `PRODUCTION_API_URL`:
   ```typescript
   export const PRODUCTION_API_URL = 'https://api.hamzaautos.com'; // Replace with live URL
   ```
2. In production builds (`__DEV__ === false`), the app automatically routes all requests to `PRODUCTION_API_URL`.
