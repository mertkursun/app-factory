---
name: expo-camera-barcode
description: expo-barcode-scanner is deprecated since SDK 51; use expo-camera CameraView with onBarcodeScanned prop instead
metadata:
  type: reference
---

`expo-barcode-scanner` was removed in Expo SDK 51. The replacement is `expo-camera`'s `CameraView` component which has a built-in `onBarcodeScanned` callback and `barcodeScannerSettings` prop.

**How to apply:** Never recommend expo-barcode-scanner in new projects. Always use `import { CameraView } from 'expo-camera'` with `onBarcodeScanned`. The `barcodeScannerEnabled` config plugin flag can shrink app size when scanning is not needed.
