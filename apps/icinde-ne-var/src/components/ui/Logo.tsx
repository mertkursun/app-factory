import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "@/theme/tokens";

interface LogoProps {
  size?: number;
  variant?: "default" | "white";
}

export function Logo({ size = 120, variant = "default" }: LogoProps) {
  const { colors, isDark } = useTheme();

  const isWhite = variant === "white";
  const strokeStart = isWhite ? "#FFFFFF" : isDark ? "#5EEAD4" : "#2BC4B4";
  const strokeEnd = isWhite ? "#FFFFFF" : isDark ? "#14B8A6" : "#0B6E66";
  const leafColor = isWhite ? "#FFFFFF" : isDark ? "#2DD4BF" : colors.primary;
  const leafVeinColor = isWhite ? "rgba(255,255,255,0.3)" : isDark ? "#0A1514" : "#F7F5EE";
  const dotSuccess = isWhite ? "#FFFFFF" : colors.success;
  const dotWarning = isWhite ? "rgba(255,255,255,0.8)" : colors.warning;
  const dotDanger = isWhite ? "rgba(255,255,255,0.6)" : colors.danger;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={strokeStart} />
          <Stop offset="1" stopColor={strokeEnd} />
        </LinearGradient>
      </Defs>

      {/* Ring */}
      <Circle cx={50} cy={50} r={31} stroke="url(#ringGrad)" strokeWidth={10} fill="none" />

      {/* Handle */}
      <Path
        d="M74 74 L99 99"
        stroke="url(#ringGrad)"
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaf */}
      <Path
        d="M50 26 C63 30 69 43 64 55 C53 57 41 50 41 37 C43 31 46 27 50 26 Z"
        fill={leafColor}
      />

      {/* Leaf vein */}
      <Path
        d="M46 50 C52 44 58 38 62 32"
        stroke={leafVeinColor}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Score dots */}
      <Circle cx={37} cy={61} r={4.5} fill={dotSuccess} />
      <Circle cx={50} cy={65} r={4.5} fill={dotWarning} />
      <Circle cx={63} cy={61} r={4.5} fill={dotDanger} />
    </Svg>
  );
}
