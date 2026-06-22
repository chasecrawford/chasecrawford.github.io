# @chasecrawford/ch4ze-ui

React + TypeScript component library that powers [chasecrawford.dev](https://chasecrawford.dev). Terminal / CRT aesthetic, zero runtime dependencies beyond React.

## Install

```bash
npm install @chasecrawford/ch4ze-ui
```

## Usage

```tsx
import {
  Shell, Window, WindowBody, TitleBar, StatusBar,
  Prompt, Output, OutToken, Banner, Caret, BootLoader,
  Button, Chip, Ticker,
  KVList, Card, ExperienceTable, Gallery, ContactLinks, FeedList,
  Magic8Ball, EquityChart, DisconnectOverlay,
} from '@chasecrawford/ch4ze-ui';

// Required — import styles once at your app entry point
import '@chasecrawford/ch4ze-ui/styles.css';
```

### Minimal example

```tsx
import { Shell, Window, WindowBody, TitleBar, StatusBar, Prompt, Output } from '@chasecrawford/ch4ze-ui';
import '@chasecrawford/ch4ze-ui/styles.css';

export function App() {
  return (
    <Shell>
      <Window>
        <TitleBar title="chase@louisville · PowerShell" />
        <WindowBody>
          <Prompt command="echo" flags="hello world" />
          <Output>hello world</Output>
        </WindowBody>
        <StatusBar />
      </Window>
    </Shell>
  );
}
```

## Styling

All palette colors are CSS custom properties defined in the bundled stylesheet (`ch4ze-ui.css`). Component CSS references the named palette tokens — `var(--bg)`, `var(--bg2)`, `var(--ink)`, `var(--ink2)`, `var(--line)`, `var(--green)`, `var(--cyan)`, `var(--yellow)`, `var(--magenta)`, `var(--red)`, and `var(--green-ink)` — so you can re-theme by overriding them at the `:root` level without touching component code. Incidental accents the source uses verbatim (near-black shell tones, `rgba(...)` shadows, `color-mix(...)` and gradient stops) are intentionally left un-tokenized to preserve fidelity to the original design.

## Components

| Group    | Components |
|----------|------------|
| Shell    | `Shell`, `Window`, `WindowBody`, `TitleBar`, `StatusBar` |
| Terminal | `Prompt`, `Output`, `OutToken`, `Banner`, `Caret`, `BootLoader` |
| Feedback | `Button`, `Chip`, `Ticker` |
| Content  | `KVList`, `Card`, `ExperienceTable`, `Gallery`, `ContactLinks`, `FeedList` |
| Feature  | `Magic8Ball`, `EquityChart`, `DisconnectOverlay` |

## Development

```bash
npm test              # vitest unit tests
npm run typecheck     # tsc type check
npm run build         # vite library build → dist/
npm run storybook     # live component explorer
npm run build-storybook
```
