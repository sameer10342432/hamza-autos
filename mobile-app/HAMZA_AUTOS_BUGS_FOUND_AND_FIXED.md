# Hamza Autos - Bugs Discovered and Remediated

**Date**: November 24, 2026  
**Auditor**: Senior QA Automation Engineer & React Native Developer  
**Workspace**: `mobile-app`  

---

## Bug Ledger & Resolution Log

### Bug 1: Expo Go SDK 58 Version Incompatibility
- **Severity**: Critical (Blocked app startup on physical phone)
- **Symptom**: Expo Go displayed blue screen: *"Project is incompatible with this version of Expo Go. The installed version of Expo Go is for SDK 58. The project you opened uses SDK 52."*
- **Root Cause**: The mobile app was initialized with Expo SDK 52, but the user's mobile device had installed the latest Expo Go client from the App Store which runs SDK 58.
- **Fix**: Upgraded project to Expo SDK 58 (`expo@58.0.26`, `react-native@0.88.1`, `react@19.3.0`, `typescript@~6.0.3`, `expo-router@58.0.32`).
- **Retest**: Metro bundler launched on SDK 58; production export succeeded with code 0.

### Bug 2: Missing `expo-asset` Dependency in Metro Config
- **Severity**: High (Metro Bundler crashed on startup)
- **Symptom**: `Error: The required package 'expo-asset' cannot be found`.
- **Root Cause**: Expo SDK 58's Metro bundler requires `expo-asset` to bundle static assets.
- **Fix**: Installed `expo-asset@~58.0.21` in `mobile-app`.
- **Retest**: Metro bundler started cleanly without missing package warnings.

### Bug 3: Deprecated `StyleSheet.absoluteFillObject` in React Native 0.88
- **Severity**: Medium (TypeScript compilation failure)
- **Symptom**: `Property 'absoluteFillObject' does not exist on type 'StyleSheetExports'. Did you mean 'absoluteFill'?` in `app/(tabs)/index.tsx`.
- **Root Cause**: React Native 0.88 TypeScript definitions refined StyleSheet properties.
- **Fix**: Replaced with standard explicit positioning `{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }`.
- **Retest**: `npx tsc --noEmit` passed with code 0.

### Bug 4: TabBar Icon Color Type Incompatibility
- **Severity**: Medium (TypeScript compilation failure)
- **Symptom**: `Type '____ColorValue_Internal' is not assignable to type 'string | undefined'` in `app/(tabs)/_layout.tsx`.
- **Root Cause**: Expo Router navigation header options passed internal opaque colors to tab icon render functions.
- **Fix**: Explicitly cast `color as string` in all tab screen definitions.
- **Retest**: `npx tsc --noEmit` passed with code 0.

### Bug 5: Deprecated StatusBar Background Color Prop
- **Severity**: Low (TypeScript compilation warning/error)
- **Symptom**: `Property 'backgroundColor' does not exist on type 'StatusBarProps'` in `app/_layout.tsx`.
- **Root Cause**: `expo-status-bar` in SDK 58 dropped direct `backgroundColor` prop on the component.
- **Fix**: Updated to `<StatusBar style="light" />`.
- **Retest**: `npx tsc --noEmit` passed with code 0.

### Bug 6: Keyboard Dismissal Trapping on Form ScrollViews
- **Severity**: Medium (UX defect on real devices)
- **Symptom**: When typing in input fields, tapping a payment method or submit button dismissed the keyboard first, requiring a second tap.
- **Root Cause**: Missing `keyboardShouldPersistTaps="handled"` on scroll views.
- **Fix**: Added `keyboardShouldPersistTaps="handled"` across `checkout.tsx`, `repair-booking.tsx`, `repair-tracking.tsx`, `order-tracking.tsx`, `saved-addresses.tsx`, and `profile.tsx`.
- **Retest**: Form inputs and buttons handle taps immediately while keyboard is open.

### Bug 7: Dynamic Physical Mobile Device IP Resolution
- **Severity**: High (Physical phone could not reach backend API)
- **Symptom**: Mobile phone running on Wi-Fi attempted to connect to `10.0.2.2:3000` (which only works inside the Android emulator).
- **Root Cause**: Hardcoded emulator IP check without inspecting the host connection.
- **Fix**: Added auto-detection in `config/api.ts` using `Constants.expoConfig?.hostUri` with fallback to `192.168.1.90:3000`.
- **Retest**: App on physical phone correctly routes API calls to developer PC's Wi-Fi IP address.
