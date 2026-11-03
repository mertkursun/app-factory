import { useRef, useState, useCallback } from "react";
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

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
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Paste handling: if multiple chars arrived, distribute them
      if (text.length > 1) {
        const chars = text.slice(0, length).split("");
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
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const borderClass = hasError ? "border-danger" : "border-border";

  return (
    <View
      className="flex-row justify-center gap-3"
      accessibilityLabel="OTP doğrulama kodu girişi"
      accessibilityRole="none"
    >
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          className={`w-12 h-14 rounded-sm border-2 ${
            code[index] ? "border-primary" : borderClass
          } bg-surface text-center text-xl font-title text-text`}
          maxLength={index === 0 ? length : 1}
          keyboardType="number-pad"
          value={code[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          editable={!disabled}
          autoFocus={index === 0}
          selectTextOnFocus
          accessibilityLabel={`Doğrulama kodu ${index + 1}. hane`}
        />
      ))}
    </View>
  );
}
