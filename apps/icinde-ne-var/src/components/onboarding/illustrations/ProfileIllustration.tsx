import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function ProfileIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      <Defs>
        <LinearGradient id="onbShield" x1="80" y1="20" x2="190" y2="200">
          <Stop offset="0" stopColor="#2BC4B4" />
          <Stop offset="1" stopColor="#0B6E66" />
        </LinearGradient>
      </Defs>

      {/* Shield outer */}
      <Path
        d="M132 18 L206 44 V118 C206 166 174 200 132 220 C90 200 58 166 58 118 V44 Z"
        fill="url(#onbShield)"
      />
      {/* Shield inner highlight */}
      <Path
        d="M132 34 L190 55 V118 C190 156 164 184 132 202 C100 184 74 156 74 118 V55 Z"
        fill="rgba(255,255,255,0.1)"
      />
      {/* Shield edge stroke */}
      <Path
        d="M132 18 L206 44 V118 C206 166 174 200 132 220"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Check circle */}
      <Circle cx={132} cy={106} r={34} fill="rgba(255,255,255,0.16)" />
      <Path
        d="M114 108 l12 12 24 -26"
        stroke="#fff"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Avatar */}
      <Circle
        cx={64}
        cy={194}
        r={34}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={2}
      />
      <Circle cx={64} cy={186} r={12} fill="#E8B48A" />
      <Path d="M42 222 C44 206 52 200 64 200 C76 200 84 206 86 222" fill={colors.primary} />
      {/* Hair */}
      <Path
        d="M52 182 C52 172 58 168 64 168 C72 168 77 173 77 184 C72 178 60 178 52 182 Z"
        fill="#3B2A22"
      />

      {/* Tag pill — green */}
      <Rect
        x={178}
        y={178}
        width={76}
        height={34}
        rx={17}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Circle cx={196} cy={195} r={7} fill="#1D9E5F" />
      <Rect x={208} y={191} width={34} height={8} rx={4} fill={colors.text} opacity={0.8} />

      {/* Tag pill — yellow */}
      <Rect
        x={188}
        y={134}
        width={70}
        height={34}
        rx={17}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Circle cx={206} cy={151} r={7} fill="#E39B07" />
      <Rect x={218} y={147} width={28} height={8} rx={4} fill={colors.text} opacity={0.8} />

      {/* Tag pill — red */}
      <Rect
        x={4}
        y={98}
        width={66}
        height={34}
        rx={17}
        fill={colors.surface}
        stroke={colors.border}
      />
      <Circle cx={22} cy={115} r={7} fill="#E03E3E" />
      <Rect x={34} y={111} width={26} height={8} rx={4} fill={colors.text} opacity={0.8} />

      {/* Sparkle gold */}
      <Path d="M226 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F2B544" />
      {/* Sparkle teal */}
      <Path d="M30 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={colors.primaryLight} />
    </Svg>
  );
}
