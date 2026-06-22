import { EXPERIENCE_ROWS, type ExperienceRow } from '../../../sample-data/experience';
import styles from './ExperienceTable.module.css';

export interface ExperienceTableProps {
  rows?: ExperienceRow[] | undefined;
  className?: string | undefined;
}

export function ExperienceTable({
  rows = EXPERIENCE_ROWS,
  className,
}: ExperienceTableProps): JSX.Element {
  const tableClasses = [styles.table, className].filter(Boolean).join(' ');

  return (
    <table className={tableClasses}>
      <thead>
        <tr>
          <th>DATES</th>
          <th>ROLE</th>
          <th>NOTES</th>
          <th>STATUS</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.dates}</td>
            <td>
              <span className={styles.role}>{row.role}</span>
              <span className={styles.company}>
                {row.companyHref ? (
                  <a href={row.companyHref} target="_blank" rel="noopener">
                    {row.company}
                  </a>
                ) : (
                  row.company
                )}
              </span>
            </td>
            <td className={styles.notes}>{row.notes}</td>
            <td
              className={`${styles.status} ${
                row.status === 'closed' ? styles.closed : ''
              }`}
            >
              {row.status === 'current' ? '● CURRENT' : 'CLOSED'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
