import { useTranslation } from "react-i18next";
import { LegalContent } from "@/components/legal/LegalContent";

export default function PrivacyScreen() {
  const { t } = useTranslation();

  const sections = [
    { n: "01", h: t("legal.privacyS1Title"), p: t("legal.privacyS1Body") },
    { n: "02", h: t("legal.privacyS2Title"), p: t("legal.privacyS2Body") },
    { n: "03", h: t("legal.privacyS3Title"), p: t("legal.privacyS3Body") },
    { n: "04", h: t("legal.privacyS4Title"), p: t("legal.privacyS4Body") },
    { n: "05", h: t("legal.privacyS5Title"), p: t("legal.privacyS5Body") },
  ] as const;

  return (
    <LegalContent
      title={t("legal.privacy")}
      sections={sections}
      lastUpdated={t("legal.lastUpdated")}
      readTime={t("legal.readTime")}
    />
  );
}
