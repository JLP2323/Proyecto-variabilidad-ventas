import { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { EmptyState, Field } from '../components/ui.jsx';
import { formatMoney, formatInt, pluralize } from '../lib/format.js';

const EMPTY = { name: '', price: '', stock: '' };

export default function ProductsPage() {
  const { products, addProduct, updateProduct, removeProduct } = useStore();
  const { user } = useAuth();
  const canEdit = user.role === 'admin';
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const data = { name: form.name.trim(), price: Number(form.price), stock: Math.floor(Number(form.stock)) };
    if (!data.name || !(data.price >= 0) || !(data.stock >= 0)) return;
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
      <h2 className="text-lg font-semibold">Productos <span className="text-sm font-normal text-slate-500">({pluralize(products.length, 'producto', 'productos')})</span></h2>

      {canEdit ? (
        <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <Field label="Nombre"><input className="input" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Precio"><input className="input num" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
          <Field label="Stock"><input className="input num" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></Field>
          <button className="btn-primary">{editing ? 'Guardar' : 'Agregar'}</button>
        </form>
      ) : (
        <p className="text-sm text-slate-500">Solo el rol admin puede modificar productos.</p>
      )}

      {products.length === 0 ? (
        <EmptyState title="No hay productos" hint="Agrega el primero para comenzar a vender." />
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="safe-text font-medium">{p.name}</p>
                <p className="text-sm text-slate-500">
                  <span className="num">{formatMoney(p.price)}</span> · Stock:{' '}
                  <span className={`num ${p.stock === 0 ? 'text-red-600' : ''}`}>{formatInt(p.stock)}</span>
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
        </ul>
      )}
    </section>
  );
}
