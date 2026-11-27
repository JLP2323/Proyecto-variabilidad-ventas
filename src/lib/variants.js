import config from '../config/variants.json';

/** Variante activa: VITE_APP_VARIANT = basic | premium (por defecto basic). */
export function getVariant(raw = import.meta.env?.VITE_APP_VARIANT) {
  return raw === 'premium' ? 'premium' : 'basic';
}

export function isFeatureEnabled(feature, variant = getVariant(), cfg = config) {
  return cfg.variants[variant]?.[feature] === true;
}

/** Opciones de venta: el descuento solo se aplica si la variante lo habilita. */
export function getSaleOptions(discountRate = 0, variant = getVariant(), cfg = config) {
  return { discountRate: isFeatureEnabled('discounts', variant, cfg) ? discountRate : 0 };
}
