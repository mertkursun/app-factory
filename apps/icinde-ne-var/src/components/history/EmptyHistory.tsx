import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const HALO_SIZE = 150;
const DASHED_SIZE = 100;

export function EmptyHistory() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Halo + dashed circle with logo */}
      <View style={[styles.halo, { backgroundColor: colors.surfaceTint }]}>
        <View
          style={[
            styles.dashedCircle,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Logo size={40} />
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t("history.empty")}</Text>
      <Text style={[styles.description, { color: colors.muted }]}>{t("history.emptyDesc")}</Text>
      <PrimaryButton
        label={t("history.firstScan")}
        onPress={() => router.push("/(tabs)")}
        height={48}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  halo: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dashedCircle: {
    width: DASHED_SIZE,
    height: DASHED_SIZE,
    borderRadius: DASHED_SIZE / 2,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 20,
    textAlign: "center",
  },
  description: {
    fontFamily: fonts.body400,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
