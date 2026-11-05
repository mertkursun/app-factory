import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function FamilyIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      <Defs>
        <LinearGradient id="famCard1" x1="40" y1="40" x2="180" y2="200">
          <Stop offset="0" stopColor={colors.primary} />
          <Stop offset="1" stopColor={colors.primaryDeep} />
        </LinearGradient>
      </Defs>

      {/* Back profile card */}
      <G opacity={0.5}>
        <Rect
          x={60}
          y={22}
          width={160}
          height={80}
          rx={16}
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={1.5}
        />
        <Circle cx={100} cy={62} r={20} fill={colors.primaryLight} opacity={0.25} />
        <Circle cx={100} cy={56} r={8} fill="#E8B48A" />
        <Path d="M88 76 C90 68 94 64 100 64 C106 64 110 68 112 76" fill={colors.primary} />
        <Rect x={130} y={50} width={68} height={7} rx={3.5} fill={colors.text} opacity={0.4} />
        <Rect x={130} y={63} width={46} height={6} rx={3} fill={colors.muted} opacity={0.3} />
      </G>

      {/* Front profile card — adult */}
      <Rect
        x={32}
        y={64}
        width={180}
        height={80}
        rx={16}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={1.5}
      />
      <Circle cx={76} cy={104} r={22} fill={colors.primaryLight} opacity={0.2} />
      <Circle cx={76} cy={97} r={9} fill="#E8B48A" />
      <Path d="M62 120 C64 110 70 106 76 106 C82 106 88 110 90 120" fill={colors.primary} />
      {/* Hair */}
      <Path d="M67 93 C67 85 71 82 76 82 C82 82 86 86 86 94 C82 89 71 89 67 93 Z" fill="#3B2A22" />
      <Rect x={108} y={90} width={80} height={7} rx={3.5} fill={colors.text} opacity={0.8} />
      <Rect x={108} y={103} width={56} height={6} rx={3} fill={colors.muted} opacity={0.5} />
      {/* Active badge */}
      <Circle cx={192} cy={104} r={8} fill={colors.success} />
      <Path
        d="M188 104 l3 3 5 -5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Baby avatar card — smaller, offset */}
      <Rect
        x={52}
        y={156}
        width={76}
        height={68}
        rx={14}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={1.5}
      />
      <Circle cx={90} cy={182} r={16} fill="#FDEBD0" />
      <Circle cx={90} cy={178} r={7} fill="#F5C9A8" />
      {/* Baby bib */}
      <Path d="M82 194 C83 188 86 186 90 186 C94 186 97 188 98 194" fill="#F08BC4" />
      {/* Baby cheeks */}
      <Circle cx={84} cy={181} r={2.5} fill="#FFB8B8" opacity={0.6} />
      <Circle cx={96} cy={181} r={2.5} fill="#FFB8B8" opacity={0.6} />
      <Rect x={62} y={204} width={56} height={5} rx={2.5} fill={colors.muted} opacity={0.5} />

      {/* VS comparison badge */}
      <Rect
        x={148}
        y={162}
        width={72}
        height={56}
        rx={14}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={1.5}
      />
      {/* Two mini product outlines */}
      <Rect
        x={160}
        y={172}
        width={18}
        height={26}
        rx={4}
        fill={colors.successBg}
        stroke={colors.success}
        strokeWidth={1}
      />
      <Rect
        x={190}
        y={172}
        width={18}
        height={26}
        rx={4}
        fill={colors.dangerBg}
        stroke={colors.danger}
        strokeWidth={1}
      />
      {/* VS text */}
      <SvgText
        x={184}
        y={190}
        fontSize={10}
        fontWeight="700"
        fill={colors.primary}
        textAnchor="middle"
      >
        VS
      </SvgText>
      {/* Arrow pointing to winner */}
      <Path
        d="M162 205 l5 5 5 -5"
        stroke={colors.success}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle */}
      <Path d="M236 50 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F2B544" />
      <Path d="M22 142 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={colors.primaryLight} />

      {/* Connected line between cards */}
      <Path d="M90 144 L90 156" stroke={colors.border} strokeWidth={2} strokeDasharray="3 3" />
    </Svg>
  );
}
