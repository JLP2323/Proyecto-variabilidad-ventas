import { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { EmptyState, Field, Icon, PageTitle, usePaged } from '../components/ui.jsx';
import { calculateTotals, IVA_RATE } from '../lib/sales.js';
import { clip, formatMoney, pluralize } from '../lib/format.js';
import { isFeatureEnabled, getSaleOptions } from '../lib/variants.js';

const DISCOUNTS = [0, 0.05, 0.1, 0.15, 0.2];

export default function SalesPage() {
  const { products, customers, sales, confirmSale } = useStore();
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [discountRate, setDiscountRate] = useState(0);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(null);
  const [visibleSales, moreSales] = usePaged(sales);

  const hasDiscounts = isFeatureEnabled('discounts');
  const options = getSaleOptions(discountRate);
  const totals = calculateTotals(cart, options);
  const nameOf = (id) => products.find((p) => p.id === id)?.name ?? '—';
  const customerName = (id) => customers.find((c) => c.id === id)?.name ?? 'Consumidor final';

  const addToCart = () => {
    const p = products.find((x) => x.id === productId);
    const q = Math.floor(Number(qty));
    if (!p || !(q > 0)) return;
    const inCart = cart.find((i) => i.productId === p.id)?.qty ?? 0;
    if (inCart + q > p.stock) return setMessage({ type: 'error', text: `Stock insuficiente de ${p.name}` });
    setMessage(null);
    setCart((c) =>
      c.some((i) => i.productId === p.id)
        ? c.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + q } : i))
        : [...c, { productId: p.id, price: p.price, qty: q }]
    );
  };

  const confirm = () => {
    try {
      confirmSale({ customerId, items: cart, options });
      setCart([]);
      setMessage({ type: 'ok', text: 'Venta registrada correctamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <section className="space-y-4">
      <PageTitle icon="cart" title="Registro de ventas" count={pluralize(sales.length, 'venta registrada', 'ventas registradas')} />

      <div className="card grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_6rem_auto] sm:items-end">
        <Field label="Cliente">
          <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Consumidor final</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{clip(c.name)}</option>)}
          </select>
        </Field>
        <Field label="Producto">
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Seleccionar…</option>
            {products.map((p) => <option key={p.id} value={p.id} disabled={p.stock === 0}>{clip(p.name)} ({p.stock})</option>)}
          </select>
        </Field>
        <Field label="Cantidad"><input className="input num" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
        <button className="btn-ghost" onClick={addToCart}><Icon name="plus" className="h-4 w-4" />Agregar</button>
      </div>

      {cart.length === 0 ? (
        <EmptyState icon="cart" title="El carrito está vacío" hint="Selecciona un producto y una cantidad." />
      ) : (
        <div className="card space-y-3">
          <p className="text-sm text-slate-500">{pluralize(cart.length, 'línea', 'líneas')} de detalle</p>
          <ul className="divide-y divide-slate-100">
            {cart.map((i) => (
              <li key={i.productId} className="space-y-1 py-2">
                <div className="flex items-start gap-3">
                  <p className="safe-text min-w-0 flex-1 font-medium">{nameOf(i.productId)}</p>
                  <button className="btn-danger" onClick={() => setCart(cart.filter((x) => x.productId !== i.productId))}>Quitar</button>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                  <span className="num text-slate-500">{i.qty} × {formatMoney(i.price)}</span>
                  <span className="num font-medium">{formatMoney(i.qty * i.price)}</span>
                </div>
              </li>
            ))}
          </ul>
          {hasDiscounts && (
            <div className="max-w-xs">
              <Field label="Descuento (Premium)">
                <select className="input num" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))}>
                  {DISCOUNTS.map((d) => <option key={d} value={d}>{d * 100}%</option>)}
                </select>
              </Field>
            </div>
          )}
          <dl className="ml-auto max-w-xs space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
            <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="num">{formatMoney(totals.subtotal)}</dd></div>
            {hasDiscounts && (
              <div className="flex justify-between gap-4"><dt>Descuento</dt><dd className="num">-{formatMoney(totals.discount)}</dd></div>
            )}
            <div className="flex justify-between gap-4"><dt>IVA ({IVA_RATE * 100}%)</dt><dd className="num">{formatMoney(totals.iva)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-1 text-base font-semibold"><dt>Total</dt><dd className="num">{formatMoney(totals.total)}</dd></div>
          </dl>
          <button className="btn-primary" onClick={confirm}>Confirmar venta</button>
        </div>
      )}

      {message && (
        <p className={`safe-text rounded-lg px-3 py-2 text-sm ${message.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{message.text}</p>
      )}

      <h3 className="font-semibold">Historial</h3>
      {sales.length === 0 ? (
        <EmptyState icon="cart" title="Aún no hay ventas" />
      ) : (
        <ul className="space-y-2">
          {visibleSales.map((s) => (
            <li key={s.id} className="card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="safe-text font-medium">{customerName(s.customerId)}</p>
                <p className="text-sm text-slate-500">{new Date(s.date).toLocaleString('es-EC')} · {pluralize(s.items.length, 'línea', 'líneas')}</p>
              </div>
              <span className="num shrink-0 font-semibold text-indigo-700">{formatMoney(s.total)}</span>
            </li>
          ))}
          {moreSales && <li className="flex">{moreSales}</li>}
        </ul>
      )}
    </section>
  );
}
