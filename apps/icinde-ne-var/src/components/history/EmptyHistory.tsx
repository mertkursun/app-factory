import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Scan } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const HALO_SIZE = 150;
const DASHED_SIZE = 114;

export function EmptyHistory() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Halo + dashed circle with logo */}
      <View style={styles.illustrationWrap}>
        {/* Radial halo */}
        <View style={[styles.halo, { backgroundColor: colors.surfaceTint }]} />
        {/* Dashed border circle */}
        <View style={[styles.dashedCircle, { borderColor: colors.border }]} />
        {/* Logo inside */}
        <Logo size={76} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t("history.empty")}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t("history.emptyDesc")}
      </Text>
      <View style={styles.buttonWrap}>
        <PrimaryButton
          label={t("history.firstScan")}
          onPress={() => router.push("/(tabs)")}
          height={48}
          icon={<Scan size={16} color={colors.primaryFg} strokeWidth={2.4} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 90,
  },
  illustrationWrap: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  halo: {
    position: "absolute",
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    opacity: 0.8,
  },
  dashedCircle: {
    position: "absolute",
    width: DASHED_SIZE,
    height: DASHED_SIZE,
    borderRadius: DASHED_SIZE / 2,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    fontFamily: fonts.body400,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 230,
  },
  buttonWrap: {
    marginTop: 22,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
});
