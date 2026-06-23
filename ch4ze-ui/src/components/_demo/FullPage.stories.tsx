/**
 * FullPage.stories.tsx
 *
 * Composed fidelity reference — assembles the ch4ze-ui components into the
 * full chasecrawford.dev layout, 1:1 with the live site (index.html). This is
 * NOT an assertion test; it is a Storybook visual proof that the real parts,
 * with their real default content, reproduce the site.
 */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Shell } from '../shell/Shell/Shell';
import { Window, WindowBody } from '../shell/Window/Window';
import { TitleBar } from '../shell/TitleBar/TitleBar';
import { StatusBar } from '../shell/StatusBar/StatusBar';
import { Banner } from '../terminal/Banner/Banner';
import { Prompt } from '../terminal/Prompt/Prompt';
import { Output } from '../terminal/Output/Output';
import { Caret } from '../terminal/Caret/Caret';
import { Ticker } from '../feedback/Ticker/Ticker';
import { KVList } from '../content/KVList/KVList';
import { Card } from '../content/Card/Card';
import { EquityChart } from '../feature/EquityChart/EquityChart';
import { Magic8Ball } from '../feature/Magic8Ball/Magic8Ball';
import { ExperienceTable } from '../content/ExperienceTable/ExperienceTable';
import { Gallery } from '../content/Gallery/Gallery';
import { ContactLinks } from '../content/ContactLinks/ContactLinks';
import { FeedList } from '../content/FeedList/FeedList';
import { DisconnectOverlay } from '../feature/DisconnectOverlay/DisconnectOverlay';
import { BOT_TRADER, FEEDS_BY_CHASE } from '../../sample-data/projects';

/* Ticker phrases — verbatim from the live site (the component inserts the
   `//` separators between items). */
const TICKER_ITEMS = [
  'LEAD BACKEND DEVELOPER • HATFIELD MEDIA • LOUISVILLE KY',
  'CUSTOM SOLUTIONS IN PHP SINCE 2008',
  'WANNABE INDIE GAME DEV',
  'REAL HUMAN',
];

/* Demo-only layout that mirrors index.html's `.hero-split` and `.projects`
   grid (these live in the page, not in any single component). */
const LAYOUT_CSS = `
.demo-hero { display: flex; gap: 16px; align-items: flex-start; }
.demo-hero-left { flex: 1; min-width: 0; }
.demo-hero-right { flex: 1; min-width: 0; padding-top: 28px; }
@media (max-width: 1400px) { .demo-hero { flex-direction: column; } }
.demo-projects { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 12px 0 16px; }
@media (max-width: 860px) { .demo-projects { grid-template-columns: 1fr; } }
`;

function FullPageDemo() {
  const [disconnected, setDisconnected] = useState(false);

  return (
    <Shell>
      <style>{LAYOUT_CSS}</style>

      {/* Close (×) in the title bar shows the disconnect overlay — exactly as
          the live site behaves. */}
      <DisconnectOverlay open={disconnected} onReconnect={() => setDisconnected(false)} />

      <Window>
        <TitleBar
          title="chase@louisville · Windows PowerShell"
          status={<span style={{ color: 'var(--green)' }}>● LIVE</span>}
          onClose={() => setDisconnected(true)}
        />

        <Ticker items={TICKER_ITEMS} durationSec={50} />

        <WindowBody>
          <Banner
            subtitle={
              <>
                // personal site v3.0 — lead backend developer @ hatfield media, louisville ky —{' '}
                <span style={{ color: 'var(--green)' }}>● online</span>
              </>
            }
          />

          {/* hero: whoami (left) · ASCII 8-ball (right) */}
          <div className="demo-hero">
            <div className="demo-hero-left">
              <Prompt command="whoami" flags="--verbose" />
              <KVList />
            </div>
            <div className="demo-hero-right">
              <Magic8Ball />
            </div>
          </div>

          {/* projects: bot-trader · equity chart · feeds-by-chase · live feeds */}
          <Prompt path="~/projects" command="ls" flags="--long --featured" />
          <Output dim>total 2 · open source</Output>
          <div className="demo-projects">
            <Card {...BOT_TRADER} />
            <EquityChart defaultDays={30} />
            <Card {...FEEDS_BY_CHASE} />
            <FeedList />
          </div>

          {/* experience */}
          <Prompt command="cat experience.log" flags="| sort -r" />
          <ExperienceTable />

          {/* gallery */}
          <Prompt path="~/photos" command="open" flags="--grid=4 *.jpg" />
          <Output dim>4 frames</Output>
          <Gallery />

          {/* contact */}
          <Prompt command="contact" flags="--all" />
          <Output dim>7 endpoints · 1 asset · reply time ~24h</Output>
          <ContactLinks />

          {/* final typed prompt */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '28px 0 8px' }}>
            <Prompt command="contact --provider=bs" />
            <Caret />
          </div>
        </WindowBody>

        <StatusBar left="NORMAL · UTF-8 · LF · READY" showClock />
      </Window>
    </Shell>
  );
}

const meta = {
  title: '_demo/FullPage',
  component: FullPageDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FullPageDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
