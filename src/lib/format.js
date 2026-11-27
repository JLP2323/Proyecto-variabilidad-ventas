const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });
const int = new Intl.NumberFormat('es-EC');
const plural = new Intl.PluralRules('es');
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es', { granularity: 'grapheme' }) : null;

export const formatMoney = (n) => (Number.isFinite(n) ? money.format(n) : '—');
export const formatInt = (n) => (Number.isFinite(n) ? int.format(n) : '—');

/** pluralize(1, 'producto', 'productos') -> "1 producto" */
export function pluralize(count, one, other) {
  const word = plural.select(count) === 'one' ? one : other;
  return `${formatInt(count)} ${word}`;
}

/** Recorta texto largo (p. ej. opciones de <select>) sin cortar grafemas. */
export function clip(text, max = 60) {
  const chars = segmenter ? [...segmenter.segment(String(text ?? ''))].map((s) => s.segment) : [...String(text ?? '')];
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : chars.join('');
}

const firstGrapheme = (w) => (segmenter ? [...segmenter.segment(w)][0]?.segment ?? '' : [...w][0] ?? '');

/**
 * Iniciales: primera + última palabra, ignorando sufijos (Jr, Sr, II, III, IV).
 * Devuelve '' si empieza con emoji (el avatar usa un icono de respaldo).
 */
export function initials(name) {
  const words = String(name ?? '').trim().split(/\s+/).filter((w) => w && !/^(jr|sr|ii|iii|iv)\.?$/i.test(w));
  if (!words.length) return '';
  const first = firstGrapheme(words[0]);
  if (/\p{Extended_Pictographic}/u.test(first)) return '';
  const last = words.length > 1 ? firstGrapheme(words[words.length - 1]) : '';
  return (first + last).toLocaleUpperCase('es');
}
