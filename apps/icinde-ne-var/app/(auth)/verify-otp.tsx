import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import { verifyOTP, signInWithOTP } from "@/lib/auth";
import { createProfile, getProfile, updateProfile } from "@/services/profile";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { IconButton } from "@/components/ui/IconButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { OTPInput } from "@/components/auth/OTPInput";

const RESEND_COOLDOWN = 180;
const OTP_PADDING_TOP = 62;
const OTP_PADDING_X = 22;
const OTP_PADDING_BOTTOM = 24;
const BUTTON_HEIGHT = 54;
const COUNTDOWN_RING_SIZE = 14;
const COUNTDOWN_RING_STROKE = 2;
const COUNTDOWN_RING_RADIUS = (COUNTDOWN_RING_SIZE - COUNTDOWN_RING_STROKE) / 2;
const COUNTDOWN_CIRCUMFERENCE = 2 * Math.PI * COUNTDOWN_RING_RADIUS;

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const { email, displayName } = useLocalSearchParams<{ email: string; displayName?: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [otpCode, setOtpCode] = useState("");
  const canResend = countdown <= 0;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleComplete = useCallback(
    async (code: string) => {
      if (!email) return;
      setOtpCode(code);
      setIsVerifying(true);
      setError(null);
      try {
        const result = await verifyOTP(email, code);
        const userId = result?.session?.user?.id ?? result?.user?.id;
        if (displayName && userId) {
          try {
            const existing = await getProfile(userId);
            if (existing) {
              if (!existing.display_name) {
                await updateProfile(userId, { display_name: displayName });
              }
            } else {
              await createProfile({
                user_id: userId,
                display_name: displayName,
                audiences: [],
              });
            }
          } catch {
            // profil kaydetme başarısız olursa girişi engelleme
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("auth.verificationFailed"));
        setIsVerifying(false);
      }
    },
    [email, t],
  );

  const handleVerify = useCallback(() => {
    if (otpCode.length === 6) {
      handleComplete(otpCode);
    }
  }, [otpCode, handleComplete]);

  const handleResend = useCallback(async () => {
    if (!email || !canResend) return;
    try {
      await signInWithOTP(email);
      setCountdown(RESEND_COOLDOWN);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.codeSendFailed"));
    }
  }, [email, canResend, t]);

  const countdownProgress = countdown / RESEND_COOLDOWN;
  const dashOffset = COUNTDOWN_CIRCUMFERENCE * (1 - countdownProgress);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top + OTP_PADDING_TOP },
      ]}
    >
      {/* Back button */}
      <IconButton
        icon={<ChevronLeft size={18} color={colors.text} strokeWidth={2.2} />}
        onPress={() => router.back()}
        accessibilityLabel={t("auth.goBack")}
      />

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{t("auth.verificationCode")}</Text>

      {/* Email shown bold + subtitle */}
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        <Text style={[styles.emailBold, { color: colors.text }]}>{email}</Text>{" "}
        {t("auth.verificationSubtitle")}
      </Text>

      {/* OTP Input */}
      <View style={styles.otpSection}>
        <OTPInput onComplete={handleComplete} disabled={isVerifying} hasError={!!error} />
      </View>

      {/* Error */}
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}

      {/* Countdown pill */}
      {!canResend && (
        <View style={styles.countdownSection}>
          <View style={[styles.countdownPill, { backgroundColor: colors.surfaceTint }]}>
            <View style={styles.countdownRing}>
              <Svg width={COUNTDOWN_RING_SIZE} height={COUNTDOWN_RING_SIZE}>
                <SvgCircle
                  cx={COUNTDOWN_RING_SIZE / 2}
                  cy={COUNTDOWN_RING_SIZE / 2}
                  r={COUNTDOWN_RING_RADIUS}
                  stroke={colors.border}
                  strokeWidth={COUNTDOWN_RING_STROKE}
                  fill="none"
                />
                <SvgCircle
                  cx={COUNTDOWN_RING_SIZE / 2}
                  cy={COUNTDOWN_RING_SIZE / 2}
                  r={COUNTDOWN_RING_RADIUS}
                  stroke={colors.primary}
                  strokeWidth={COUNTDOWN_RING_STROKE}
                  fill="none"
                  strokeDasharray={COUNTDOWN_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  rotation={-90}
                  origin={`${COUNTDOWN_RING_SIZE / 2}, ${COUNTDOWN_RING_SIZE / 2}`}
                />
              </Svg>
            </View>
            <Text style={[styles.countdownText, { color: colors.primaryDeep }]}>
              {formatCountdown(countdown)}
            </Text>
          </View>
        </View>
      )}

      {/* Verify button */}
      <View style={styles.verifySection}>
        <PrimaryButton
          label={t("auth.verify")}
          onPress={handleVerify}
          isLoading={isVerifying}
          disabled={isVerifying}
          height={BUTTON_HEIGHT}
        />
      </View>

      {/* Resend link */}
      <View style={styles.resendSection}>
        <Text style={[styles.resendText, { color: colors.textSecondary }]}>
          {t("auth.codeNotReceived")}{" "}
          <Text
            style={[styles.resendLink, { color: colors.muted }]}
            onPress={canResend ? handleResend : undefined}
            accessibilityRole="link"
          >
            {t("auth.resend")}
          </Text>
        </Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Trust card at bottom */}
      <View
        style={[
          styles.trustCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            marginBottom: Math.max(insets.bottom, OTP_PADDING_BOTTOM),
          },
          shadow.low,
        ]}
      >
        <View style={[styles.trustIconTile, { backgroundColor: colors.surfaceTint }]}>
          <ShieldCheck size={16} color={colors.primary} />
        </View>
        <View style={styles.trustTextContainer}>
          <Text style={[styles.trustBody, { color: colors.textSecondary }]}>
            <Text style={[styles.trustTitle, { color: colors.text }]}>{t("auth.trustTitle")}</Text>{" "}
            {t("auth.trustDesc")}
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: OTP_PADDING_X,
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.7,
    marginTop: 26,
  },
  subtitle: {
    fontFamily: fonts.body400,
    fontSize: 14,
    lineHeight: 21.7,
    marginTop: 8,
  },
  emailBold: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  otpSection: {
    marginTop: 30,
  },
  errorText: {
    fontFamily: fonts.body500,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  countdownSection: {
    alignItems: "center",
    marginTop: 20,
  },
  countdownPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 8,
  },
  countdownRing: {
    width: COUNTDOWN_RING_SIZE,
    height: COUNTDOWN_RING_SIZE,
  },
  countdownText: {
    fontFamily: fonts.body700,
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
  verifySection: {
    marginTop: 28,
  },
  resendSection: {
    alignItems: "center",
    marginTop: 22,
  },
  resendText: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 20,
  },
  resendLink: {
    fontFamily: fonts.body600,
    fontSize: 13,
  },
  spacer: {
    flex: 1,
  },
  trustCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 10,
  },
  trustIconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontFamily: fonts.body700,
    fontSize: 12,
  },
  trustBody: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 18,
  },
});
