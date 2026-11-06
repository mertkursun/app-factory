import { useRef, useState, useCallback } from "react";
import { View, TextInput, StyleSheet, type TextInputKeyPressEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";

const INPUT_HEIGHT = 60;
const INPUT_GAP = 8;

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OTPInput({
  length = 6,
  onComplete,
  disabled = false,
  hasError = false,
}: OTPInputProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputRefs = useRef<({ focus: () => void } | null)[]>([]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Paste handling
      if (text.length > 1) {
        const chars = text.replace(/\D/g, "").slice(0, length).split("");
        const newCode = [...code];
        chars.forEach((char, i) => {
          if (index + i < length) {
            newCode[index + i] = char;
          }
        });
        setCode(newCode);
        const nextIndex = Math.min(index + chars.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        if (newCode.every((c) => c !== "")) {
          onComplete(newCode.join(""));
        }
        return;
      }

      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newCode.every((c) => c !== "")) {
        onComplete(newCode.join(""));
      }
    },
    [code, length, onComplete],
  );

  const handleKeyPress = useCallback(
    (e: TextInputKeyPressEvent, index: number) => {
      if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const getBoxStyle = (index: number) => {
    const isFilled = code[index] !== "";
    const isFocused = focusedIndex === index;

    if (hasError) {
      return {
        backgroundColor: colors.surface,
        borderColor: colors.danger,
        borderWidth: 2,
      };
    }

    if (isFilled) {
      return {
        backgroundColor: colors.surfaceTint,
        borderColor: colors.primary,
        borderWidth: 2,
      };
    }

    if (isFocused) {
      return {
        backgroundColor: colors.surface,
        borderColor: colors.primary,
        borderWidth: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
      };
    }

    return {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
    };
  };

  return (
    <View
      style={styles.container}
      accessibilityLabel={t("auth.otpInputLabel")}
      accessibilityRole="none"
    >
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={[styles.inputBox, getBoxStyle(index)]}>
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[styles.textInput, { color: colors.text }]}
            maxLength={index === 0 ? length : 1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            editable={!disabled}
            autoFocus={index === 0}
            selectTextOnFocus
            accessibilityLabel={t("auth.otpDigitLabel", { digit: index + 1 })}
            caretHidden={code[index] !== ""}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: INPUT_GAP,
  },
  inputBox: {
    flex: 1,
    height: INPUT_HEIGHT,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontFamily: fonts.display800,
    fontSize: 24,
    lineHeight: 30,
  },
});
