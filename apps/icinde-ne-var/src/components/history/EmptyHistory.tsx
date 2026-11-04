import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, spacing } from "@/theme/tokens";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const HALO_SIZE = 120;
const ICON_CIRCLE_SIZE = 64;

export function EmptyHistory() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Halo + icon circle */}
      <View style={styles.illustrationWrap}>
        {/* Radial halo */}
        <View style={[styles.halo, { backgroundColor: colors.surfaceTint }]} />
        {/* Icon circle */}
        <View style={[styles.iconCircle, { borderColor: colors.border }]}>
          <ScanLine size={28} color={colors.primary} strokeWidth={2} />
        </View>
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
          icon={<ScanLine size={16} color={colors.primaryFg} strokeWidth={2.4} />}
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
    paddingHorizontal: spacing.screenX + 12,
    paddingBottom: 100,
  },
  illustrationWrap: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  halo: {
    position: "absolute",
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    opacity: 0.7,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  description: {
    fontFamily: fonts.body400,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 240,
  },
  buttonWrap: {
    marginTop: 24,
    alignSelf: "center",
    minWidth: 200,
  },
});
