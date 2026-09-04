# Icebox App 🧊

Cross-platform mobile app built with **Expo, React Native, and TypeScript**.

## Stack

* Expo / React Native
* TypeScript
* Expo Router
* NativeWind

## Structure

```text
app/          # Screens and routes
assets/       # Images, fonts, and static files
components/   # Reusable UI components
constants/    # App constants and configuration
hooks/        # Custom hooks
services/     # API and data services
utils/        # Utility functions
```

## Getting Started

### Requirements

* Node.js (LTS recommended)
* npm
* Expo Go, Android emulator, or iOS simulator

### Install

```bash
npm install
npx expo start
```

Then open the app with Expo Go, an emulator, or a development build.

## Commands

```bash
npx expo start              # Start development server
npx expo start b            # Generate QR code for Expo Go on Android
npx expo start --android    # Run on Android
npx expo start --ios        # Run on iOS
npx expo start -c           # Clear Metro cache
```
