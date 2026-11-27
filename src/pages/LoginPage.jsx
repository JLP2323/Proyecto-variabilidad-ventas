import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Field } from '../components/ui.jsx';

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="card w-full min-w-0 max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <Field label="Usuario">
          <input className="input" value={username} maxLength={50} onChange={(e) => setUsername(e.target.value)} />
        </Field>
        <Field label="Contraseña">
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="safe-text text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Entrar</button>
        <p className="safe-text text-xs text-slate-500">
          Demo: admin / admin123 · vendedor / venta123
        </p>
      </form>
    </div>
  );
}
