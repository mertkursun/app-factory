import Svg, {
  Rect,
  Circle,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import type { ThemeColors } from "@/theme/tokens";

interface IllustrationProps {
  size: number;
  colors: ThemeColors;
}

export function ProIllustration({ size, colors }: IllustrationProps) {
  return (
    <Svg width={size} height={size * (250 / 264)} viewBox="0 0 264 250" fill="none">
      <Defs>
        <LinearGradient id="onbPro" x1="140" y1="30" x2="250" y2="220">
          <Stop offset="0" stopColor="#2BC4B4" />
          <Stop offset="1" stopColor="#0A5B55" />
        </LinearGradient>
      </Defs>

      {/* Free card */}
      <Rect
        x={16}
        y={60}
        width={112}
        height={160}
        rx={22}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={1.5}
      />
      <Rect x={34} y={78} width={52} height={8} rx={4} fill={colors.muted} opacity={0.5} />
      <SvgText
        x={34}
        y={134}
        fontFamily="Bricolage Grotesque"
        fontWeight="800"
        fontSize={46}
        fill={colors.text}
        letterSpacing={-2}
      >
        5
      </SvgText>
      <SvgText
        x={66}
        y={134}
        fontFamily="Plus Jakarta Sans"
        fontWeight="600"
        fontSize={13}
        fill={colors.muted}
      >
        / ay
      </SvgText>
      {/* Quota dots */}
      <Circle cx={40} cy={160} r={7} fill={colors.primary} />
      <Circle cx={58} cy={160} r={7} fill={colors.primary} />
      <Circle cx={76} cy={160} r={7} fill={colors.primary} />
      <Circle cx={94} cy={160} r={7} fill={colors.primary} opacity={0.35} />
      <Circle cx={112} cy={160} r={7} fill={colors.primary} opacity={0.35} />
      {/* Placeholder lines */}
      <Rect x={34} y={184} width={76} height={6} rx={3} fill={colors.border} />
      <Rect x={34} y={196} width={54} height={6} rx={3} fill={colors.border} />

      {/* Pro card */}
      <Rect x={136} y={32} width={116} height={196} rx={24} fill="url(#onbPro)" />
      <Circle cx={232} cy={60} r={60} fill="rgba(255,255,255,0.08)" />
      {/* PRO badge */}
      <Rect x={154} y={52} width={48} height={22} rx={11} fill="rgba(255,255,255,0.2)" />
      <SvgText
        x={178}
        y={67}
        textAnchor="middle"
        fontFamily="Plus Jakarta Sans"
        fontWeight="800"
        fontSize={11}
        fill="#fff"
        letterSpacing={1}
      >
        PRO
      </SvgText>
      {/* Crown */}
      <Path d="M210 50 l4 -10 6 8 8 -6 -3 16 h-20 l-3 -16 8 6z" fill="#FBD36A" />
      {/* Infinity symbol */}
      <Path
        d="M194 128 c-6 -8 -12 -12 -18 -12 a12 12 0 1 0 0 24 c6 0 12 -4 18 -12z m0 0 c6 8 12 12 18 12 a12 12 0 1 0 0 -24 c-6 0 -12 4 -18 12z"
        stroke="#fff"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <SvgText
        x={194}
        y={168}
        textAnchor="middle"
        fontFamily="Plus Jakarta Sans"
        fontWeight="700"
        fontSize={13}
        fill="#fff"
      >
        {"Sınırsız tarama"}
      </SvgText>
      {/* Bottom lines */}
      <Rect x={156} y={186} width={76} height={6} rx={3} fill="rgba(255,255,255,0.45)" />
      <Rect x={156} y={198} width={52} height={6} rx={3} fill="rgba(255,255,255,0.45)" />

      {/* Sparkle gold */}
      <Path d="M248 20 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F2B544" />
      {/* Sparkle teal */}
      <Path d="M130 236 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={colors.primaryLight} />
    </Svg>
  );
}
