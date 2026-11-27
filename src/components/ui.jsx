export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
      <p className="safe-text font-medium text-slate-700">{title}</p>
      {hint && <p className="safe-text mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      {children}
    </label>
  );
}
