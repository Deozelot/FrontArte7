type Props = {
  query: string; onQuery: (q: string) => void; placeholder: string;
  select: { value: string; onChange: (v: string) => void; all: string; options: string[] };
  total: number; shown: number;
  toggle?: { checked: boolean; onChange: (c: boolean) => void; label: string };
};

// Client-side search + filter strip shared by the list pages.
export default function Toolbar({ query, onQuery, placeholder, select, total, shown, toggle }: Props) {
  return (
    <div className="toolbar rise" role="search">
      <label className="tb-search">
        <span className="mono">Buscar</span>
        <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder={placeholder} />
      </label>
      <label className="tb-select">
        <span className="mono">Filtrar</span>
        <select value={select.value} onChange={(e) => select.onChange(e.target.value)}>
          <option value="">{select.all}</option>
          {select.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
      {toggle && (
        <label className="tb-toggle mono">
          <input type="checkbox" checked={toggle.checked} onChange={(e) => toggle.onChange(e.target.checked)} />
          <span>{toggle.label}</span>
        </label>
      )}
      <p className="mono tb-count" aria-live="polite">{shown} / {total} fotogramas</p>
    </div>
  );
}
