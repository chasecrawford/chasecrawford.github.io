import { useState, useEffect } from 'react';
import styles from './StatusBar.module.css';

export interface StatusBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  showClock?: boolean;
  className?: string;
}

export function StatusBar({
  left = 'NORMAL · UTF-8 · LF · READY',
  center,
  showClock = true,
  className,
}: StatusBarProps) {
  const [time, setTime] = useState<string>('00:00:00');

  useEffect(() => {
    const formatTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };

    setTime(formatTime());
    const interval = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const defaultCenter = `© ${new Date().getFullYear()} CHASE CRAWFORD`;
  const displayCenter = center ?? defaultCenter;

  return (
    <div
      className={[styles.statusbar, className].filter(Boolean).join(' ')}
      data-window-region="collapsible"
    >
      <div>{left}</div>
      <div>{displayCenter}</div>
      {showClock && (
        <div>
          LOUISVILLE, KY ·{' '}
          <span className={styles.g} data-testid="statusbar-clock">
            {time}
          </span>
        </div>
      )}
    </div>
  );
}
