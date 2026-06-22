import styles from './Window.module.css';

export interface WindowProps {
  children: React.ReactNode;
  minimized?: boolean;
  className?: string;
}

export function Window({ children, minimized, className }: WindowProps) {
  return <div className={[styles.window, minimized && styles.minimized, className].filter(Boolean).join(' ')}>{children}</div>;
}

export interface WindowBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function WindowBody({ children, className }: WindowBodyProps) {
  return <div data-window-region="collapsible" className={[styles.body, className].filter(Boolean).join(' ')}>{children}</div>;
}
