import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Clock, BookOpen } from "lucide-react-native";
import { useTheme, typography, radius, spacing, fonts } from "@/theme/tokens";
import { IconButton } from "@/components/ui/IconButton";
import { Card } from "@/components/ui/Card";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface LegalSection {
  n: string;
  h: string;
  p: string;
}

interface LegalContentProps {
  title: string;
  sections: readonly LegalSection[];
  lastUpdated: string;
  readTime: string;
}

export function LegalContent({ title, sections, lastUpdated, readTime }: LegalContentProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
        />
        <Text
          style={[typography.button, styles.headerTitle, { color: colors.text, fontSize: 16 }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info pill */}
        <View style={[styles.infoPill, { backgroundColor: colors.surfaceTint }]}>
          <View style={styles.infoPillRow}>
            <Clock size={13} color={colors.muted} />
            <Text style={[typography.captionSm, { color: colors.muted }]}>{lastUpdated}</Text>
          </View>
          <View style={styles.infoPillDot} />
          <View style={styles.infoPillRow}>
            <BookOpen size={13} color={colors.muted} />
            <Text style={[typography.captionSm, { color: colors.muted }]}>{readTime}</Text>
          </View>
        </View>

        {/* Sections card */}
        <Card style={styles.sectionsCard}>
          {sections.map((section, index) => (
            <View key={section.n}>
              <View style={styles.sectionItem}>
                <Text
                  style={[
                    {
                      fontFamily: fonts.display800,
                      fontSize: 12,
                      lineHeight: 12,
                      color: colors.primary,
                      marginBottom: 8,
                    },
                  ]}
                >
                  {section.n}
                </Text>
                <Text
                  style={[
                    {
                      fontFamily: fonts.body700,
                      fontSize: 14,
                      lineHeight: 20,
                      color: colors.text,
                      marginBottom: 6,
                    },
                  ]}
                >
                  {section.h}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body400,
                    fontSize: 12,
                    lineHeight: 19.8,
                    color: colors.textSecondary,
                  }}
                >
                  {section.p}
                </Text>
              </View>
              {index < sections.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </Card>

        {/* Disclaimer */}
        <Text style={[typography.captionSm, styles.disclaimer, { color: colors.muted }]}>
          {t("legal.disclaimer")}
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 8,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 8,
    marginBottom: 20,
  },
  infoPillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoPillDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#B0ADA8",
  },
  sectionsCard: {
    padding: 20,
  },
  sectionItem: {
    paddingVertical: 16,
  },
  separator: {
    height: 1,
  },
  disclaimer: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
    fontStyle: "italic",
  },
  bottomSpacer: {
    height: 32,
  },
});
