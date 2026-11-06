const fmt = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export const longDate = (iso: string) => fmt.format(new Date(iso));
export const year = (iso: string) => iso.slice(0, 4);
export const pad = (n: number) => String(n).padStart(2, "0");
export const hashOf = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
