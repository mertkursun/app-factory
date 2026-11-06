import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, Mail, ShieldCheck } from "lucide-react-native";
import { signInWithOTP } from "@/lib/auth";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { useAppStore } from "@/stores/appStore";
import { isExpoGo } from "@/lib/runtime";

const LOGIN_PADDING_TOP = 70;
const LOGIN_PADDING_X = 22;
const LOGIN_PADDING_BOTTOM = 24;
const INPUT_HEIGHT = 54;
const BUTTON_HEIGHT = 54;

const loginSchema = z.object({
  displayName: z.string().min(2, "nameValidation"),
  email: z.string().email("emailValidation"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const setPendingDisplayName = useAppStore((s) => s.setPendingDisplayName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { displayName: "", email: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      setPendingDisplayName(data.displayName);
      await signInWithOTP(data.email);
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email: data.email, displayName: data.displayName },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameBorderColor = errors.displayName
    ? colors.danger
    : isNameFocused
      ? colors.primary
      : colors.border;
  const nameBorderWidth = isNameFocused && !errors.displayName ? 1.5 : 1;

  const inputBorderColor = errors.email
    ? colors.danger
    : isEmailFocused
      ? colors.primary
      : colors.border;
  const inputBorderWidth = isEmailFocused && !errors.email ? 1.5 : 1;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { paddingTop: insets.top + LOGIN_PADDING_TOP }]}>
          {/* Decorative radial blob */}
          <View style={[styles.decorativeBlob, { backgroundColor: colors.surfaceTint }]} />

          {/* Logo */}
          <Logo size={52} />

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{t("auth.welcome")}</Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t("auth.welcomeSubtitle")}
          </Text>

          {/* Name input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {t("auth.nameLabel")}
            </Text>

            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surface,
                      borderColor: nameBorderColor,
                      borderWidth: nameBorderWidth,
                    },
                    shadow.low,
                    isNameFocused &&
                      !errors.displayName && {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.14,
                        shadowRadius: 4,
                        elevation: 4,
                      },
                  ]}
                >
                  <User size={18} color={colors.primary} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder={t("auth.namePlaceholder")}
                    placeholderTextColor={colors.muted}
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setIsNameFocused(false);
                    }}
                    onFocus={() => setIsNameFocused(true)}
                    editable={!isSubmitting}
                    accessibilityLabel={t("auth.nameLabel")}
                    selectionColor={colors.primary}
                  />
                </View>
              )}
            />
            {errors.displayName && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {t("auth.nameValidation")}
              </Text>
            )}
          </View>

          {/* Email input */}
          <View style={styles.inputSectionSmall}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {t("auth.emailLabel")}
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surface,
                      borderColor: inputBorderColor,
                      borderWidth: inputBorderWidth,
                    },
                    shadow.low,
                    isEmailFocused &&
                      !errors.email && {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.14,
                        shadowRadius: 4,
                        elevation: 4,
                      },
                  ]}
                >
                  <Mail size={18} color={colors.primary} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setIsEmailFocused(false);
                    }}
                    onFocus={() => setIsEmailFocused(true)}
                    editable={!isSubmitting}
                    accessibilityLabel={t("auth.emailLabel")}
                    selectionColor={colors.primary}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {t("auth.emailValidation")}
              </Text>
            )}
          </View>

          {/* CTA button */}
          <View style={styles.ctaSection}>
            <PrimaryButton
              label={isSubmitting ? t("auth.sendingCode") : t("auth.sendCode")}
              onPress={() => handleSubmit(onSubmit)()}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              height={BUTTON_HEIGHT}
            />
          </View>

          {error && <Text style={[styles.errorMessage, { color: colors.danger }]}>{error}</Text>}

          {!isExpoGo && (
            <>
              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.muted }]}>{t("common.or")}</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social buttons */}
              <View style={styles.socialSection}>
                <GoogleSignInButton />
                {Platform.OS === "ios" && <AppleSignInButton />}
              </View>
            </>
          )}

          {/* Spacer to push legal to bottom */}
          <View style={styles.spacer} />

          {/* Legal footer */}
          <View style={styles.legalSection}>
            <ShieldCheck size={14} color={colors.primary} />
            <Text style={[styles.legalText, { color: colors.muted }]}>
              {t("auth.legalPrefix")}
              <Text
                style={{ color: colors.primary, fontFamily: fonts.body600 }}
                onPress={() => router.push("/legal/privacy")}
                accessibilityRole="link"
              >
                {t("auth.kvkk")}
              </Text>
              {t("auth.legalAnd")}
              <Text
                style={{ color: colors.primary, fontFamily: fonts.body600 }}
                onPress={() => router.push("/legal/terms")}
                accessibilityRole="link"
              >
                {t("auth.terms")}
              </Text>
              {t("auth.legalSuffix")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: LOGIN_PADDING_X,
    paddingBottom: LOGIN_PADDING_BOTTOM,
  },
  decorativeBlob: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 30,
    lineHeight: 32.4,
    letterSpacing: -0.8,
    marginTop: 22,
  },
  description: {
    fontFamily: fonts.body400,
    fontSize: 14,
    lineHeight: 21.7,
    marginTop: 8,
  },
  inputSection: {
    marginTop: 30,
  },
  inputSectionSmall: {
    marginTop: 16,
  },
  inputLabel: {
    fontFamily: fonts.body700,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: INPUT_HEIGHT,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.body500,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontFamily: fonts.body500,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginLeft: 4,
  },
  ctaSection: {
    marginTop: 14,
  },
  errorMessage: {
    fontFamily: fonts.body500,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: fonts.body600,
    fontSize: 12,
    marginHorizontal: 12,
  },
  socialSection: {
    gap: 10,
  },
  spacer: {
    flex: 1,
  },
  legalSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 0,
  },
  legalText: {
    fontFamily: fonts.body400,
    fontSize: 11,
    lineHeight: 16.5,
    flex: 1,
    textAlign: "center",
  },
});
