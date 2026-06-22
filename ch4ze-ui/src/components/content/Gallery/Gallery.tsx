import styles from './Gallery.module.css';
import { GALLERY_FRAMES, GalleryFrame } from '../../../sample-data/gallery';

export interface GalleryProps {
  frames?: GalleryFrame[];
  className?: string;
}

export function Gallery({
  frames = GALLERY_FRAMES,
  className,
}: GalleryProps): JSX.Element {
  const classNames = [styles.gal, className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {frames.map((frame) => (
        <div
          key={frame.id}
          className={`${styles.gframe} ${styles.gframePhoto}`}
          style={{
            '--hue': frame.hue,
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,.70) 100%), url('${frame.src}')`,
          } as React.CSSProperties}
        >
          <div className={styles.gframeId}>{frame.id}</div>
          <div className={styles.gframeLabel}>{frame.label}</div>
          <div className={styles.scan}></div>
        </div>
      ))}
    </div>
  );
}
