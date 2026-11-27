import ProductsPage from '../pages/ProductsPage.jsx';
import CustomersPage from '../pages/CustomersPage.jsx';
import SalesPage from '../pages/SalesPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';
import { isFeatureEnabled } from '../lib/variants.js';

/**
 * Registro de módulos. Cada módulo declara la feature de variants.json que lo habilita.
 * La variante activa (VITE_APP_VARIANT) decide qué módulos existen, sin duplicar código.
 */
export const ALL_MODULES = [
  { id: 'sales', feature: 'sales', label: 'Ventas', component: SalesPage },
  { id: 'products', feature: 'products', label: 'Productos', component: ProductsPage },
  { id: 'customers', feature: 'customers', label: 'Clientes', component: CustomersPage },
  { id: 'reports', feature: 'reports', label: 'Reportes', component: ReportsPage },
];

export const getModules = (variant) => ALL_MODULES.filter((m) => isFeatureEnabled(m.feature, variant));
