import { BANNER_FULL, BANNER_SMALL } from '../../../sample-data/banner';
import styles from './Banner.module.css';

export interface BannerProps {
  art?: string;
  artSmall?: string;
  subtitle?: React.ReactNode;
  className?: string;
}

export function Banner({
  art = BANNER_FULL,
  artSmall = BANNER_SMALL,
  subtitle,
  className,
}: BannerProps = {}) {
  return (
    <div className={className}>
      <pre className={styles.banner}>{art}</pre>
      <pre className={styles.bannerSm}>{artSmall}</pre>
      {subtitle != null && <div className={styles.bannerSub}>{subtitle}</div>}
    </div>
  );
}
