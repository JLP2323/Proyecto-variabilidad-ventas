import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Field, Icon } from '../components/ui.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!login(username.trim(), password)) setError('Usuario o contraseña incorrectos');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-4">
      <form onSubmit={submit} className="w-full min-w-0 max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="text-center">
          <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Icon name="cart" className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-semibold">Sistema de Ventas</h1>
          <p className="text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>
        <Field label="Usuario">
          <input className="input" value={username} maxLength={50} autoComplete="username" onChange={(e) => setUsername(e.target.value)} />
        </Field>
        <Field label="Contraseña">
          <input className="input" type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="safe-text rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Entrar</button>
        <p className="safe-text rounded-lg bg-slate-50 p-2 text-center text-xs text-slate-500">
          Demo: <b>admin</b> / admin123 · <b>vendedor</b> / venta123
        </p>
      </form>
    </div>
  );
}
