import { useTranslation } from "react-i18next";
import { LegalContent } from "@/components/legal/LegalContent";

export default function TermsScreen() {
  const { t } = useTranslation();

  const sections = [
    { n: "01", h: t("legal.termsS1Title"), p: t("legal.termsS1Body") },
    { n: "02", h: t("legal.termsS2Title"), p: t("legal.termsS2Body") },
    { n: "03", h: t("legal.termsS3Title"), p: t("legal.termsS3Body") },
    { n: "04", h: t("legal.termsS4Title"), p: t("legal.termsS4Body") },
    { n: "05", h: t("legal.termsS5Title"), p: t("legal.termsS5Body") },
    { n: "06", h: t("legal.termsS6Title"), p: t("legal.termsS6Body") },
    { n: "07", h: t("legal.termsS7Title"), p: t("legal.termsS7Body") },
    { n: "08", h: t("legal.termsS8Title"), p: t("legal.termsS8Body") },
  ] as const;

  return (
    <LegalContent
      title={t("legal.terms")}
      sections={sections}
      lastUpdated={t("legal.lastUpdated")}
      readTime={t("legal.readTime")}
    />
  );
}
