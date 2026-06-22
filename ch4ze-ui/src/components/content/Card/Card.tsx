import styles from './Card.module.css';

export interface CardThesis {
  label?: string;
  body: React.ReactNode;
}

export interface CardProps {
  id: string;
  badge?: string;
  name: string;
  href?: string;
  description: React.ReactNode;
  stack?: string[];
  stats?: React.ReactNode[];
  thesis?: CardThesis;
  className?: string;
}

export function Card({
  id,
  badge,
  name,
  href,
  description,
  stack,
  stats,
  thesis,
  className,
}: CardProps): JSX.Element {
  const classNames = [styles.proj, styles.projDetail, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <div className={styles.projHead}>
        <span className={styles.id}>{id}</span>
        {badge && <span>{badge}</span>}
      </div>
      <div className={styles.projName}>
        <span className={styles.nm}>{name}</span>
        <span className={styles.projGo}>→</span>
      </div>
      <div className={styles.projDesc}>{description}</div>
      {stack && (
        <div className={styles.projStack}>
          {stack.map((tag, idx) => (
            <span key={idx}>{tag}</span>
          ))}
        </div>
      )}
      {stats && (
        <div className={styles.projStats}>
          {stats.map((stat, idx) => (
            <div key={idx}>{stat}</div>
          ))}
        </div>
      )}
      {thesis && (
        <div className={styles.projThesis}>
          <div className={styles.thesisLabel}>{thesis.label ?? 'Goal'}</div>
          {thesis.body}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a className={classNames} href={href} target="_blank" rel="noopener">
        {content}
      </a>
    );
  }

  return <div className={classNames}>{content}</div>;
}
