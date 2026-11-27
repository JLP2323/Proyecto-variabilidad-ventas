import { createContext, useContext, useState } from 'react';
import { load, save } from '../lib/storage.js';

// Usuarios simulados con roles
export const USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
  { username: 'vendedor', password: 'venta123', name: 'Vendedor', role: 'vendedor' },
];

const AuthContext = createContext(null);
const KEY = 'ventas.session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load(KEY, null));

  const login = (username, password) => {
    const found = USERS.find((u) => u.username === username && u.password === password);
    if (!found) return false;
    const session = { username: found.username, name: found.name, role: found.role };
    save(KEY, session);
    setUser(session);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
