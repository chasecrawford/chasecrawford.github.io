import styles from './Output.module.css';

export interface OutputProps {
  children: React.ReactNode;
  dim?: boolean;
  as?: 'div' | 'pre';
  className?: string;
}

export function Output({ children, dim, as = 'div', className }: OutputProps) {
  const Tag = as;
  return <Tag className={[styles.out, dim && styles.dim, as === 'pre' && styles.pre, className].filter(Boolean).join(' ')}>{children}</Tag>;
}

export interface OutTokenProps {
  tone: 'success' | 'warn' | 'info' | 'key';
  children: React.ReactNode;
}

export function OutToken({ tone, children }: OutTokenProps) {
  return <span className={styles[tone]}>{children}</span>;
}
