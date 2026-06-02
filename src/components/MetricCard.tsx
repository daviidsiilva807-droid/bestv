interface MetricCardProps {
  label: string;
  value: string;
  note?: string;
}

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      {note ? <span className="metric-card__note">{note}</span> : null}
    </article>
  );
}