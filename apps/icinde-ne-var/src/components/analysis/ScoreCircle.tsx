import { View, Text } from "react-native";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

type StatusKey = "success" | "warning" | "danger";

interface ScoreCircleProps {
  skor: SkorRenk;
}

const SCORE_ICONS = {
  yesil: ShieldCheck,
  sari: AlertTriangle,
  kirmizi: ShieldAlert,
} as const;

const SKOR_STATUS_MAP: Record<SkorRenk, StatusKey> = {
  yesil: "success",
  sari: "warning",
  kirmizi: "danger",
};

const SKOR_LABEL_KEY: Record<SkorRenk, string> = {
  yesil: "analysis.safe",
  sari: "analysis.caution",
  kirmizi: "analysis.danger",
};

export function ScoreCircle({ skor }: ScoreCircleProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const Icon = SCORE_ICONS[skor];
  const status = SKOR_STATUS_MAP[skor];
  const label = t(SKOR_LABEL_KEY[skor]);

  const bgColorMap: Record<StatusKey, string> = {
    success: colors.successBg,
    warning: colors.warningBg,
    danger: colors.dangerBg,
  };

  const textColorMap: Record<StatusKey, string> = {
    success: colors.successText,
    warning: colors.warningText,
    danger: colors.dangerText,
  };

  const bgColor = bgColorMap[status];
  const textColor = textColorMap[status];

  return (
    <View className="items-center py-6">
      <View
        className="w-32 h-32 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: bgColor, borderWidth: 6, borderColor: textColor }}
        accessibilityLabel={`${t("analysis.score")} ${label}`}
        accessibilityRole="image"
      >
        <Icon size={32} color={textColor} />
      </View>
      <Text className="text-xl font-title" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}
