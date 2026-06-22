import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedList } from './FeedList';

describe('FeedList', () => {
  it('renders default heading "Live on Bluesky"', () => {
    render(<FeedList />);
    expect(screen.getByText('Live on Bluesky')).toBeInTheDocument();
  });

  it('renders default badge "3 FEEDS"', () => {
    render(<FeedList />);
    expect(screen.getByText('3 FEEDS')).toBeInTheDocument();
  });

  it('renders Louisville Football feed from default FEEDS', () => {
    render(<FeedList />);
    expect(screen.getByText('Louisville Football')).toBeInTheDocument();
  });

  it('renders each feed as an <a> element with href', () => {
    render(<FeedList />);
    const feedLinks = screen.getAllByRole('link');
    expect(feedLinks.length).toBeGreaterThanOrEqual(3);
    const footballLink = feedLinks.find(
      (link) => link.textContent?.includes('Louisville Football')
    );
    expect(footballLink).toHaveAttribute('href', 'https://bsky.app/profile/chasecrawford.dev/feed/aaaps4w6ssniy');
  });

  it('renders feed descriptions', () => {
    render(<FeedList />);
    expect(screen.getByText('UofL football — players, coaches, opponents, venue.')).toBeInTheDocument();
  });

  it('accepts custom heading prop', () => {
    render(<FeedList heading="Custom Feeds" />);
    expect(screen.getByText('Custom Feeds')).toBeInTheDocument();
  });

  it('accepts custom badge prop', () => {
    render(<FeedList badge="5 FEEDS" />);
    expect(screen.getByText('5 FEEDS')).toBeInTheDocument();
  });

  it('accepts custom feeds prop', () => {
    const customFeeds = [
      {
        name: 'Test Feed',
        description: 'Test description',
        href: 'https://example.com',
      },
    ];
    render(<FeedList feeds={customFeeds} />);
    expect(screen.getByText('Test Feed')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
