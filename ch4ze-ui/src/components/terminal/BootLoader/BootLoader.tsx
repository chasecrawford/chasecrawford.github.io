import { useState, useEffect, useCallback, useRef } from 'react';
import { BOOT_LINES } from '../../../sample-data/boot';
import styles from './BootLoader.module.css';

export interface BootLine {
  t: string;
  cls: 'ok' | 'warn' | 'info' | 'dim';
  txt: string;
}

export interface BootLoaderProps {
  lines?: BootLine[];
  title?: string;
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
}

const STEP_INTERVAL_MS = 90;
const PCT_TICK_MS = 24;
const PCT_STEP = 2;

export function BootLoader({
  lines = BOOT_LINES,
  title = 'chasecrawford.dev // boot sequence',
  onComplete,
  autoStart = true,
  className,
}: BootLoaderProps = {}) {
  const [revealed, setRevealed] = useState(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  const pctRef = useRef(0);
  const revealedRef = useRef(0);
  const doneRef = useRef(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    setRevealed(lines.length);
    setPct(100);
    pctRef.current = 100;
    onComplete?.();
  }, [lines.length, onComplete]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  useEffect(() => {
    if (prefersReducedMotion) {
      finish();
      return;
    }

    if (!autoStart) return;

    let stepTimeout: ReturnType<typeof setTimeout>;
    let pctInterval: ReturnType<typeof setInterval> | null = null;

    function runStep() {
      if (doneRef.current) return;

      const nextRevealed = revealedRef.current + 1;
      revealedRef.current = nextRevealed;
      setRevealed(nextRevealed);

      const target = Math.floor((nextRevealed / lines.length) * 100);

      pctInterval = setInterval(() => {
        if (doneRef.current) {
          if (pctInterval) clearInterval(pctInterval);
          return;
        }
        const next = pctRef.current + PCT_STEP;
        if (next >= target) {
          pctRef.current = target;
          setPct(target);
          if (pctInterval) clearInterval(pctInterval);
          pctInterval = null;

          if (nextRevealed >= lines.length) {
            stepTimeout = setTimeout(finish, 350);
          } else {
            stepTimeout = setTimeout(runStep, STEP_INTERVAL_MS);
          }
        } else {
          pctRef.current = next;
          setPct(next);
        }
      }, PCT_TICK_MS);
    }

    stepTimeout = setTimeout(runStep, 200);

    return () => {
      clearTimeout(stepTimeout);
      if (pctInterval) clearInterval(pctInterval);
    };
  }, [autoStart, finish, lines.length, prefersReducedMotion]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !doneRef.current) {
        skip();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [skip]);

  const displayPct = done ? '100' : String(pct).padStart(3, '0');

  return (
    <div
      className={[styles.loader, done ? styles.gone : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.bootHead}>
        <span>{title}</span>
        <span>{new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}</span>
      </div>
      <div className={styles.bootLog}>
        {lines.slice(0, revealed).map((line, idx) => (
          <div key={idx} className={styles.line}>
            <span className={styles.ts}>{line.t}</span>
            <span className={styles[line.cls]}>{line.txt}</span>
          </div>
        ))}
      </div>
      <div className={styles.bootBottom}>
        <div className={styles.bootPct} data-testid="boot-pct">
          {displayPct}
        </div>
        <div className={styles.bootBar}>
          <i style={{ width: `${done ? 100 : pct}%` }} />
        </div>
        <button className={styles.skip} onClick={skip}>
          SKIP [esc]
        </button>
      </div>
    </div>
  );
}
