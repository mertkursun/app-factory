import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useTheme, radius, fonts } from "@/theme/tokens";
import { IconButton } from "@/components/ui/IconButton";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const SCREEN_PAD_X = 18;

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
  const { colors, shadow } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon={<ArrowLeft size={18} color={colors.text} />}
            onPress={() => router.back()}
            accessibilityLabel={t("common.back")}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Info row: pill + read time */}
        <View style={styles.infoRow}>
          <View style={[styles.datePill, { backgroundColor: colors.surfaceTint }]}>
            <Text style={[styles.datePillText, { color: colors.primaryDeep }]}>{lastUpdated}</Text>
          </View>
          <Text style={[styles.readTime, { color: colors.muted }]}>{readTime}</Text>
        </View>

        {/* Sections card */}
        <View
          style={[
            styles.sectionsCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            shadow.low,
          ]}
        >
          {sections.map((section, index) => (
            <View key={section.n}>
              <View style={styles.sectionItem}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={[styles.sectionNumber, { color: colors.primary }]}>{section.n}</Text>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.h}</Text>
                </View>
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                  {section.p}
                </Text>
              </View>
              {index < sections.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PAD_X,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.3,
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  datePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  datePillText: {
    fontFamily: fonts.body700,
    fontSize: 11,
    lineHeight: 11,
  },
  readTime: {
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 11,
  },
  sectionsCard: {
    marginTop: 16,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionItem: {
    paddingVertical: 14,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  sectionNumber: {
    fontFamily: fonts.display800,
    fontSize: 12,
    lineHeight: 12,
  },
  sectionTitle: {
    fontFamily: fonts.display700,
    fontSize: 14,
    lineHeight: 18.2,
    letterSpacing: -0.2,
    flex: 1,
  },
  sectionBody: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 19.8,
    marginTop: 6,
  },
  separator: {
    height: 1,
  },
  bottomSpacer: {
    height: 28,
  },
});
