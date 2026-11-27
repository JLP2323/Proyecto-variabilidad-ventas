import { describe, it, expect } from 'vitest';
import config from '../src/config/variants.json';
import { isFeatureEnabled, getSaleOptions } from '../src/lib/variants.js';
import { calculateTotals } from '../src/lib/sales.js';
import { validateConfig } from '../scripts/validate-config.js';

const clone = () => JSON.parse(JSON.stringify(config));

describe('Variabilidad: módulo de Descuentos', () => {
  it('se habilita solo en Premium', () => {
    expect(isFeatureEnabled('discounts', 'premium')).toBe(true);
    expect(isFeatureEnabled('discounts', 'basic')).toBe(false);
  });

  it('el descuento afecta el total solo en Premium', () => {
    const items = [{ price: 100, qty: 1 }];
    const premium = calculateTotals(items, getSaleOptions(0.1, 'premium'));
    const basic = calculateTotals(items, getSaleOptions(0.1, 'basic'));
    expect(premium.total).toBe(103.5);
    expect(basic.total).toBe(115);
  });
});

describe('Variabilidad: bloqueo en Básica', () => {
  it('bloquea Exportación y Reportes en Básica', () => {
    expect(isFeatureEnabled('export', 'basic')).toBe(false);
    expect(isFeatureEnabled('reports', 'basic')).toBe(false);
  });

  it('Premium incluye todo lo de Básica más extras', () => {
    for (const f of config.required) {
      expect(isFeatureEnabled(f, 'basic')).toBe(true);
      expect(isFeatureEnabled(f, 'premium')).toBe(true);
    }
    expect(isFeatureEnabled('export', 'premium')).toBe(true);
    expect(isFeatureEnabled('reports', 'premium')).toBe(true);
  });
});

describe('Variabilidad: validate-config', () => {
  it('acepta la configuración real', () => {
    expect(validateConfig(config)).toEqual([]);
  });

  it('rechaza si una característica obligatoria está inactiva', () => {
    const bad = clone();
    bad.variants.basic.sales = false;
    expect(validateConfig(bad).join()).toMatch(/obligatoria "sales"/);
  });

  it('rechaza combinaciones inválidas (export sin reports)', () => {
    const bad = clone();
    bad.variants.premium.reports = false;
    expect(validateConfig(bad).join()).toMatch(/"export" requiere "reports"/);
  });

  it('rechaza esquema incompleto o con tipos incorrectos', () => {
    const bad = clone();
    delete bad.variants.premium;
    expect(validateConfig(bad).join()).toMatch(/Falta la variante "premium"/);
    const bad2 = clone();
    bad2.variants.basic.reports = 'no';
    expect(validateConfig(bad2).join()).toMatch(/booleano/);
    expect(validateConfig(null).length).toBeGreaterThan(0);
  });
});
