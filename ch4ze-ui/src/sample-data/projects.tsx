import type { CardProps } from '../components/content/Card';

export const BOT_TRADER: CardProps = {
  id: '001',
  badge: 'OSS',
  name: 'bot-trader',
  href: 'https://github.com/chasecrawford/bot-trader',
  description:
    'Two-sleeve systematic momentum trader for Alpaca paper trading. Dual Momentum (Antonacci GEM) on broad ETFs alongside an EMA trend-state strategy across a curated 234-name equity universe. Documented for educational use.',
  stack: ['PYTHON', 'REST API', 'SQLITE', 'ALPACA', 'YFINANCE'],
  stats: [
    'paper-api.alpaca.markets',
    'github.com/chasecrawford/bot-trader',
  ],
  thesis: {
    label: 'Goal',
    body: (
      <>
        Beat SPY total-return over full market cycles, not in any single year. 19‐year backtest:{' '}
        <b>+768%</b> vs SPY's <b style={{ color: 'var(--cyan)' }}>+615%</b>, drawdown <b>34%</b> vs SPY's{' '}
        <b style={{ color: 'var(--cyan)' }}>56%</b>.
      </>
    ),
  },
};

export const FEEDS_BY_CHASE: CardProps = {
  id: '002',
  badge: 'OSS',
  name: 'feeds-by-chase',
  href: 'https://github.com/chasecrawford/feeds-by-chase',
  description:
    'Self-hosted Bluesky keyword feed generator. Streams the network firehose via Jetstream, matches posts against per-feed include/exclude rules in SQLite, and serves them through getFeedSkeleton — a self-owned replacement for SkyFeed-style builders.',
  stack: ['TYPESCRIPT', 'AT PROTOCOL', 'JETSTREAM', 'SQLITE', 'CADDY'],
  stats: [
    'feeds.chasecrawford.dev',
    'github.com/chasecrawford/feeds-by-chase',
  ],
  thesis: {
    label: 'Goal',
    body: 'Own the feed-building stack end‐to‐end — keyword feeds keep running on my own domain and hardware, independent of any third‐party builder\'s uptime or roadmap.',
  },
};
