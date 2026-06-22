import styles from './Ticker.module.css';

export interface TickerProps {
  items: React.ReactNode[];
  durationSec?: number;
  className?: string;
}

function Group({ items, hidden }: { items: React.ReactNode[]; hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.flatMap((it, i) => [
        <span key={`i${i}`}>{it}</span>,
        <span key={`s${i}`}>//</span>,
      ])}
    </div>
  );
}

export function Ticker({ items, durationSec = 50, className }: TickerProps) {
  return (
    <div className={[styles.ticker, className].filter(Boolean).join(' ')}>
      <div className={styles.track} style={{ '--tk-dur': `${durationSec}s` } as React.CSSProperties}>
        <Group items={items} />
        <Group items={items} hidden />
      </div>
    </div>
  );
}
