// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Formatter {
  static FormDate(value: Date): string {
    const date = new Date(value);
    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  }
}
