import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { getModules } from './modules/registry.js';
import { getVariant } from './lib/variants.js';
import LoginPage from './pages/LoginPage.jsx';
import DataSwitcher from './components/DataSwitcher.jsx';
import { Icon } from './components/ui.jsx';

const ICONS = { sales: 'cart', products: 'box', customers: 'users', reports: 'chart' };

export default function App() {
  const { user, logout } = useAuth();
  const modules = getModules();
  const [active, setActive] = useState(modules[0].id);
  const variant = getVariant();

  if (!user) return <><LoginPage /><DataSwitcher /></>;
  const Current = (modules.find((m) => m.id === active) ?? modules[0]).component;

  return (
    <div className="min-h-screen pb-20">
      <DataSwitcher />
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
          <h1 className="flex min-w-0 flex-1 items-center gap-2 text-lg font-semibold">
            <Icon name="cart" className="h-6 w-6" />
            <span className="truncate" title="Sistema de Ventas">Sistema de Ventas</span>
            <span className={`badge ${variant === 'premium' ? 'bg-amber-300 text-amber-900' : 'bg-white/20 text-white'}`}>
              {variant === 'premium' ? 'Premium' : 'Básica'}
            </span>
          </h1>
          <span className="safe-text flex items-center gap-1.5 text-sm text-indigo-100">
            <Icon name="user" className="h-4 w-4" /> {user.name}
            <span className="badge bg-white/15 uppercase">{user.role}</span>
          </span>
          <button className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={logout}>
            <Icon name="logout" className="h-4 w-4" /> Salir
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                m.id === active ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <Icon name={ICONS[m.id]} className="h-4 w-4" /> {m.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Current />
      </main>
    </div>
  );
}
