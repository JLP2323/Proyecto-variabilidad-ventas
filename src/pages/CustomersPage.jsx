import { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { Avatar, EmptyState, Field, Icon, PageTitle, usePaged } from '../components/ui.jsx';
import { pluralize } from '../lib/format.js';

const EMPTY = { name: '', email: '', phone: '' };

export default function CustomersPage() {
  const { customers, addCustomer } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [visible, more] = usePaged(customers);

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    addCustomer({ name, email: form.email.trim(), phone: form.phone.trim() });
    setForm(EMPTY);
  };

  return (
    <section className="space-y-4">
      <PageTitle icon="users" title="Clientes" count={pluralize(customers.length, 'cliente', 'clientes')} />

      <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end">
        <Field label="Nombre"><input className="input" maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Correo"><input className="input" type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Teléfono"><input className="input num" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <button className="btn-primary"><Icon name="plus" className="h-4 w-4" />Registrar</button>
      </form>

      {customers.length === 0 ? (
        <EmptyState icon="users" title="No hay clientes registrados" hint="Registra un cliente para asociarlo a una venta." />
      ) : (
        <ul className="space-y-2">
          {visible.map((c) => (
            <li key={c.id} className="card flex items-start gap-3">
              <Avatar name={c.name} />
              <div className="min-w-0 flex-1">
                <p className="safe-text font-medium">{c.name}</p>
                {c.email && <p className="safe-text text-sm text-slate-500">{c.email}</p>}
                {c.phone && <p className="safe-text num text-sm text-slate-500">{c.phone}</p>}
              </div>
            </li>
          ))}
          {more && <li className="flex">{more}</li>}
        </ul>
      )}
    </section>
  );
}
