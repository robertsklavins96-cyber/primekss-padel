export function LoadingBlock({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="state-block" role="status">
      <div className="spinner" />
      <p>{label}…</p>
    </div>
  );
}

export function EmptyBlock({ eyebrow, message }: { eyebrow: string; message: string }) {
  return (
    <div className="state-block">
      <span className="eyebrow">{eyebrow}</span>
      <p>{message}</p>
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="state-block">
      <span className="eyebrow" style={{ color: 'var(--color-danger)' }}>Something went wrong</span>
      <p>{message}</p>
    </div>
  );
}
