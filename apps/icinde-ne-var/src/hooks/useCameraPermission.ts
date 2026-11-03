import { useCameraPermissions } from "expo-camera";

export function useCameraPermission() {
  const [permission, requestPermission] = useCameraPermissions();

  return {
    isGranted: permission?.granted ?? false,
    canAskAgain: permission?.canAskAgain ?? true,
    isLoading: !permission,
    requestPermission,
  };
}
