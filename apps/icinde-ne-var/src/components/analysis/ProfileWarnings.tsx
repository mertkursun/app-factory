import { View, Text, Pressable, StyleSheet } from "react-native";
import { AlertTriangle, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { AUDIENCE_LABELS } from "@/lib/constants";

interface Warning {
  kitle: string;
  maddeAd: string;
  riskSeviyesi: string;
  aciklama: string;
}

interface ProfileWarningsProps {
  warnings: Warning[];
  onPress?: () => void;
}

/** Groups warnings by kitle, shows one banner per audience */
export function ProfileWarnings({ warnings, onPress }: ProfileWarningsProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (warnings.length === 0) return null;

  // Group by audience
  const grouped = warnings.reduce<Record<string, Warning[]>>((acc, w) => {
    const key = w.kitle;
    return { ...acc, [key]: [...(acc[key] ?? []), w] };
  }, {});

  return (
    <View style={styles.container}>
      {Object.entries(grouped).map(([kitle, items]) => {
        const dangerCount = items.filter((w) => w.riskSeviyesi === "sakincali").length;
        const audienceLabel = AUDIENCE_LABELS[kitle] ?? kitle;
        const audienceEmoji = kitle === "hamile" ? "🤰" : kitle === "bebek" ? "👶" : "";

        return (
          <Pressable
            key={kitle}
            onPress={onPress}
            accessibilityRole="alert"
            accessibilityLabel={`${audienceLabel}: ${dangerCount} ${t("analysis.dangerCount", { count: dangerCount })}`}
            style={({ pressed }) => [
              styles.banner,
              {
                backgroundColor: colors.dangerBg,
                borderWidth: 1,
                borderColor: "rgba(224,62,62,0.18)",
                borderRadius: radius.md,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {/* Danger icon tile */}
            <View style={[styles.iconTile, { backgroundColor: colors.danger }]}>
              <AlertTriangle size={18} color="#FFFFFF" />
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { color: colors.dangerText }]}>
                {audienceEmoji ? `${audienceEmoji} ` : ""}
                {t("analysis.profileWarningTitle", { audience: audienceLabel })}
              </Text>
              <Text style={[styles.detailText, { color: colors.dangerText }]}>
                {t("analysis.profileWarningDetail", { count: dangerCount })}
              </Text>
            </View>

            {/* Chevron */}
            <ChevronRight size={18} color={colors.dangerText} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 16,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontFamily: fonts.body800,
    fontSize: 13,
    lineHeight: 18,
  },
  detailText: {
    fontFamily: fonts.body500,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.75,
  },
});
