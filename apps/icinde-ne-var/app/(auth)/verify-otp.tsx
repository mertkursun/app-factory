import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { verifyOTP, signInWithOTP } from "@/lib/auth";
import { OTPInput } from "@/components/auth/OTPInput";

const RESEND_COOLDOWN = 60;

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleComplete = useCallback(
    async (code: string) => {
      if (!email) return;
      setIsVerifying(true);
      setError(null);
      try {
        await verifyOTP(email, code);
        // Auth state change listener handles navigation automatically (auth guard)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Doğrulama başarısız");
        setIsVerifying(false);
      }
    },
    [email],
  );

  const handleResend = useCallback(async () => {
    if (!email || !canResend) return;
    try {
      await signInWithOTP(email);
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kod gönderilemedi");
    }
  }, [email, canResend]);

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      {/* Geri butonu */}
      <Pressable
        onPress={() => router.back()}
        className="mb-8 h-11 w-11 items-center justify-center rounded-full"
        accessibilityRole="button"
        accessibilityLabel="Geri dön"
      >
        <ArrowLeft size={24} className="text-text" />
      </Pressable>

      {/* Başlık */}
      <Text className="text-2xl font-title text-text mb-2">Doğrulama Kodu</Text>
      <Text className="text-base font-body text-text-secondary mb-8">
        <Text className="font-label">{email}</Text> adresine gönderilen 6 haneli kodu girin.
      </Text>

      {/* OTP Input */}
      <OTPInput onComplete={handleComplete} disabled={isVerifying} hasError={!!error} />

      {/* Hata */}
      {error && <Text className="text-danger text-sm font-caption text-center mt-4">{error}</Text>}

      {/* Loading durumu */}
      {isVerifying && (
        <View className="flex-row items-center justify-center mt-4 gap-2">
          <ActivityIndicator size="small" color="#0F766E" />
          <Text className="text-primary text-sm font-caption">Doğrulanıyor...</Text>
        </View>
      )}

      {/* Geri sayım ve Tekrar Gönder */}
      <View className="items-center mt-8">
        {canResend ? (
          <Pressable
            onPress={handleResend}
            accessibilityRole="button"
            accessibilityLabel="Kodu tekrar gönder"
            className="h-11 items-center justify-center px-4"
          >
            <Text className="text-primary text-base font-label">Tekrar Gönder</Text>
          </Pressable>
        ) : (
          <View className="items-center">
            <Text
              className="text-muted text-sm font-caption"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatCountdown(countdown)} kaldı
            </Text>
            <Text className="text-muted text-xs font-caption mt-2">
              Kod gelmediyse tekrar gönderebilirsiniz.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
