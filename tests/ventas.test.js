import { describe, it, expect } from 'vitest';
import { calculateTotals, applyStockDiscount } from '../src/lib/sales.js';

describe('Ventas: totales e impuestos', () => {
  it('calcula subtotal, IVA 15% y total', () => {
    const t = calculateTotals([
      { price: 45.5, qty: 2 },
      { price: 18, qty: 1 },
    ]);
    expect(t.subtotal).toBe(109);
    expect(t.iva).toBe(16.35);
    expect(t.total).toBe(999);
  });

  it('aplica descuento antes del IVA cuando se indica', () => {
    const t = calculateTotals([{ price: 100, qty: 1 }], { discountRate: 0.1 });
    expect(t).toEqual({ subtotal: 100, discount: 10, iva: 13.5, total: 103.5 });
  });
});

describe('Ventas: stock', () => {
  const products = [
    { id: 'a', name: 'A', price: 10, stock: 5 },
    { id: 'b', name: 'B', price: 20, stock: 1 },
  ];

  it('descuenta stock al confirmar sin mutar el original', () => {
    const next = applyStockDiscount(products, [{ productId: 'a', qty: 3 }]);
    expect(next.find((p) => p.id === 'a').stock).toBe(2);
    expect(products[0].stock).toBe(5);
  });

  it('rechaza ventas con stock insuficiente', () => {
    expect(() => applyStockDiscount(products, [{ productId: 'b', qty: 2 }])).toThrow(/Stock insuficiente/);
  });
});

describe('Ventas: datos límite', () => {
  it('maneja decimales binarios sin errores de redondeo', () => {
    expect(calculateTotals([{ price: 0.1, qty: 3 }]).subtotal).toBe(0.3);
  });

  it('carrito vacío, cantidad 0 y valores NaN dan total 0', () => {
    expect(calculateTotals([]).total).toBe(0);
    expect(calculateTotals([{ price: 10, qty: 0 }]).total).toBe(0);
    expect(calculateTotals([{ price: NaN, qty: 'x' }]).total).toBe(0);
  });

  it('soporta importes grandes', () => {
    const t = calculateTotals([{ price: 999999.99, qty: 1000 }]);
    expect(t.subtotal).toBeCloseTo(999999990, 2);
    expect(Number.isFinite(t.total)).toBe(true);
  });
});
