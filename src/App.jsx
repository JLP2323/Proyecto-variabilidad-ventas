import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { getModules } from './modules/registry.js';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  const { user, logout } = useAuth();
  const modules = getModules();
  const [active, setActive] = useState(modules[0].id);

  if (!user) return <LoginPage />;
  const Current = (modules.find((m) => m.id === active) ?? modules[0]).component;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold" title="Sistema de Ventas">
            Sistema de Ventas
          </h1>
          <span className="safe-text text-sm text-slate-600">
            {user.name} · <span className="uppercase">{user.role}</span>
          </span>
          <button className="btn-ghost" onClick={logout}>Salir</button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm ${
                m.id === active ? 'border-indigo-600 font-medium text-indigo-700' : 'border-transparent text-slate-600'
              }`}
            >
              {m.label}
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
