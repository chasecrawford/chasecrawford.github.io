import { WHOAMI_ROWS } from '../../../sample-data/whoami';
import type { KVRow } from '../../../types';
import styles from './KVList.module.css';

export interface KVListProps {
  rows?: KVRow[];
  className?: string;
}

export function KVList({ rows = WHOAMI_ROWS, className }: KVListProps = {}) {
  return (
    <div className={[styles.kv, className].filter(Boolean).join(' ')}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'contents' }}>
          <div className={styles.k}>{r.k}</div>
          <div className={styles.v}>{r.v}</div>
        </div>
      ))}
    </div>
  );
}
