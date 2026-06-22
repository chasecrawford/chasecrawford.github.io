import styles from './TitleBar.module.css';

export interface TitleBarProps {
  title?: string;
  status?: React.ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  showControls?: boolean;
  className?: string;
}

export function TitleBar({
  title = 'chase@louisville · Windows PowerShell',
  status = <span style={{ color: 'var(--green)' }}>● LIVE</span>,
  onMinimize,
  onMaximize,
  onClose,
  showControls = true,
  className,
}: TitleBarProps) {
  return (
    <div className={[styles.titlebar, className].filter(Boolean).join(' ')}>
      <div className={styles.tbLeft}>{status}</div>
      <div className={styles.tbCenter}>{title}</div>
      {showControls && (
        <div className={styles.wcontrols}>
          <button
            type="button"
            className={styles.wctl}
            onClick={onMinimize}
            aria-label="Minimize"
          >
            &#xFF3F;
          </button>
          <button
            type="button"
            className={styles.wctl}
            onClick={onMaximize}
            aria-label="Maximize"
          >
            &#x25A1;
          </button>
          <button
            type="button"
            className={[styles.wctl, styles.close].filter(Boolean).join(' ')}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
