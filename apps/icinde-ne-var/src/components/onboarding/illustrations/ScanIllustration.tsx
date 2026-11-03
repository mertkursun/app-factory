import Svg, { Rect, Path, Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function ScanIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      <Defs>
        <LinearGradient id="onbShade" x1="150" y1="68" x2="228" y2="186">
          <Stop offset="0" stopColor="#fff" stopOpacity={0.25} />
          <Stop offset="1" stopColor="#000" stopOpacity={0.12} />
        </LinearGradient>
        <LinearGradient id="onbGlow" x1="0" y1="112" x2="0" y2="123">
          <Stop offset="0" stopColor="#2DD4BF" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#2DD4BF" stopOpacity={0.55} />
          <Stop offset="1" stopColor="#2DD4BF" stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {/* Product package */}
      <Rect x={150} y={68} width={78} height={118} rx={12} fill="#F2B544" />
      <Rect x={150} y={68} width={78} height={118} rx={12} fill="url(#onbShade)" />
      <Rect x={150} y={104} width={78} height={30} fill="#FFF4D6" />
      <Path d="M176 128 C178 114 190 108 202 110 C200 122 190 130 176 128 Z" fill="#1D9E5F" />
      <Rect x={162} y={150} width={54} height={5} rx={2.5} fill="#D99A2B" />
      <Rect x={162} y={161} width={38} height={5} rx={2.5} fill="#D99A2B" />

      {/* Phone body */}
      <Rect x={54} y={18} width={118} height={216} rx={26} fill="#0F1F1D" />
      <Rect x={61} y={26} width={104} height={200} rx={20} fill={colors.background} />
      <Rect x={97} y={34} width={32} height={8} rx={4} fill="#0F1F1D" />

      {/* Camera viewfinder */}
      <Rect x={73} y={66} width={80} height={104} rx={14} fill={colors.cameraBg} />

      {/* Corner brackets */}
      <Path
        d="M83 84 V76 H91 M135 76 H143 V84 M143 152 V160 H135 M91 160 H83 V152"
        stroke={colors.primaryLight}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Barcode lines */}
      <G opacity={0.9}>
        <Rect x={92} y={100} width={3} height={36} fill="#fff" />
        <Rect x={98} y={100} width={2} height={36} fill="#fff" />
        <Rect x={103} y={100} width={4} height={36} fill="#fff" />
        <Rect x={110} y={100} width={2} height={36} fill="#fff" />
        <Rect x={115} y={100} width={3} height={36} fill="#fff" />
        <Rect x={121} y={100} width={2} height={36} fill="#fff" />
        <Rect x={126} y={100} width={4} height={36} fill="#fff" />
        <Rect x={133} y={100} width={2} height={36} fill="#fff" />
      </G>

      {/* Scan line + glow */}
      <Rect x={79} y={116} width={68} height={3} rx={1.5} fill={colors.primaryLight} />
      <Rect x={79} y={112} width={68} height={11} rx={2} fill="url(#onbGlow)" />

      {/* Bottom bar */}
      <Rect x={73} y={180} width={80} height={12} rx={6} fill={colors.surfaceTint} />
      <Rect x={82} y={184} width={40} height={4} rx={2} fill={colors.primary} />

      {/* Home indicator */}
      <Circle cx={113} cy={206} r={10} fill={colors.primary} />
      <Circle cx={113} cy={206} r={4} fill={colors.background} />

      {/* Check circle */}
      <Circle cx={44} cy={190} r={22} fill={colors.surface} stroke={colors.border} />
      <Path
        d="M36 190 L42 196 L53 184"
        stroke="#1D9E5F"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Plus circle */}
      <Circle cx={206} cy={36} r={16} fill={colors.surface} stroke={colors.border} />
      <Path
        d="M200 36 h12 M206 30 v12"
        stroke={colors.primary}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Sparkle top-left */}
      <Path d="M40 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F2B544" />

      {/* Sparkle bottom-right */}
      <Path d="M236 200 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={colors.primaryLight} />
    </Svg>
  );
}
