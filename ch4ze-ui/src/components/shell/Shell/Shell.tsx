import styles from './Shell.module.css';

export interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className }: ShellProps) {
  return <div className={[styles.shell, className].filter(Boolean).join(' ')}>{children}</div>;
}
