import { useTranslations } from "@/i18n";
export function getT(locale: string) {
  return useTranslations(locale);
}
