import { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";

export function useMediaLibraryPermission() {
  const [status, setStatus] = useState<ImagePicker.PermissionStatus | null>(null);

  useEffect(() => {
    ImagePicker.getMediaLibraryPermissionsAsync()
      .then((res) => {
        setStatus(res.status);
      })
      .catch(() => {
        setStatus(ImagePicker.PermissionStatus.DENIED);
      });
  }, []);

  const requestPermission = useCallback(async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setStatus(res.status);
    return res.status === ImagePicker.PermissionStatus.GRANTED;
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const refreshStatus = useCallback(async () => {
    const res = await ImagePicker.getMediaLibraryPermissionsAsync();
    setStatus(res.status);
  }, []);

  return {
    isGranted: status === ImagePicker.PermissionStatus.GRANTED,
    isDenied: status === ImagePicker.PermissionStatus.DENIED,
    isLoading: status === null,
    canAskAgain: status !== ImagePicker.PermissionStatus.DENIED,
    requestPermission,
    openSettings,
    refreshStatus,
  };
}
