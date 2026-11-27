/**
 * Fixtures break-ui (solo desarrollo). Misma forma que los datos reales del store.
 * Límites usados: nombre producto 120, nombre cliente 255, correo 254, teléfono 20 (ver formularios).
 */
const iso = (d) => new Date(2026, 10, d, 9, 30).toISOString();

const sale = (id, customerId, items, date) => {
  const subtotal = Math.round(items.reduce((a, i) => a + i.price * i.qty, 0) * 100) / 100;
  const iva = Math.round(subtotal * 0.15 * 100) / 100;
  return { id, date: iso(date), customerId, items, subtotal, discount: 0, iva, total: Math.round((subtotal + iva) * 100) / 100 };
};

const demo = () => {
  const products = [
    { id: 'p1', name: 'Teclado mecánico', price: 45.5, stock: 20 },
    { id: 'p2', name: 'Mouse inalámbrico', price: 18, stock: 35 },
    { id: 'p3', name: 'Monitor 24"', price: 159.99, stock: 8 },
  ];
  const customers = [
    { id: 'c1', name: 'María Fernández', email: 'maria.fernandez@example.com', phone: '0991234567' },
    { id: 'c2', name: 'Carlos Pérez', email: 'carlos@example.com', phone: '0987654321' },
  ];
  const sales = [
    sale('s1', 'c1', [{ productId: 'p1', price: 45.5, qty: 2 }], 20),
    sale('s2', 'c2', [{ productId: 'p3', price: 159.99, qty: 1 }, { productId: 'p2', price: 18, qty: 3 }], 21),
  ];
  return { products, customers, sales };
};

const worst = () => {
  const long120 =
    'Soporte articulado de pared para monitor de 32 pulgadas con brazo extensible y gestión de cables (versión reforzada)'.slice(0, 120);
  const products = [
    { id: 'p1', name: long120, price: 999999.99, stock: 1284 },
    { id: 'p2', name: 'Té', price: 0.05, stock: 0 },
    { id: 'p3', name: '🧪 Ñandú Ωmega 日本語 – Edición Especial Ångström', price: 1234567.89, stock: 1 },
    { id: 'p4', name: 'Cable HDMI 2.1 certificado ultra alta velocidad 8K 3 metros', price: 12.5, stock: 100000 },
  ];
  const customers = [
    {
      id: 'c1',
      name: 'Aleksandra Wiśniewska-Kowalczyk de la Concepción Fitzgerald Montgomery III',
      email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
      phone: '+593 99 123 4567 ext 12',
    },
    { id: 'c2', name: 'Jo', email: '', phone: '' },
    { id: 'c3', name: '李小龍', email: 'li.xiaolong.hongkong.cinema.archive.association@例え.テスト', phone: '0991234567' },
    { id: 'c4', name: '😀 Emoji Primero', email: 'a@b.co', phone: '' },
  ];
  const sales = [
    sale('s1', 'c1', [{ productId: 'p1', price: 999999.99, qty: 1000 }, { productId: 'p3', price: 1234567.89, qty: 1 }], 25),
    sale('s2', 'c2', [{ productId: 'p2', price: 0.05, qty: 1 }], 26),
    sale('s3', 'c3', [{ productId: 'p4', price: 12.5, qty: 99999 }], 26),
    sale('s4', 'borrado', [{ productId: 'inexistente', price: 10, qty: 1 }], 27),
  ];
  return { products, customers, sales };
};

const empty = () => ({ products: [], customers: [], sales: [] });

const one = () => {
  const d = demo();
  return { products: d.products.slice(0, 1), customers: d.customers.slice(0, 1), sales: d.sales.slice(0, 1) };
};

export const FIXTURES = { demo, worst, empty, one };
export const FIXTURE_LABELS = { demo: 'Demo', worst: 'Worst case', empty: 'Empty', one: 'One' };

/** Solo en desarrollo: lee ?data=worst. En producción siempre devuelve null. */
export function getFixtureName() {
  if (!import.meta.env.DEV) return null;
  const name = new URLSearchParams(window.location.search).get('data');
  return name && FIXTURES[name] ? name : null;
}
