import { createContext, useContext, useEffect, useState } from 'react';
import { load, save } from '../lib/storage.js';
import { applyStockDiscount, calculateTotals } from '../lib/sales.js';
import { FIXTURES, getFixtureName } from '../fixtures/index.js';

const StoreContext = createContext(null);

const SEED_PRODUCTS = [
  { id: 'p1', name: 'Teclado mecánico', price: 45.5, stock: 20 },
  { id: 'p2', name: 'Mouse inalámbrico', price: 18, stock: 35 },
  { id: 'p3', name: 'Monitor 24"', price: 159.99, stock: 8 },
];
const SEED_CUSTOMERS = [
  { id: 'c1', name: 'María Fernández', email: 'maria.fernandez@example.com', phone: '0991234567' },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }) {
  // Solo en desarrollo: ?data=worst|empty|one|demo reemplaza los datos en el borde del store
  // (sin tocar localStorage, para no contaminar los datos reales).
  const fixtureName = getFixtureName();
  const fx = fixtureName ? FIXTURES[fixtureName]() : null;

  const [products, setProducts] = useState(() => fx?.products ?? load('ventas.products', SEED_PRODUCTS));
  const [customers, setCustomers] = useState(() => fx?.customers ?? load('ventas.customers', SEED_CUSTOMERS));
  const [sales, setSales] = useState(() => fx?.sales ?? load('ventas.sales', []));

  useEffect(() => { if (!fx) save('ventas.products', products); }, [products]);
  useEffect(() => { if (!fx) save('ventas.customers', customers); }, [customers]);
  useEffect(() => { if (!fx) save('ventas.sales', sales); }, [sales]);

  const addProduct = (p) => setProducts((l) => [...l, { ...p, id: uid() }]);
  const updateProduct = (id, patch) =>
    setProducts((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removeProduct = (id) => setProducts((l) => l.filter((p) => p.id !== id));

  const addCustomer = (c) => setCustomers((l) => [...l, { ...c, id: uid() }]);

  /** Confirma una venta: valida y descuenta stock. Lanza Error si falla. */
  const confirmSale = ({ customerId, items, options }) => {
    if (!items.length) throw new Error('La venta no tiene productos');
    const nextProducts = applyStockDiscount(products, items);
    const totals = calculateTotals(items, options);
    setProducts(nextProducts);
    const sale = { id: uid(), date: new Date().toISOString(), customerId, items, ...totals };
    setSales((l) => [sale, ...l]);
    return sale;
  };

  return (
    <StoreContext.Provider
      value={{ products, customers, sales, addProduct, updateProduct, removeProduct, addCustomer, confirmSale }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
