import { br } from "./br";
import { en } from "./en";
import { es } from "./es";

const translations = {
	es,
	en,
	br,
};

export type locale = keyof typeof translations;

export function useTranslations(locale: string) {
	return translations[locale as locale] ?? translations.es;
}
