import { useColorScheme } from "react-native";
import { useAppStore } from "@/stores/appStore";

// ── Color Tokens ──────────────────────────────────────────────────

const lightColors = {
  primary: "#0F9B8E",
  primaryDeep: "#0B6E66",
  primaryLight: "#2BC4B4",
  primaryFg: "#FFFFFF",
  primaryShadow: "rgba(11,110,102,0.55)",
  primaryRing: "rgba(15,155,142,0.14)",

  background: "#F7F5EE",
  surface: "#FFFFFF",
  surfaceTint: "#E3F3EF",

  text: "#0F1F1D",
  textSecondary: "#4B5B58",
  muted: "#7E8B88",

  border: "#E4E0D5",

  success: "#1D9E5F",
  successBg: "#DDF4E6",
  successText: "#146B41",

  warning: "#E39B07",
  warningBg: "#FDF0C7",
  warningText: "#7A4F00",

  danger: "#E03E3E",
  dangerBg: "#FDE2E2",
  dangerText: "#9B1C1C",

  glass: "rgba(255,255,255,0.74)",
  glassBorder: "rgba(255,255,255,0.9)",

  cameraBg: "#0A1413",

  categoryFood: ["#F2B544", "#E39B07"] as const,
  categoryCosmetic: ["#F08BC4", "#D95BA3"] as const,
  categoryCleaning: ["#60A5FA", "#3B82F6"] as const,
} as const;

const darkColors = {
  primary: "#2DD4BF",
  primaryDeep: "#5EEAD4",
  primaryLight: "#5EEAD4",
  primaryFg: "#04302C",
  primaryShadow: "rgba(45,212,191,0.45)",
  primaryRing: "rgba(45,212,191,0.16)",

  background: "#0A1514",
  surface: "#112120",
  surfaceTint: "#143230",

  text: "#F1F5F3",
  textSecondary: "#A4B4B0",
  muted: "#6E807C",

  border: "#1E3230",

  success: "#3BD98A",
  successBg: "#0F2E22",
  successText: "#7BEDB1",

  warning: "#F5C242",
  warningBg: "#352906",
  warningText: "#FBD978",

  danger: "#F36B6B",
  dangerBg: "#3A1414",
  dangerText: "#FCA5A5",

  glass: "rgba(17,33,32,0.72)",
  glassBorder: "rgba(255,255,255,0.08)",

  cameraBg: "#070F0E",

  categoryFood: ["#F2B544", "#E39B07"] as const,
  categoryCosmetic: ["#F08BC4", "#D95BA3"] as const,
  categoryCleaning: ["#60A5FA", "#3B82F6"] as const,
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;

// ── Gradient Tokens ───────────────────────────────────────────────

export const gradients = {
  light: {
    primary: ["#19B8A6", "#0E8F84", "#0B6E66"] as const,
    primaryLocations: [0, 0.55, 1] as const,
    splash: ["#1CB9A7", "#0F8E83", "#0A5B55"] as const,
    splashLocations: [0, 0.45, 1] as const,
  },
  dark: {
    primary: ["#5EEAD4", "#2DD4BF", "#14B8A6"] as const,
    primaryLocations: [0, 0.55, 1] as const,
    splash: ["#17403A", "#0A1514"] as const,
    splashLocations: [0, 0.65] as const,
  },
} as const;

// ── Shadow Tokens ─────────────────────────────────────────────────

export const shadows = {
  light: {
    card: {
      shadowColor: "#0F1F1D",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 14,
      elevation: 6,
    },
    low: {
      shadowColor: "#0F1F1D",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 3,
    },
    primaryButton: {
      shadowColor: "rgba(11,110,102,0.55)",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
    tabBar: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 12,
    },
  },
  dark: {
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 6,
    },
    low: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.45,
      shadowRadius: 5,
      elevation: 3,
    },
    primaryButton: {
      shadowColor: "rgba(45,212,191,0.45)",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
    tabBar: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 12,
    },
  },
} as const;

// ── Typography ────────────────────────────────────────────────────

export const fonts = {
  display800: "BricolageGrotesque_800ExtraBold",
  display700: "BricolageGrotesque_700Bold",
  body400: "PlusJakartaSans_400Regular",
  body500: "PlusJakartaSans_500Medium",
  body600: "PlusJakartaSans_600SemiBold",
  body700: "PlusJakartaSans_700Bold",
  body800: "PlusJakartaSans_800ExtraBold",
} as const;

export const typography = {
  screenTitle: {
    fontFamily: fonts.display800,
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.7,
  },
  splashTitle: {
    fontFamily: fonts.display800,
    fontSize: 32,
    lineHeight: 35.2,
    letterSpacing: -0.8,
  },
  paywallHero: {
    fontFamily: fonts.display800,
    fontSize: 32,
    lineHeight: 33.6,
    letterSpacing: -0.9,
  },
  scoreNumber: { fontFamily: fonts.display800, fontSize: 54, lineHeight: 54, letterSpacing: -3 },
  cardTitle: { fontFamily: fonts.display700, fontSize: 15, lineHeight: 19.5 },
  cardTitleLg: { fontFamily: fonts.display700, fontSize: 17, lineHeight: 22.1 },
  historySkor: { fontFamily: fonts.display800, fontSize: 18, lineHeight: 18 },
  body: { fontFamily: fonts.body400, fontSize: 14, lineHeight: 21.7 },
  bodySecondary: { fontFamily: fonts.body500, fontSize: 13, lineHeight: 20.15 },
  caption: { fontFamily: fonts.body500, fontSize: 12, lineHeight: 18 },
  captionSm: { fontFamily: fonts.body600, fontSize: 11, lineHeight: 16.5 },
  button: { fontFamily: fonts.body700, fontSize: 15, lineHeight: 15 },
  badge: { fontFamily: fonts.body800, fontSize: 10, lineHeight: 10 },
  sectionLabel: {
    fontFamily: fonts.body800,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 1,
  },
} as const;

// ── Radius / Spacing ──────────────────────────────────────────────

export const radius = {
  xs: 11,
  sm: 14,
  md: 18,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  screenX: 20,
  topInset: 62,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 22,
  "3xl": 26,
  "4xl": 30,
} as const;

// ── useTheme Hook ─────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode ?? "system");

  const isDark = themeMode === "dark" || (themeMode === "system" && systemScheme === "dark");

  const colors = isDark ? darkColors : lightColors;
  const shadow = isDark ? shadows.dark : shadows.light;
  const gradient = isDark ? gradients.dark : gradients.light;

  return { colors, shadow, gradient, isDark, themeMode } as const;
}
