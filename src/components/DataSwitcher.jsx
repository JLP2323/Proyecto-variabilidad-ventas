import { FIXTURE_LABELS, getFixtureName } from '../fixtures/index.js';

/** Selector de dataset: solo desarrollo, persistente en la URL (?data=). */
export default function DataSwitcher() {
  if (!import.meta.env.DEV) return null;
  const current = getFixtureName();

  const select = (name) => {
    const url = new URL(window.location.href);
    if (name) url.searchParams.set('data', name);
    else url.searchParams.delete('data');
    window.location.assign(url);
  };

  return (
    <div
      className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full bg-slate-300 p-1 text-xs shadow"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {[[null, 'Real'], ...Object.entries(FIXTURE_LABELS)].map(([key, label]) => (
        <button
          key={label}
          onClick={() => select(key)}
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 ${current === key ? 'bg-white font-medium' : 'text-slate-700'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
