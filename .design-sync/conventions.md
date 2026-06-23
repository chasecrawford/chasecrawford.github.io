# ch4ze-ui — building with this design system

A terminal / CRT–themed React component library (compiled to `window.Ch4zeUI`). Dark surface, monospace, neon-on-near-black. Extracted 1:1 from chasecrawford.dev.

## Setup — no provider, but you MUST load the stylesheet
There is **no React context/provider to wrap** — components are styled entirely through a bundled stylesheet. Load the design system's `styles.css` **once** at the app root (it `@import`s the token layer and the compiled component CSS):

```tsx
import '@chasecrawford/ch4ze-ui/styles.css';
import { Shell, Window, WindowBody, TitleBar, StatusBar, Prompt, KVList } from '@chasecrawford/ch4ze-ui';
```

This is a **dark theme**: text is light/neon on a near-black surface. `styles.css` sets that surface (`html, body { background: var(--bg) }`). If you render components on a light/default background without it, light text becomes unreadable. When in doubt, put your screen inside `<Shell>` (the CRT page wrapper) or any element with `background: var(--bg)`.

## Styling idiom — CSS custom-property tokens (no utility classes)
Components style themselves; there is **no class-name vocabulary to learn**. For your **own** layout glue and any custom surfaces, use these tokens via `var(--*)` and the monospace font — never hard-code hex, so the look stays consistent and re-themable:

| Token | Use |
|---|---|
| `--bg` `#0a0a0a` / `--bg2` `#0f0f0f` | page surface / raised panel |
| `--ink` `#d8e4d8` / `--ink2` `#6a7a6a` | primary text / dim (labels, secondary) |
| `--line` `#1d2a1d` | borders, dividers (often `1px dashed`/`solid`) |
| `--green` `#00ff88` | primary accent (prompts, status-ok, highlights) |
| `--cyan` `#00d4ff` | links, hostnames |
| `--yellow` `#ffd60a` | paths |
| `--magenta` `#ff4db8` | prompt arrows / emphasis |
| `--red` `#ff5c5c` | errors / destructive |
| `--green-ink` `#04130b` | dark text placed *on* a `--green` fill |
| `--font-mono` (`'JetBrains Mono', ui-monospace, monospace`) | all type |
| `--fs-base` `13px` · `--fs-min` `12px` (floor) · `--lh-base` `1.6` | type scale — never go below `--fs-min` |

## Where the truth lives
- The bound `styles.css` (and the `_ds_bundle.css` it imports) is the authoritative token + component-style source — read it before styling.
- Each component has a `<Name>.prompt.md` with its props and usage, and a `.d.ts` API contract.

## Components (21)
- **shell**: `Shell` (CRT page wrapper), `Window` + `WindowBody` (bordered window; `minimized` collapses to the title bar), `TitleBar` (status + min/max/close), `StatusBar` (segments + live clock).
- **terminal**: `Prompt` (`user@host:path ❯ command --flags`), `Output` (+ `OutToken` for `success`/`warn`/`info`/`key` spans), `Banner` (ASCII art), `Caret` (blinking cursor), `BootLoader` (full-screen boot sequence — animated; renders live, has no static preview card).
- **feedback**: `Button` (`primary`/`ghost`), `Chip` (tones), `Ticker` (marquee).
- **content** (each prop-driven, defaults to real sample data): `KVList`, `Card`, `ExperienceTable`, `Gallery`, `ContactLinks`, `FeedList`.
- **feature**: `Magic8Ball`, `EquityChart`, `DisconnectOverlay`.

## One idiomatic snippet
```tsx
import '@chasecrawford/ch4ze-ui/styles.css';
import { Shell, Window, WindowBody, TitleBar, StatusBar, Prompt, Output } from '@chasecrawford/ch4ze-ui';

export default function App() {
  return (
    <Shell>
      <Window>
        <TitleBar title="chase@louisville · Windows PowerShell" />
        <WindowBody>
          <Prompt command="whoami" flags="--verbose" />
          {/* own layout glue uses tokens, never hard-coded color */}
          <div style={{ borderTop: '1px dashed var(--line)', color: 'var(--ink2)', marginTop: 16, paddingTop: 8 }}>
            <Output>ready <span style={{ color: 'var(--green)' }}>●</span></Output>
          </div>
        </WindowBody>
        <StatusBar />
      </Window>
    </Shell>
  );
}
```
