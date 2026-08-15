export const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function daysSince(dateIso: string): number {
  const ms = Date.now() - new Date(dateIso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
