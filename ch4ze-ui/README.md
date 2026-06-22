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

All visual tokens are CSS custom properties defined in the bundled stylesheet (`ch4ze-ui.css`). Component CSS references variables like `var(--green)`, `var(--bg)`, `var(--dim)`, `var(--amber)`, and `var(--red)` so you can override the palette at the `:root` level without touching component code. No hard-coded colors appear in component styles — every shade flows through the token layer, making full re-theming a single CSS block.

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
