import { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { EmptyState, Field } from '../components/ui.jsx';
import { calculateTotals, IVA_RATE } from '../lib/sales.js';
import { formatMoney, pluralize } from '../lib/format.js';

export default function SalesPage() {
  const { products, customers, sales, confirmSale } = useStore();
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(null);

  const totals = calculateTotals(cart);
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
      confirmSale({ customerId, items: cart });
      setCart([]);
      setMessage({ type: 'ok', text: 'Venta registrada correctamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Registro de ventas</h2>

      <div className="card grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_6rem_auto] sm:items-end">
        <Field label="Cliente">
          <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Consumidor final</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Producto">
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Seleccionar…</option>
            {products.map((p) => <option key={p.id} value={p.id} disabled={p.stock === 0}>{p.name} ({p.stock})</option>)}
          </select>
        </Field>
        <Field label="Cantidad"><input className="input num" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
        <button className="btn-ghost" onClick={addToCart}>Agregar</button>
      </div>

      {cart.length === 0 ? (
        <EmptyState title="El carrito está vacío" hint="Selecciona un producto y una cantidad." />
      ) : (
        <div className="card space-y-2">
          <p className="text-sm text-slate-500">{pluralize(cart.length, 'línea', 'líneas')} de detalle</p>
          <ul className="divide-y">
            {cart.map((i) => (
              <li key={i.productId} className="flex items-start gap-3 py-2">
                <p className="safe-text min-w-0 flex-1">{nameOf(i.productId)}</p>
                <span className="num shrink-0 text-sm text-slate-500">{i.qty} × {formatMoney(i.price)}</span>
                <span className="num w-24 shrink-0 text-right">{formatMoney(i.qty * i.price)}</span>
                <button className="btn-danger" onClick={() => setCart(cart.filter((x) => x.productId !== i.productId))}>Quitar</button>
              </li>
            ))}
          </ul>
          <dl className="ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="num">{formatMoney(totals.subtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt>IVA ({IVA_RATE * 100}%)</dt><dd className="num">{formatMoney(totals.iva)}</dd></div>
            <div className="flex justify-between gap-4 text-base font-semibold"><dt>Total</dt><dd className="num">{formatMoney(totals.total)}</dd></div>
          </dl>
          <button className="btn-primary" onClick={confirm}>Confirmar venta</button>
        </div>
      )}

      {message && (
        <p className={`safe-text text-sm ${message.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}>{message.text}</p>
      )}

      <h3 className="font-semibold">Historial <span className="text-sm font-normal text-slate-500">({pluralize(sales.length, 'venta', 'ventas')})</span></h3>
      {sales.length === 0 ? (
        <EmptyState title="Aún no hay ventas" />
      ) : (
        <ul className="space-y-2">
          {sales.map((s) => (
            <li key={s.id} className="card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="safe-text font-medium">{customerName(s.customerId)}</p>
                <p className="text-sm text-slate-500">{new Date(s.date).toLocaleString('es-EC')} · {pluralize(s.items.length, 'línea', 'líneas')}</p>
              </div>
              <span className="num shrink-0 font-semibold">{formatMoney(s.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
