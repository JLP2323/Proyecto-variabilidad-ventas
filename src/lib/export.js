const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Evita inyección de fórmulas en Excel y escapa comillas CSV. */
const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function salesRows(sales, customers) {
  const name = (id) => customers.find((c) => c.id === id)?.name ?? 'Consumidor final';
  return sales.map((s) => [s.id, s.date, name(s.customerId), s.items.length, s.subtotal, s.discount ?? 0, s.iva, s.total]);
}

const HEADERS = ['ID', 'Fecha', 'Cliente', 'Líneas', 'Subtotal', 'Descuento', 'IVA', 'Total'];

export function salesToCsv(sales, customers) {
  return [HEADERS, ...salesRows(sales, customers)].map((r) => r.map(csvCell).join(',')).join('\r\n');
}

export function downloadCsv(sales, customers) {
  const blob = new Blob(['\ufeff' + salesToCsv(sales, customers)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'reporte-ventas.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

/** PDF vía diálogo de impresión del navegador ("Guardar como PDF"). */
export function printPdf(sales, customers) {
  const rows = salesRows(sales, customers)
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('');
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(
    `<html><head><title>Reporte de ventas</title><style>body{font-family:sans-serif}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px;font-size:12px;overflow-wrap:anywhere}</style></head><body><h1>Reporte de ventas</h1><table><thead><tr>${HEADERS.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></body></html>`
  );
  w.document.close();
  w.print();
}
