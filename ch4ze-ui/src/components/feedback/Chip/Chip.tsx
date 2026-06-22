import type { Tone } from '../../../types';
import styles from './Chip.module.css';

export interface ChipProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function Chip({ children, tone = 'ink', className }: ChipProps) {
  return (
    <span className={[styles.chip, styles[tone], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
