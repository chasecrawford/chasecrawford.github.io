/**
 * FullPage.stories.tsx
 *
 * Composed fidelity reference — assembles all major ch4ze-ui components into
 * the full chasecrawford.dev layout. This is NOT an assertion test; it exists
 * purely as a Storybook visual proof that the parts compose correctly.
 */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Shell } from '../shell/Shell/Shell';
import { Window, WindowBody } from '../shell/Window/Window';
import { TitleBar } from '../shell/TitleBar/TitleBar';
import { StatusBar } from '../shell/StatusBar/StatusBar';
import { Banner } from '../terminal/Banner/Banner';
import { Prompt } from '../terminal/Prompt/Prompt';
import { BootLoader } from '../terminal/BootLoader/BootLoader';
import { Ticker } from '../feedback/Ticker/Ticker';
import { KVList } from '../content/KVList/KVList';
import { Card } from '../content/Card/Card';
import { EquityChart } from '../feature/EquityChart/EquityChart';
import { ExperienceTable } from '../content/ExperienceTable/ExperienceTable';
import { Gallery } from '../content/Gallery/Gallery';
import { ContactLinks } from '../content/ContactLinks/ContactLinks';
import { FeedList } from '../content/FeedList/FeedList';
import { DisconnectOverlay } from '../feature/DisconnectOverlay/DisconnectOverlay';
import { Button } from '../feedback/Button/Button';

/* ------------------------------------------------------------------ */
/* Ticker items — mirrors the live site                                 */
/* ------------------------------------------------------------------ */
const TICKER_ITEMS = [
  'chasecrawford.dev',
  'software engineer',
  'louisville · ky',
  'react · typescript · node',
  'open to work',
];

/* ------------------------------------------------------------------ */
/* Root component that wires up the full page                           */
/* ------------------------------------------------------------------ */
function FullPageDemo() {
  const [disconnected, setDisconnected] = useState(false);
  const [booting, setBooting] = useState(false);

  return (
    <Shell>
      {/* Boot-loader overlay — shown when "Boot" button is clicked */}
      {booting && (
        <BootLoader
          onComplete={() => setBooting(false)}
          autoStart
        />
      )}

      {/* Disconnect overlay */}
      <DisconnectOverlay
        open={disconnected}
        onReconnect={() => setDisconnected(false)}
      />

      <Window>
        {/* Title bar */}
        <TitleBar
          title="chase@louisville · Windows PowerShell"
          status={<span style={{ color: 'var(--green)' }}>● LIVE</span>}
          onClose={() => setDisconnected(true)}
        />

        {/* Scrolling marquee below the title bar */}
        <Ticker items={TICKER_ITEMS} durationSec={40} />

        {/* Collapsible body */}
        <WindowBody>
          {/* ASCII banner */}
          <Banner />

          {/* whoami */}
          <Prompt command="whoami" flags="--verbose" />
          <KVList />

          {/* Projects grid — two cards side by side */}
          <Prompt command="ls" flags="./projects" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              padding: '0.5rem 0',
            }}
          >
            <Card
              id="01"
              badge="ACTIVE"
              name="chasecrawford.dev"
              href="https://chasecrawford.dev"
              description="Personal site — the one you are looking at. Terminal / CRT aesthetic built in React + TypeScript."
              stack={['React', 'TypeScript', 'Vite', 'CSS Modules']}
            />
            <EquityChart defaultDays={30} />
          </div>

          {/* Experience */}
          <Prompt command="cat" flags="./experience.log" />
          <ExperienceTable />

          {/* Gallery */}
          <Prompt command="ls" flags="./gallery" />
          <Gallery />

          {/* Contact + feeds */}
          <Prompt command="cat" flags="./contact.json" />
          <ContactLinks />
          <FeedList />
        </WindowBody>

        {/* Status bar */}
        <StatusBar left="NORMAL · UTF-8 · LF · READY" showClock />
      </Window>

      {/* Dev controls — not part of the site; purely for story interaction */}
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 9999,
        }}
      >
        <Button variant="ghost" onClick={() => setBooting(true)}>
          Boot sequence
        </Button>
        <Button variant="ghost" onClick={() => setDisconnected(true)}>
          Disconnect
        </Button>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Storybook meta                                                        */
/* ------------------------------------------------------------------ */
const meta = {
  title: '_demo/FullPage',
  component: FullPageDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FullPageDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
