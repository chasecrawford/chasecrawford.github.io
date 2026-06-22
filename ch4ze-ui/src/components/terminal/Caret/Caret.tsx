import styles from './Caret.module.css';

export interface CaretProps {
  className?: string;
}

export function Caret({ className }: CaretProps = {}) {
  return <span aria-hidden="true" className={[styles.caret, className].filter(Boolean).join(' ')} />;
}
