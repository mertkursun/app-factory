import Svg, { Rect, Circle, Path } from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function ColorsIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      {/* Traffic light capsule */}
      <Rect x={152} y={14} width={76} height={224} rx={38} fill="#12302C" />
      <Rect x={158} y={20} width={64} height={212} rx={32} fill="#1B403B" />

      {/* Green — safe */}
      <Circle cx={190} cy={56} r={34} fill="#1D9E5F" opacity={0.22} />
      <Circle cx={190} cy={56} r={23} fill="#1D9E5F" />
      <Circle cx={184} cy={50} r={7} fill="#fff" opacity={0.35} />
      <Path
        d="M180 56 l7 7 13 -14"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Yellow — caution */}
      <Circle cx={190} cy={126} r={30} fill="#E39B07" opacity={0.16} />
      <Circle cx={190} cy={126} r={23} fill="#E39B07" />
      <Circle cx={184} cy={120} r={7} fill="#fff" opacity={0.3} />
      <Path d="M190 114 v14 M190 136 v1" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />

      {/* Red — danger */}
      <Circle cx={190} cy={196} r={30} fill="#E03E3E" opacity={0.16} />
      <Circle cx={190} cy={196} r={23} fill="#E03E3E" />
      <Circle cx={184} cy={190} r={7} fill="#fff" opacity={0.3} />
      <Path
        d="M182 188 l16 16 M198 188 l-16 16"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Dashed connecting lines */}
      <Path d="M150 56 H118" stroke={colors.border} strokeWidth={2} strokeDasharray="4 4" />
      <Path d="M150 126 H118" stroke={colors.border} strokeWidth={2} strokeDasharray="4 4" />
      <Path d="M150 196 H118" stroke={colors.border} strokeWidth={2} strokeDasharray="4 4" />

      {/* Card 1 — safe */}
      <Rect
        x={20}
        y={34}
        width={98}
        height={44}
        rx={14}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Rect x={30} y={44} width={24} height={24} rx={8} fill="#DDF4E6" />
      <Path
        d="M36 56 l4 4 8 -9"
        stroke="#1D9E5F"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x={62} y={47} width={44} height={6} rx={3} fill={colors.text} opacity={0.85} />
      <Rect x={62} y={58} width={30} height={5} rx={2.5} fill={colors.muted} opacity={0.6} />

      {/* Card 2 — caution */}
      <Rect
        x={20}
        y={104}
        width={98}
        height={44}
        rx={14}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Rect x={30} y={114} width={24} height={24} rx={8} fill="#FDF0C7" />
      <Path d="M42 120 v7 M42 131 v.5" stroke="#E39B07" strokeWidth={2.8} strokeLinecap="round" />
      <Rect x={62} y={117} width={38} height={6} rx={3} fill={colors.text} opacity={0.85} />
      <Rect x={62} y={128} width={26} height={5} rx={2.5} fill={colors.muted} opacity={0.6} />

      {/* Card 3 — danger */}
      <Rect
        x={20}
        y={174}
        width={98}
        height={44}
        rx={14}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Rect x={30} y={184} width={24} height={24} rx={8} fill="#FDE2E2" />
      <Path
        d="M38 192 l8 8 M46 192 l-8 8"
        stroke="#E03E3E"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Rect x={62} y={187} width={46} height={6} rx={3} fill={colors.text} opacity={0.85} />
      <Rect x={62} y={198} width={22} height={5} rx={2.5} fill={colors.muted} opacity={0.6} />

      {/* Leaf decoration */}
      <Path
        d="M240 150 C250 136 250 118 240 106 C228 114 226 136 240 150 Z"
        fill={colors.primary}
      />
      <Path
        d="M240 148 C240 134 238 122 236 112"
        stroke={colors.background}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
