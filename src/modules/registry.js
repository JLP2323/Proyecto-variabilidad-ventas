import ProductsPage from '../pages/ProductsPage.jsx';
import CustomersPage from '../pages/CustomersPage.jsx';
import SalesPage from '../pages/SalesPage.jsx';

/**
 * Registro de módulos. Core = siempre presentes.
 * Fase 5 añadirá módulos opcionales (reportes, descuentos, exportación)
 * filtrados por src/config/variants.json, sin tocar los componentes Core.
 */
export const CORE_MODULES = [
  { id: 'sales', label: 'Ventas', component: SalesPage },
  { id: 'products', label: 'Productos', component: ProductsPage },
  { id: 'customers', label: 'Clientes', component: CustomersPage },
];

export const getModules = () => CORE_MODULES;
