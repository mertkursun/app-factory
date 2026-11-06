const TR_LOCALE = "tr-TR";

export function toUpperTR(str: string): string {
  return str.toLocaleUpperCase(TR_LOCALE);
}
