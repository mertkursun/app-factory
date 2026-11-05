import Svg, { Rect, Circle, Path, G } from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function EncyclopediaIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      {/* Main card background */}
      <Rect
        x={38}
        y={18}
        width={188}
        height={214}
        rx={20}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={1.5}
      />

      {/* Search bar */}
      <Rect
        x={56}
        y={36}
        width={152}
        height={40}
        rx={12}
        fill={colors.background}
        stroke={colors.border}
        strokeWidth={1}
      />
      {/* Search icon */}
      <Circle cx={76} cy={56} r={8} stroke={colors.muted} strokeWidth={2} fill="none" />
      <Path d="M82 62 l4 4" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" />
      {/* Search placeholder text */}
      <Rect x={92} y={52} width={80} height={7} rx={3.5} fill={colors.muted} opacity={0.4} />

      {/* Ingredient row 1 — safe */}
      <G>
        <Rect x={56} y={90} width={152} height={38} rx={10} fill={colors.successBg} />
        <Circle cx={78} cy={109} r={10} fill={colors.success} />
        <Path
          d="M74 109 l3 3 6 -6"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Rect x={96} y={102} width={72} height={6} rx={3} fill={colors.text} opacity={0.8} />
        <Rect x={96} y={113} width={48} height={5} rx={2.5} fill={colors.muted} opacity={0.5} />
      </G>

      {/* Ingredient row 2 — caution */}
      <G>
        <Rect x={56} y={136} width={152} height={38} rx={10} fill={colors.warningBg} />
        <Circle cx={78} cy={155} r={10} fill={colors.warning} />
        <Path d="M78 149 v6 M78 159 v1" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
        <Rect x={96} y={148} width={64} height={6} rx={3} fill={colors.text} opacity={0.8} />
        <Rect x={96} y={159} width={42} height={5} rx={2.5} fill={colors.muted} opacity={0.5} />
      </G>

      {/* Ingredient row 3 — danger */}
      <G>
        <Rect x={56} y={182} width={152} height={38} rx={10} fill={colors.dangerBg} />
        <Circle cx={78} cy={201} r={10} fill={colors.danger} />
        <Path d="M74 197 l8 8 M82 197 l-8 8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        <Rect x={96} y={194} width={58} height={6} rx={3} fill={colors.text} opacity={0.8} />
        <Rect x={96} y={205} width={36} height={5} rx={2.5} fill={colors.muted} opacity={0.5} />
      </G>

      {/* Speaker / voice icon — floating badge */}
      <Rect x={186} y={28} width={54} height={44} rx={14} fill={colors.primary} />
      {/* Speaker body */}
      <Path d="M204 44 l-6 4 h-4 v8 h4 l6 4 z" fill="#fff" />
      {/* Sound waves */}
      <Path
        d="M210 46 c3 2 4 5 4 8 c0 3 -1 6 -4 8"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M214 42 c5 4 7 9 7 14 c0 5 -2 10 -7 14"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />

      {/* Sparkles */}
      <Path d="M24 70 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F2B544" />
      <Path d="M244 180 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={colors.primaryLight} />

      {/* Small book icon bottom-left */}
      <G opacity={0.7}>
        <Rect x={10} y={182} width={24} height={30} rx={4} fill={colors.primary} />
        <Rect x={14} y={186} width={16} height={2} rx={1} fill="#fff" opacity={0.6} />
        <Rect x={14} y={192} width={12} height={2} rx={1} fill="#fff" opacity={0.4} />
        <Rect x={14} y={198} width={14} height={2} rx={1} fill="#fff" opacity={0.4} />
        <Path d="M10 186 v22" stroke={colors.primaryDeep} strokeWidth={2} />
      </G>
    </Svg>
  );
}
