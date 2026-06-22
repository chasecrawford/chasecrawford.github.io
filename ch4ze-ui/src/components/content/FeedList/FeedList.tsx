import styles from './FeedList.module.css';
import { FEEDS, type Feed } from '../../../sample-data/feeds';

export interface FeedListProps {
  heading?: string;
  badge?: string;
  feeds?: Feed[];
  className?: string;
}

export function FeedList({
  heading = 'Live on Bluesky',
  badge = '3 FEEDS',
  feeds = FEEDS,
  className,
}: FeedListProps = {}): JSX.Element {
  const classNames = [styles.projFeeds, className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className={styles.feedsHead}>
        <span className={styles.id}>{heading}</span>
        <span>{badge}</span>
      </div>
      {feeds.map((feed, idx) => (
        <a
          key={idx}
          className={styles.feedLink}
          href={feed.href}
          target="_blank"
          rel="noopener"
        >
          <div className={styles.feedMeta}>
            <div className={styles.feedName}>{feed.name}</div>
            <div className={styles.feedDesc}>{feed.description}</div>
          </div>
          <span className={styles.feedGo}>→</span>
        </a>
      ))}
    </div>
  );
}
