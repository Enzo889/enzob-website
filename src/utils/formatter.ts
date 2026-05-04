// src/utils/Formatter.ts

/**
 * Formatea una fecha al estilo Vesper (English US)
 * @param value - Fecha en string o objeto Date
 */
export const formDate = (value: string | Date): string => {
  const date = new Date(value);

  // Validamos que la fecha sea correcta para evitar "Invalid Date"
  if (Number.isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
};
