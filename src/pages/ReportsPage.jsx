import { useStore } from '../context/StoreContext.jsx';
import { EmptyState, Icon, PageTitle } from '../components/ui.jsx';
import { formatMoney, pluralize } from '../lib/format.js';
import { isFeatureEnabled } from '../lib/variants.js';
import { downloadCsv, printPdf } from '../lib/export.js';

function Kpi({ label, value }) {
  return (
    <div className="card min-w-0 border-l-4 border-l-indigo-500">
      <p className="safe-text text-sm text-slate-500">{label}</p>
      <p className="num text-lg font-semibold md:text-xl">{value}</p>
    </div>
  );
}

export default function ReportsPage() {
  const { sales, products, customers } = useStore();
  const canExport = isFeatureEnabled('export');

  const revenue = sales.reduce((a, s) => a + (s.total || 0), 0);
  const average = sales.length ? revenue / sales.length : 0;

  const byProduct = new Map();
  for (const s of sales) {
    for (const i of s.items) {
      byProduct.set(i.productId, (byProduct.get(i.productId) ?? 0) + i.qty * i.price);
    }
  }
  const top = [...byProduct.entries()]
    .map(([id, amount]) => ({ id, amount, name: products.find((p) => p.id === id)?.name ?? '—' }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const max = top[0]?.amount || 1;

  return (
    <section className="space-y-4">
      <PageTitle icon="chart" title="Reportes estadísticos" count="Solo variante Premium">
        {canExport && (
          <div className="flex shrink-0 gap-2">
            <button className="btn-ghost" disabled={!sales.length} onClick={() => downloadCsv(sales, customers)}><Icon name="download" className="h-4 w-4" />CSV</button>
            <button className="btn-ghost" disabled={!sales.length} onClick={() => printPdf(sales, customers)}><Icon name="download" className="h-4 w-4" />PDF</button>
          </div>
        )}
      </PageTitle>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Kpi label="Ingresos totales" value={formatMoney(revenue)} />
        <Kpi label="Ventas" value={pluralize(sales.length, 'venta', 'ventas')} />
        <Kpi label="Ticket promedio" value={formatMoney(average)} />
      </div>

      <h3 className="font-semibold">Productos más vendidos</h3>
      {top.length === 0 ? (
        <EmptyState icon="chart" title="Sin datos para graficar" hint="Registra ventas para ver estadísticas." />
      ) : (
        <ul className="card space-y-3">
          {top.map((t) => (
            <li key={t.id} className="min-w-0">
              <div className="flex items-start gap-3 text-sm">
                <span className="safe-text min-w-0 flex-1">{t.name}</span>
                <span className="num shrink-0 font-medium">{formatMoney(t.amount)}</span>
              </div>
              <div className="mt-1 h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${Math.max(2, (t.amount / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
