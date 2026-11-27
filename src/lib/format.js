const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });
const int = new Intl.NumberFormat('es-EC');
const plural = new Intl.PluralRules('es');

export const formatMoney = (n) => (Number.isFinite(n) ? money.format(n) : '—');
export const formatInt = (n) => (Number.isFinite(n) ? int.format(n) : '—');

/** pluralize(1, 'producto', 'productos') -> "1 producto" */
export function pluralize(count, one, other) {
  const word = plural.select(count) === 'one' ? one : other;
  return `${formatInt(count)} ${word}`;
}
