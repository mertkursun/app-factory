import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithOTP } from "@/lib/auth";
import { Mail, ArrowRight } from "lucide-react-native";
import { LogoMark } from "@/components/auth/LogoMark";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithOTP(data.email);
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email: data.email },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo + Başlık */}
          <View className="items-center mb-8">
            <LogoMark size={80} />
            <Text className="text-3xl font-display text-text mt-4">Hoş Geldiniz</Text>
            <Text className="text-base font-body text-text-secondary mt-2 text-center">
              Hesabınıza giriş yapın veya yeni hesap oluşturun.
            </Text>
          </View>

          {/* E-posta Form */}
          <View className="gap-3">
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center bg-surface border rounded-xl px-4 h-14 ${
                      errors.email ? "border-danger" : "border-border"
                    }`}
                  >
                    <Mail size={20} color="#78716C" />
                    <TextInput
                      className="flex-1 ml-3 text-base font-body text-text"
                      placeholder="E-posta adresiniz"
                      placeholderTextColor="#78716C"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isSubmitting}
                      accessibilityLabel="E-posta adresi"
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text className="text-danger text-sm font-caption mt-1 ml-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={isSubmitting ? "Kod gönderiliyor" : "Kod gönder"}
              className="bg-primary h-14 rounded-xl items-center justify-center flex-row gap-2"
              style={({ pressed }) => ({
                opacity: pressed || isSubmitting ? 0.7 : 1,
              })}
            >
              <Text className="text-white text-base font-label">
                {isSubmitting ? "Gönderiliyor..." : "Kod Gönder"}
              </Text>
              {!isSubmitting && <ArrowRight size={18} color="#FFFFFF" />}
            </Pressable>

            {error && <Text className="text-danger text-sm font-caption text-center">{error}</Text>}
          </View>

          {/* Ayırıcı */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-sm font-caption text-muted">veya</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sosyal Giriş */}
          <View className="gap-3">
            <GoogleSignInButton />
            {Platform.OS === "ios" && <AppleSignInButton />}
          </View>

          {/* KVKK */}
          <Text className="text-xs font-caption text-muted text-center mt-8 px-4 leading-5">
            Devam ederek <Text className="text-primary underline">KVKK Aydınlatma Metni</Text>
            {" ve "}
            <Text className="text-primary underline">Kullanım Şartları</Text>
            {"'nı kabul etmiş olursunuz."}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
