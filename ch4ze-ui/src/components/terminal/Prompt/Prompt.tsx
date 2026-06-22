import styles from './Prompt.module.css';

export interface PromptProps {
  user?: string;
  host?: string;
  path?: string;
  command: string;
  flags?: string;
  className?: string;
}

export function Prompt({
  user = 'chase',
  host = 'louisville',
  path = '~',
  command,
  flags,
  className,
}: PromptProps) {
  return (
    <div className={[styles.cmd, className].filter(Boolean).join(' ')}>
      <span className={styles.cmdPre}>
        <span className={styles.user}>{user}</span>
        <span className={styles.at}>@</span>
        <span className={styles.host}>{host}</span>
        <span className={styles.sep}>:</span>
        <span className={styles.path}>{path}</span>
      </span>
      <span className={styles.arrow}>❯</span>
      <span className={styles.c}>
        {command}
        {flags ? (
          <>
            {' '}
            <span className={styles.flag}>{flags}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
