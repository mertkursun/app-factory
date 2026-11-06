import Svg, { Circle, Line, Path } from "react-native-svg";
import { useTranslation } from "react-i18next";

interface LogoMarkProps {
  size?: number;
  color?: string;
}

export function LogoMark({ size = 80, color = "#0F766E" }: LogoMarkProps) {
  const { t } = useTranslation();

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      accessibilityLabel={t("auth.logoAlt")}
    >
      {/* Büyüteç gövdesi */}
      <Circle cx="52" cy="50" r="22" stroke={color} strokeWidth="3.5" />
      {/* Büyüteç sapı */}
      <Line x1="68" y1="66" x2="86" y2="84" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Yaprak - ana */}
      <Path
        d="M42 42 C46 34, 56 33, 58 41"
        stroke="#2DD4BF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Yaprak - gölge */}
      <Path
        d="M38 48 C40 38, 52 36, 56 44"
        stroke="#2DD4BF"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Skor noktaları: yeşil / sarı / kırmızı */}
      <Circle cx="44" cy="54" r="3" fill="#16A34A" />
      <Circle cx="52" cy="54" r="3" fill="#CA8A04" />
      <Circle cx="60" cy="54" r="3" fill="#DC2626" />
    </Svg>
  );
}
