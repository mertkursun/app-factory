---
name: google-signin-expo
description: @react-native-google-signin/google-signin requires Expo config plugin and dev-client; does not work in Expo Go
metadata:
  type: reference
---

`@react-native-google-signin/google-signin` requires native code via Expo config plugin. It does NOT work in Expo Go. Development testing requires EAS dev-client build.

**How to apply:** For projects with Google Sign-In, always note the Expo Go limitation in CLAUDE.md. Recommend email OTP as the development-time auth fallback. Configure `webClientId` from Google Cloud Console. [[revenuecat-expo]]
