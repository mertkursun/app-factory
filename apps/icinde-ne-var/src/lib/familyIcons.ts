import { User, Baby, Heart, UserCheck, Smile, Crown, Cat, ShieldCheck } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

export type FamilyIconKey =
  "user" | "baby" | "heart" | "user-check" | "smile" | "crown" | "cat" | "shield-check";

interface FamilyIconOption {
  key: FamilyIconKey;
  icon: LucideIcon;
  label: string;
}

export const FAMILY_ICON_OPTIONS: FamilyIconOption[] = [
  { key: "user", icon: User, label: "User" },
  { key: "baby", icon: Baby, label: "Baby" },
  { key: "heart", icon: Heart, label: "Heart" },
  { key: "user-check", icon: UserCheck, label: "UserCheck" },
  { key: "smile", icon: Smile, label: "Smile" },
  { key: "crown", icon: Crown, label: "Crown" },
  { key: "cat", icon: Cat, label: "Cat" },
  { key: "shield-check", icon: ShieldCheck, label: "ShieldCheck" },
];

export const FAMILY_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  FAMILY_ICON_OPTIONS.map((o) => [o.key, o.icon]),
);

export function getFamilyIcon(key: string): LucideIcon {
  return FAMILY_ICON_MAP[key] ?? User;
}
