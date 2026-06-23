import { useEffect, useRef } from 'react';
import styles from './DisconnectOverlay.module.css';

export interface DisconnectOverlayProps {
  open: boolean;
  onReconnect: () => void;
  className?: string;
}

export function DisconnectOverlay({ open, onReconnect, className }: DisconnectOverlayProps): JSX.Element | null {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    btnRef.current?.focus({ preventScroll: true });

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onReconnect();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onReconnect]);

  if (!open) return null;

  return (
    <div className={[styles.overlay, className].filter(Boolean).join(' ')}>
      <div className={styles.title}>CONNECTION TERMINATED</div>
      <div className={styles.msg}>
        session ended · <span className={styles.code}>[127.0.0.1]</span> closed by user
        <br />
        <span>
          press <span className={styles.code}>RECONNECT</span> to re-establish tty
        </span>
      </div>
      <button ref={btnRef} className={styles.btn} onClick={onReconnect}>
        RECONNECT &nbsp;[ENTER]
      </button>
    </div>
  );
}
