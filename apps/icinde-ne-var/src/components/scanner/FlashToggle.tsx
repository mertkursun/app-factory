import { Pressable, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Zap } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface FlashToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const ICON_SIZE = 20;
const BUTTON_SIZE = 48;
const FLASH_ON_COLOR = "#FACC15";
const FLASH_OFF_COLOR = "#FFFFFF";

export function FlashToggle({ enabled, onToggle }: FlashToggleProps) {
  const { t } = useTranslation();

  const content = <Zap size={ICON_SIZE} color={enabled ? FLASH_ON_COLOR : FLASH_OFF_COLOR} />;

  if (Platform.OS === "ios") {
    return (
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={enabled ? t("scanner.flashOff") : t("scanner.flashOn")}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
      >
        <BlurView intensity={16} tint="dark" style={styles.blur}>
          {content}
        </BlurView>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={enabled ? t("scanner.flashOff") : t("scanner.flashOn")}
      style={({ pressed }) => [styles.button, styles.androidBg, { opacity: pressed ? 0.7 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: "hidden",
  },
  blur: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  androidBg: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
});
