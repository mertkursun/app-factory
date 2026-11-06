import { useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { StatusDot } from "@/components/ui/StatusDot";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type StatusKey = "success" | "warning" | "danger";

interface Madde {
  maddeId: string | null;
  ad: string;
  riskSeviyesi: string;
  islev: string | null;
  kaynak: string | null;
  aiTahmini: boolean;
}

interface IngredientDetailsProps {
  maddeler: Madde[];
}

const RISK_STATUS_MAP: Record<string, StatusKey> = {
  guvenli: "success",
  dikkat: "warning",
  sakincali: "danger",
};

const STATUS_I18N_KEY: Record<StatusKey, string> = {
  success: "analysis.safe",
  warning: "analysis.caution",
  danger: "analysis.danger",
};

export function IngredientDetails({ maddeler }: IngredientDetailsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getStatusLabel = (key: StatusKey): string => t(STATUS_I18N_KEY[key]);

  const toggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  if (maddeler.length === 0) return null;

  // Count by status
  const counts = maddeler.reduce<Record<StatusKey, number>>(
    (acc, m) => {
      const key = RISK_STATUS_MAP[m.riskSeviyesi] ?? "warning";
      return { ...acc, [key]: acc[key] + 1 };
    },
    { success: 0, warning: 0, danger: 0 },
  );

  return (
    <View style={styles.container}>
      {/* Section header: title left, badges right */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("analysis.ingredients")}
        </Text>
        <View style={styles.badgeRow}>
          {counts.success > 0 && (
            <Badge label={t("analysis.safeCount", { count: counts.success })} status="success" />
          )}
          {counts.warning > 0 && (
            <Badge label={t("analysis.cautionCount", { count: counts.warning })} status="warning" />
          )}
          {counts.danger > 0 && (
            <Badge label={t("analysis.dangerCount", { count: counts.danger })} status="danger" />
          )}
        </View>
      </View>

      {/* Ingredient list */}
      <Card style={styles.listCard} borderRadius={radius.lg}>
        <FlatList
          data={maddeler}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.ad}-${index}`}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
          renderItem={({ item: madde, index }) => {
            const isExpanded = expandedIndex === index;
            const statusKey = RISK_STATUS_MAP[madde.riskSeviyesi] ?? "warning";
            const hasDetail = true;

            return (
              <View>
                <Pressable
                  onPress={() => hasDetail && toggle(index)}
                  disabled={!hasDetail}
                  accessibilityRole="button"
                  accessibilityLabel={`${madde.ad}, ${getStatusLabel(statusKey)}`}
                  accessibilityState={{ expanded: isExpanded }}
                  style={styles.row}
                >
                  <StatusDot status={statusKey} size={30} />
                  <View style={styles.textBlock}>
                    <Text style={[styles.ingredientName, { color: colors.text }]} numberOfLines={1}>
                      {madde.ad}
                    </Text>
                    {madde.islev ? (
                      <Text
                        style={[styles.ingredientDesc, { color: colors.muted }]}
                        numberOfLines={1}
                      >
                        {madde.islev}
                      </Text>
                    ) : null}
                  </View>
                  <Badge label={getStatusLabel(statusKey)} status={statusKey} />
                </Pressable>

                {/* Expanded detail */}
                {isExpanded ? (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={[styles.detailBox, { backgroundColor: colors.background }]}
                  >
                    {madde.islev ? (
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        <Text style={{ color: colors.text, fontFamily: fonts.body700 }}>
                          {t("analysis.function")}:{" "}
                        </Text>
                        {madde.islev}
                      </Text>
                    ) : null}
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      <Text style={{ color: colors.text, fontFamily: fonts.body700 }}>
                        {t("analysis.riskLevel")}:{" "}
                      </Text>
                      {t(`analysis.riskDescription.${madde.riskSeviyesi}`)}
                    </Text>
                    {madde.kaynak ? (
                      <Text style={[styles.detailText, { color: colors.muted }]}>
                        {t("analysis.source", { source: madde.kaynak })}
                      </Text>
                    ) : null}
                    {madde.aiTahmini ? (
                      <Text
                        style={[styles.detailText, { color: colors.muted, fontStyle: "italic" }]}
                      >
                        {t("analysis.aiEstimateNote")}
                      </Text>
                    ) : null}
                  </Animated.View>
                ) : null}
              </View>
            );
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.display700,
    fontSize: 15,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  listCard: {
    overflow: "hidden",
  },
  separator: {
    height: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    minHeight: 44,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  ingredientName: {
    fontFamily: fonts.body700,
    fontSize: 13,
    lineHeight: 18,
  },
  ingredientDesc: {
    fontFamily: fonts.body400,
    fontSize: 11,
    lineHeight: 15,
  },
  detailBox: {
    marginHorizontal: 14,
    marginLeft: 54,
    marginBottom: 12,
    padding: 12,
    paddingHorizontal: 12,
    borderRadius: radius.lg - 8,
    gap: 4,
  },
  detailText: {
    fontFamily: fonts.body400,
    fontSize: 11,
    lineHeight: 16.5,
  },
});
