import { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { EmptyState, Field, Icon, PageTitle, usePaged } from '../components/ui.jsx';
import { formatMoney, formatInt, pluralize } from '../lib/format.js';

const EMPTY = { name: '', price: '', stock: '' };
export const MAX_PRICE = 9999999.99;
export const MAX_STOCK = 1000000;

export default function ProductsPage() {
  const { products, addProduct, updateProduct, removeProduct } = useStore();
  const { user } = useAuth();
  const canEdit = user.role === 'admin';
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [visible, more] = usePaged(products);

  const submit = (e) => {
    e.preventDefault();
    const data = { name: form.name.trim(), price: Number(form.price), stock: Math.floor(Number(form.stock)) };
    if (!data.name || !(data.price >= 0 && data.price <= MAX_PRICE) || !(data.stock >= 0 && data.stock <= MAX_STOCK)) return;
    editing ? updateProduct(editing, data) : addProduct(data);
    setForm(EMPTY);
    setEditing(null);
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock) });
  };

  return (
    <section className="space-y-4">
      <PageTitle icon="box" title="Productos" count={pluralize(products.length, 'producto', 'productos')} />

      {canEdit ? (
        <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <Field label="Nombre"><input className="input" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Precio"><input className="input num" type="number" min="0" max={MAX_PRICE} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
          <Field label="Stock"><input className="input num" type="number" min="0" max={MAX_STOCK} step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></Field>
          <button className="btn-primary"><Icon name="plus" className="h-4 w-4" />{editing ? 'Guardar' : 'Agregar'}</button>
        </form>
      ) : (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Solo el rol admin puede modificar productos.</p>
      )}

      {products.length === 0 ? (
        <EmptyState title="No hay productos" hint="Agrega el primero para comenzar a vender." />
      ) : (
        <ul className="space-y-2">
          {visible.map((p) => (
            <li key={p.id} className="card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="safe-text font-medium">{p.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span className="num font-medium text-slate-700">{formatMoney(p.price)}</span>
                  <span className={`badge ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock < 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                    {p.stock === 0 ? 'Sin stock' : <>Stock&nbsp;<span className="num">{formatInt(p.stock)}</span></>}
                  </span>
                </p>
              </div>
              {canEdit && (
                <div className="flex shrink-0 gap-2">
                  <button className="btn-ghost" onClick={() => edit(p)}>Editar</button>
                  <button className="btn-danger" onClick={() => removeProduct(p.id)}>Eliminar</button>
                </div>
              )}
            </li>
          ))}
          {more && <li className="flex">{more}</li>}
        </ul>
      )}
    </section>
  );
}
