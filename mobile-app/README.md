# Hamza Autos - Official React Native Mobile Application 🏍️

> **The premier motorcycle repair workshop and spare parts e-commerce mobile application for Hamza Autos, Badami Bagh, Lahore.**

[![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058.0.26-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-E60012.svg)]()
[![License](https://img.shields.io/badge/License-Proprietary-10182B.svg)]()

---

## 📱 Features Overview

- **Spare Parts E-Commerce**: Full catalog covering 16 categories and 7 major Pakistani motorcycle brands (Honda, Yamaha, Suzuki, United, Road Prince, Super Power, Chinese).
- **3-Step Motorcycle Compatibility Finder**: Verified parts lookup matching brand, model, and year.
- **Workshop Service Booking**: Online appointment booking reserved specifically for our physical workshop in **Abu Bakar Road, Badami Bagh, Lahore**.
- **2-Factor Repair Tracking**: Secure status lookup requiring both Job Card Number and Customer Phone Number.
- **Pakistan-Wide Delivery**: Automatic shipping fee calculation across all 7 provinces/territories (Punjab, Sindh, KP, Balochistan, Islamabad, GB, AJK).
- **My Garage & Maintenance Reminders**: Multi-motorcycle garage manager with odometer tracking and service due alerts (Engine Oil, Carburetor Tuning, Chain, Brakes).
- **Customer Account & Security**: Tokenized customer profile via `Expo SecureStore`, saved delivery addresses, order history, and direct WhatsApp / phone hotline support.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- [Expo Go](https://expo.dev/go) installed on your physical Android or iOS device.

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/sameer10342432/hamza-autos-mobile-app.git
cd hamza-autos-mobile-app

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Run the Development Server
```bash
# Start Metro bundler on your local network
npx expo start --lan
```
- Scan the displayed QR code with the **Expo Go** app on your phone.
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.
- Press `w` for Web Preview.

### 3. Verify Static Types & Bundle Export
```bash
# Type check with TypeScript compiler
npm run typecheck

# Test Android production bundle export
npx expo export --platform android
```

---

## 🏗️ Project Architecture

```text
├── app/                  # Expo Router filesystem navigation
│   ├── (tabs)/           # 5-tab bar: Home, Shop, Services, Orders, Profile
│   ├── product/[id].tsx  # Dynamic spare part details & specifications
│   ├── service/[slug].tsx# Workshop repair details
│   ├── cart.tsx          # Persistent shopping cart with province shipping
│   ├── checkout.tsx      # COD & Bank transfer checkout form
│   ├── repair-booking.tsx# Badami Bagh bay reservation
│   ├── repair-tracking.tsx# 2-Factor repair progress timeline
│   ├── order-tracking.tsx# Courier parcel tracking
│   ├── my-garage.tsx     # Motorcycle manager & maintenance reminders
│   ├── bike-health.tsx   # 6-point inspection scorecard
│   ├── saved-addresses.tsx# Multi-address manager
│   ├── search.tsx        # Instant parts search
│   └── support.tsx       # Master Mechanic Hamza hotline & WhatsApp
├── assets/               # Brand logos, high-res photos, and splash assets
├── components/           # Reusable UI components (BrandHeader, Cards, Finder, Inputs)
├── config/               # Smart API URL auto-detection (LAN IP, emulator, production)
├── constants/            # Hamza Autos design tokens (Red #E60012, Navy #10182B)
├── context/              # Persistent global state (CartContext, AuthContext, GarageContext)
├── data/                 # Seed data, motorcycle models, services, shipping rates
├── scripts/              # Automated QA test runners and verification suites
├── services/             # REST API client with offline resilience
├── types/                # TypeScript interfaces & domain models
└── utils/                # Native asset helpers & formatters
```

---

## 📑 Complete Quality Assurance Documentation

The full suite of technical audits, security reports, and regression test logs is included in this repository:

1. [HAMZA_AUTOS_MOBILE_COMPLETE_QA_REPORT.md](./HAMZA_AUTOS_MOBILE_COMPLETE_QA_REPORT.md) — Comprehensive QA audit and verification matrix (126 passed, 0 failed).
2. [HAMZA_AUTOS_TYPESCRIPT_AND_LINT_REPORT.md](./HAMZA_AUTOS_TYPESCRIPT_AND_LINT_REPORT.md) — Strict TypeScript validation report.
3. [HAMZA_AUTOS_EXPO_BUILD_TEST_REPORT.md](./HAMZA_AUTOS_EXPO_BUILD_TEST_REPORT.md) — Metro bundler and Android production JS export logs.
4. [HAMZA_AUTOS_SCREEN_BY_SCREEN_TEST_REPORT.md](./HAMZA_AUTOS_SCREEN_BY_SCREEN_TEST_REPORT.md) — Screen-by-screen audit across all 18 views.
5. [HAMZA_AUTOS_WORKFLOW_TEST_REPORT.md](./HAMZA_AUTOS_WORKFLOW_TEST_REPORT.md) — End-to-end shopping, booking, and Admin sync workflows.
6. [HAMZA_AUTOS_SECURITY_AUDIT.md](./HAMZA_AUTOS_SECURITY_AUDIT.md) — 2FA repair verification and SecureStore token security.
7. [HAMZA_AUTOS_PERFORMANCE_REPORT.md](./HAMZA_AUTOS_PERFORMANCE_REPORT.md) — List virtualization and Hermes optimization.
8. [HAMZA_AUTOS_BUGS_FOUND_AND_FIXED.md](./HAMZA_AUTOS_BUGS_FOUND_AND_FIXED.md) — Log of 7 identified and resolved bugs.
9. [HAMZA_AUTOS_FINAL_REGRESSION_REPORT.md](./HAMZA_AUTOS_FINAL_REGRESSION_REPORT.md) — Final regression test verification and sign-off.

---

## 🏢 Business Identity & Physical Workshop

- **Workshop Name**: Hamza Autos
- **Lead Mechanic**: Muhammad Hamza
- **Physical Address**: Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab, Pakistan
- **Phone / Hotline**: +92 325 1814548
- **WhatsApp Support**: +92 325 1814548
- **Online Spare Parts**: Delivered nationwide across Pakistan via TCS, Leopards, and M&P.
