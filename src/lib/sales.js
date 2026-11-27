export const IVA_RATE = 0.15;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Calcula subtotal, descuento opcional (punto de extensión, 0 en Core),
 * IVA y total. items: [{ price, qty }]
 */
export function calculateTotals(items, { discountRate = 0, ivaRate = IVA_RATE } = {}) {
  const subtotal = round2(
    items.reduce((acc, i) => acc + (Number(i.price) || 0) * (Number(i.qty) || 0), 0)
  );
  const discount = round2(subtotal * discountRate);
  const taxable = subtotal - discount;
  const iva = round2(taxable * ivaRate);
  return { subtotal, discount, iva, total: round2(taxable + iva) };
}

/** Descuenta stock de forma inmutable. Lanza error si no hay stock suficiente. */
export function applyStockDiscount(products, items) {
  const next = products.map((p) => ({ ...p }));
  for (const item of items) {
    const p = next.find((x) => x.id === item.productId);
    if (!p) throw new Error('Producto inexistente');
    if (item.qty > p.stock) throw new Error(`Stock insuficiente para ${p.name}`);
    p.stock -= item.qty;
  }
  return next;
}
