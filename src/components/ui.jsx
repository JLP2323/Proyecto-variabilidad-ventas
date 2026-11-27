import { useState } from 'react';
import { initials } from '../lib/format.js';

const PATHS = {
  box: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  cart: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  logout: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  plus: 'M12 4.5v15m7.5-7.5h-15',
};

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[name]} />
    </svg>
  );
}

export function EmptyState({ title, hint, icon = 'box' }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
      <span className="mb-2 rounded-full bg-indigo-50 p-3 text-indigo-500"><Icon name={icon} className="h-6 w-6" /></span>
      <p className="safe-text font-medium text-slate-700">{title}</p>
      {hint && <p className="safe-text mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1 block font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export function PageTitle({ icon, title, count, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><Icon name={icon} /></span>
      <div className="min-w-0 flex-1">
        <h2 className="safe-text text-lg font-semibold leading-tight">{title}</h2>
        {count && <p className="text-sm text-slate-500">{count}</p>}
      </div>
      {children}
    </div>
  );
}

export function Avatar({ name }) {
  const text = initials(name);
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
      {text || <Icon name="user" className="h-5 w-5" />}
    </span>
  );
}

/** Listas largas: muestra de a `size` elementos (evita renderizar miles de filas). */
export function usePaged(list, size = 25) {
  const [limit, setLimit] = useState(size);
  const visible = list.slice(0, limit);
  const remaining = list.length - visible.length;
  const more = remaining > 0 && (
    <button className="btn-ghost mx-auto" onClick={() => setLimit((l) => l + size)}>
      Mostrar más ({remaining} restantes)
    </button>
  );
  return [visible, more];
}
