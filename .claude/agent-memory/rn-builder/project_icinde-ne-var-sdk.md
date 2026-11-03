---
name: project-icinde-ne-var-sdk
description: Expo SDK 52 project setup details for icinde-ne-var app including version constraints
metadata:
  type: project
---

icinde-ne-var uses Expo SDK 52, NativeWind 4.2.7, Tailwind CSS 3.4.19.

**Why:** eslint-config-expo v8 requires ESLint <=8 (not v9/v10 flat config). `@testing-library/react-native` v14 has peer dep conflicts with React 18.3.1 — installed with `--legacy-peer-deps`.

**How to apply:** Always use `--legacy-peer-deps` when installing test packages. Keep ESLint at v8 for .eslintrc.js compatibility. Use `npx expo install` for SDK-compat packages.
