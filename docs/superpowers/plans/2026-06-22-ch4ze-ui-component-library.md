# ch4ze-ui Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the `chasecrawford.dev` terminal/CRT design language into a buildable React + TypeScript component library (`@chasecrawford/ch4ze-ui`) whose `dist/` exposes `window.Ch4zeUI`, so `/design-sync` can run against it.

**Architecture:** A Vite library-mode package in a new `ch4ze-ui/` subdirectory. CSS custom-property tokens (verbatim from the site) + per-component CSS Modules. Every component is prop-driven with the site's real content as default sample data. Storybook is the component explorer and design-sync's verification surface; Vitest + Testing Library drives TDD.

**Tech Stack:** React 18, TypeScript 5 (strict), Vite 5 (library mode, ESM + UMD/IIFE), Storybook 8, Vitest 2 + @testing-library/react + jsdom.

## Global Constraints

- **All commands run from the `ch4ze-ui/` directory** (created in Task 1) unless stated otherwise. The repo root is `chasecrawford-dev-html/`; the ground-truth source is `../index.html`.
- **Package name:** `@chasecrawford/ch4ze-ui`. **Global name:** `Ch4zeUI`.
- **Node:** 20+. **Package manager:** npm (greenfield; no lockfile inherited).
- **React/ReactDOM are peer dependencies** and must be externalized in the library build — never bundled.
- **No hard-coded colors in component CSS.** Every color references a token: `var(--green)`, `var(--ink)`, etc. The tokens are defined once in `src/tokens/tokens.css`.
- **Minimum font size 12px** site-wide (matches the site's a11y rule; commit `e5fd39c`). Never emit a smaller `font-size`.
- **CSS Modules** for every component (`<Name>.module.css`); class names are local. Global selectors (resets, `:root`, font `@import`) live only in `src/tokens/tokens.css` and `src/styles.css`.
- **Respect `prefers-reduced-motion`** in every animated component (8-ball, ticker, boot loader, gallery, murk/blink effects) — mirror the `@media (prefers-reduced-motion:reduce)` rules already in the source.
- **The library must keep building green after every task** (`npm run build` succeeds, `npx tsc --noEmit` clean, `npm test` passes). A task is not done until these pass for the code it touched.
- Branch: work is on `ch4ze-ui-library` (already created). Commit after every task with the message shown in its final step.

## Conventions (apply to every component task)

These mechanics are identical for all component tasks; each task below states only what is *specific* to it (prop interface, source line ranges, story states, test).

**Directory shape for component `<Name>` in group `<group>`:**
```
src/components/<group>/<Name>/
  <Name>.tsx           # the component
  <Name>.module.css    # scoped styles (ported from ../index.html)
  <Name>.stories.tsx   # Storybook stories — one export per visual state
  <Name>.test.tsx      # Vitest + RTL test (written FIRST, TDD)
  index.ts             # re-export: export * from './<Name>'
```

**Porting CSS:** Open `../index.html`, copy the rule block at the cited line range into `<Name>.module.css`, then (a) strip the leading `.classname` to a local class (e.g. `.proj` → `.card`), (b) keep all `var(--*)` references as-is (the tokens already exist), (c) move any `@media` responsive rules cited for that component into the same module. Do NOT copy `:root` or global element selectors — those belong to the token/styles layer.

**Porting markup:** The cited markup line range in `../index.html` shows the exact DOM structure; reproduce it in JSX, replacing class strings with `styles.<localClass>` from the CSS Module and substituting prop values for the hard-coded content.

**Test harness:** every `*.test.tsx` starts with:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
```
Interaction tests additionally import `userEvent` from `@testing-library/user-event` and `vi` from `vitest`.

**Story file shape:** default export `{ title: '<group>/<Name>', component: <Name> }` typed as `Meta<typeof <Name>>`; each named export is a `StoryObj<typeof <Name>>` with `args`.

**Commit:** `git add` the component dir (and any sample-data/barrel files the task changed), commit with the task's message.

---

## Phase 0 — Scaffold

### Task 1: Initialize the library package and build

**Files:**
- Create: `ch4ze-ui/package.json`
- Create: `ch4ze-ui/tsconfig.json`
- Create: `ch4ze-ui/tsconfig.node.json`
- Create: `ch4ze-ui/vite.config.ts`
- Create: `ch4ze-ui/src/index.ts`
- Create: `ch4ze-ui/.gitignore`

**Interfaces:**
- Produces: `src/index.ts` barrel (initially exports a `version` constant); Vite library build emitting `dist/ch4ze-ui.js` (ESM), `dist/ch4ze-ui.umd.cjs` (UMD, global `Ch4zeUI`), and `dist/ch4ze-ui.css`.

- [ ] **Step 1: Create the package directory and `package.json`**

`ch4ze-ui/package.json`:
```json
{
  "name": "@chasecrawford/ch4ze-ui",
  "version": "0.1.0",
  "description": "Terminal/CRT component library extracted from chasecrawford.dev",
  "type": "module",
  "main": "./dist/ch4ze-ui.umd.cjs",
  "module": "./dist/ch4ze-ui.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/ch4ze-ui.js",
      "require": "./dist/ch4ze-ui.umd.cjs"
    },
    "./styles.css": "./dist/ch4ze-ui.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^25.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```
(Storybook devDependencies are added in Task 3 by its `storybook init`.)

- [ ] **Step 2: Create `tsconfig.json` and `tsconfig.node.json`**

`ch4ze-ui/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`ch4ze-ui/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts` (library mode)**

`ch4ze-ui/vite.config.ts`:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Ch4zeUI',
      fileName: (format) => (format === 'es' ? 'ch4ze-ui.js' : 'ch4ze-ui.umd.cjs'),
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: 'ch4ze-ui.css',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
});
```

- [ ] **Step 4: Create the barrel stub and `.gitignore`**

`ch4ze-ui/src/index.ts`:
```ts
export const version = '0.1.0';
```

`ch4ze-ui/.gitignore`:
```
node_modules
dist
storybook-static
*.log
```

- [ ] **Step 5: Install and verify the build**

Run (from `ch4ze-ui/`): `npm install`
Then: `npm run build`
Expected: build succeeds; `dist/ch4ze-ui.js` and `dist/ch4ze-ui.umd.cjs` exist. Verify the global wiring:
Run: `node -e "const m=require('./dist/ch4ze-ui.umd.cjs'); if(m.version!=='0.1.0') throw new Error('global export missing'); console.log('Ch4zeUI ok')"`
Expected: prints `Ch4zeUI ok`.

- [ ] **Step 6: Commit**
```bash
git add ch4ze-ui/package.json ch4ze-ui/package-lock.json ch4ze-ui/tsconfig.json ch4ze-ui/tsconfig.node.json ch4ze-ui/vite.config.ts ch4ze-ui/src/index.ts ch4ze-ui/.gitignore
git commit -m "chore(ch4ze-ui): scaffold Vite library package with UMD global"
```

---

### Task 2: Token layer, shared types, and global styles

**Files:**
- Create: `ch4ze-ui/src/tokens/tokens.css`
- Create: `ch4ze-ui/src/styles.css`
- Create: `ch4ze-ui/src/types.ts`
- Create: `ch4ze-ui/src/tokens/tokens.test.ts`
- Modify: `ch4ze-ui/src/index.ts`

**Interfaces:**
- Produces: `Tone` type (`'green' | 'cyan' | 'yellow' | 'magenta' | 'red' | 'ink' | 'dim'`), exported from `src/types.ts`; `src/styles.css` as the public stylesheet entry (`@import`s tokens). Components import `'../../../styles.css'` is NOT done per-component; instead `src/index.ts` imports `./styles.css` once.

- [ ] **Step 1: Write the failing test** — asserts the token file declares every required custom property.

`ch4ze-ui/src/tokens/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8');

describe('tokens.css', () => {
  const required = ['--bg', '--bg2', '--ink', '--ink2', '--line', '--green',
    '--cyan', '--yellow', '--magenta', '--red'];
  it.each(required)('declares %s', (name) => {
    expect(css).toContain(`${name}:`);
  });
  it('imports JetBrains Mono', () => {
    expect(css).toMatch(/JetBrains\+Mono/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tokens`
Expected: FAIL — cannot read `tokens.css` (file missing).

- [ ] **Step 3: Create `tokens/tokens.css`** — port `:root` from `../index.html:21-32`, add the font import and the type scale.

`ch4ze-ui/src/tokens/tokens.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap');

:root {
  /* colors — verbatim from chasecrawford.dev */
  --bg: #0a0a0a;
  --bg2: #0f0f0f;
  --ink: #d8e4d8;
  --ink2: #6a7a6a;
  --line: #1d2a1d;
  --green: #00ff88;
  --cyan: #00d4ff;
  --yellow: #ffd60a;
  --magenta: #ff4db8;
  --red: #ff5c5c;

  /* type */
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --fs-base: 13px;     /* body */
  --fs-min: 12px;      /* a11y floor — never go below */
  --lh-base: 1.6;
}
```

- [ ] **Step 4: Create `styles.css`** — global resets ported from `../index.html:33-37`, importing tokens first.

`ch4ze-ui/src/styles.css`:
```css
@import './tokens/tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  line-height: var(--lh-base);
  overflow-x: hidden;
}
a { color: var(--cyan); text-decoration: none; border-bottom: 1px dashed transparent; }
a:hover { border-bottom-color: var(--cyan); }
::selection { background: var(--green); color: #000; }
```

- [ ] **Step 5: Create `types.ts` and wire `index.ts`**

`ch4ze-ui/src/types.ts`:
```ts
export type Tone = 'green' | 'cyan' | 'yellow' | 'magenta' | 'red' | 'ink' | 'dim';
```

Modify `ch4ze-ui/src/index.ts` to:
```ts
import './styles.css';
export const version = '0.1.0';
export type { Tone } from './types';
```

- [ ] **Step 6: Run test + build to verify they pass**

Run: `npm test -- tokens`
Expected: PASS (all properties + font import found).
Run: `npm run build`
Expected: succeeds; `dist/ch4ze-ui.css` now contains the `:root` tokens.

- [ ] **Step 7: Commit**
```bash
git add ch4ze-ui/src/tokens ch4ze-ui/src/styles.css ch4ze-ui/src/types.ts ch4ze-ui/src/index.ts
git commit -m "feat(ch4ze-ui): token layer, shared types, global styles"
```

---

### Task 3: Storybook + Vitest harness

**Files:**
- Create: `ch4ze-ui/vitest.setup.ts`
- Create (via `storybook init`, then edit): `ch4ze-ui/.storybook/main.ts`, `ch4ze-ui/.storybook/preview.ts`
- Create: `ch4ze-ui/src/smoke.test.tsx`

**Interfaces:**
- Produces: a working Storybook that loads `src/styles.css` globally; a Vitest setup that registers jest-dom matchers.

- [ ] **Step 1: Create the Vitest setup file**

`ch4ze-ui/vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Initialize Storybook**

Run: `npx storybook@^8 init --builder vite --type react --yes`
Expected: creates `.storybook/`, adds Storybook deps to `package.json`, may add example stories under `src/stories/`.

- [ ] **Step 3: Remove Storybook's example boilerplate and point preview at our styles**

Delete the generated example dir if present:
Run: `rm -rf src/stories`

Edit `ch4ze-ui/.storybook/main.ts` so `stories` globs our components:
```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
```

Edit `ch4ze-ui/.storybook/preview.ts` to load global styles and set a dark backdrop:
```ts
import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: { default: 'crt', values: [{ name: 'crt', value: '#0a0a0a' }] },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};
export default preview;
```

- [ ] **Step 4: Write a smoke test for the barrel**

`ch4ze-ui/src/smoke.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import * as Ch4zeUI from './index';

describe('barrel', () => {
  it('exports a version string', () => {
    expect(typeof Ch4zeUI.version).toBe('string');
  });
});
```

- [ ] **Step 5: Verify test + storybook build**

Run: `npm test -- smoke`
Expected: PASS.
Run: `npm run build-storybook`
Expected: builds to `storybook-static/` without error.

- [ ] **Step 6: Commit**
```bash
git add ch4ze-ui/.storybook ch4ze-ui/vitest.setup.ts ch4ze-ui/src/smoke.test.tsx ch4ze-ui/package.json ch4ze-ui/package-lock.json
git commit -m "chore(ch4ze-ui): Storybook + Vitest harness"
```

---

## Phase 1 — Primitives (`feedback`, `terminal`)

> After each component task: add its export to `src/index.ts` (done within the task's "wire barrel" step), then `npm run build` + `npm test` stay green.

### Task 4: Chip (`feedback`)

**Source:** CSS `../index.html:341-343` (`.chip`); usage `../index.html:736-740`.

**Files:** `src/components/feedback/Chip/{Chip.tsx,Chip.module.css,Chip.stories.tsx,Chip.test.tsx,index.ts}`; modify `src/index.ts`.

**Interfaces:**
- Produces:
```ts
export interface ChipProps {
  children: React.ReactNode;
  tone?: Tone;            // default 'ink' (border --line, text --ink2 like the site)
  className?: string;
}
export function Chip(props: ChipProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>PHP</Chip>);
    expect(screen.getByText('PHP')).toBeInTheDocument();
  });
  it('applies a tone class when given a tone', () => {
    const { container } = render(<Chip tone="green">LIVE</Chip>);
    expect((container.firstChild as HTMLElement).className).toMatch(/green/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — Run: `npm test -- Chip` → FAIL (module not found).

- [ ] **Step 3: Implement `Chip.module.css`** — port `.chip` (line 341): `display:inline-block;padding:1px 6px;border:1px solid var(--line);font-size:var(--fs-min);color:var(--ink2)`. Add tone modifier classes that override `color` (e.g. `.green{color:var(--green)}` …) for each `Tone`.

- [ ] **Step 4: Implement `Chip.tsx`**
```tsx
import type { Tone } from '../../../types';
import styles from './Chip.module.css';

export interface ChipProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function Chip({ children, tone = 'ink', className }: ChipProps) {
  return (
    <span className={[styles.chip, styles[tone], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Implement `Chip.stories.tsx`** — stories: `Default` (args `{children:'PHP'}`), `Tones` (renders one chip per Tone). `index.ts`: `export * from './Chip';`.

- [ ] **Step 6: Wire barrel** — add to `src/index.ts`: `export * from './components/feedback/Chip';`.

- [ ] **Step 7: Verify** — Run: `npm test -- Chip` → PASS. Run: `npm run build` → succeeds.

- [ ] **Step 8: Commit** — `git add ch4ze-ui/src/components/feedback/Chip ch4ze-ui/src/index.ts && git commit -m "feat(ch4ze-ui): Chip component"`

---

### Task 5: Button (`feedback`)

**Source:** CSS `../index.html:263-286` (`button.cc8-btn`, `.cc8-status`) and `309-310` (`.skip`), `96-101` (`.xbtn`). Use the cc8-btn as the canonical style; expose variants for the skip/close-overlay looks.

**Files:** `src/components/feedback/Button/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';   // primary = cc8-btn green; ghost = .skip outline
}
export function Button(props: ButtonProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Shake</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Shake' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Shake</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run → FAIL.** Run: `npm test -- Button`.

- [ ] **Step 3: `Button.module.css`** — port `button.cc8-btn` rules (263-279) into `.primary`; port `.skip` (309-310) into `.ghost`. Keep `:hover/:active/:disabled` states and the `prefers-reduced-motion` transition removal.

- [ ] **Step 4: `Button.tsx`**
```tsx
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button className={[styles.btn, styles[variant], className].filter(Boolean).join(' ')} {...rest} />;
}
```

- [ ] **Step 5: Stories** — `Primary`, `Ghost`, `Disabled`. `index.ts` re-export.

- [ ] **Step 6: Wire barrel** — `export * from './components/feedback/Button';`.

- [ ] **Step 7: Verify** — `npm test -- Button` PASS; `npm run build` ok.

- [ ] **Step 8: Commit** — `git commit -m "feat(ch4ze-ui): Button component"`.

---

### Task 6: Caret (`terminal`)

**Source:** CSS `../index.html:546-548` (`.caret`, `@keyframes blink`).

**Files:** `src/components/terminal/Caret/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface CaretProps { className?: string; }
export function Caret(props?: CaretProps): JSX.Element;
```

- [ ] **Step 1: Failing test**
```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Caret } from './Caret';

describe('Caret', () => {
  it('renders a blinking caret span', () => {
    const { container } = render(<Caret />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: `Caret.module.css`** — port `.caret` and its `@keyframes blink`; wrap the animation in `@media (prefers-reduced-motion: reduce){ .caret{animation:none} }`.

- [ ] **Step 4: `Caret.tsx`**
```tsx
import styles from './Caret.module.css';
export interface CaretProps { className?: string; }
export function Caret({ className }: CaretProps = {}) {
  return <span aria-hidden="true" className={[styles.caret, className].filter(Boolean).join(' ')} />;
}
```

- [ ] **Step 5: Stories** — `Default`. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify** (`npm test -- Caret`, build). **Step 8: Commit** `feat(ch4ze-ui): Caret component`.

---

### Task 7: Prompt (`terminal`)

**Source:** CSS `../index.html:313-322` (`.cmd`, `.cmd-pre`, `.user/.at/.host/.sep/.path/.arrow/.c/.flag`); markup `../index.html:725-729`.

**Files:** `src/components/terminal/Prompt/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface PromptProps {
  user?: string;     // default 'chase'
  host?: string;     // default 'louisville'
  path?: string;     // default '~'
  command: string;   // e.g. 'whoami'
  flags?: string;    // e.g. '--verbose' (rendered cyan)
  className?: string;
}
export function Prompt(props: PromptProps): JSX.Element;
```

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Prompt } from './Prompt';

describe('Prompt', () => {
  it('renders user, host, path, command, and flags', () => {
    render(<Prompt command="whoami" flags="--verbose" />);
    expect(screen.getByText('chase')).toBeInTheDocument();
    expect(screen.getByText('louisville')).toBeInTheDocument();
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
    expect(screen.getByText('--verbose')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: `Prompt.module.css`** — port `.cmd` and the colored span classes (313-322).

- [ ] **Step 4: `Prompt.tsx`** — reproduce markup 725-729 with props:
```tsx
import styles from './Prompt.module.css';

export interface PromptProps {
  user?: string; host?: string; path?: string;
  command: string; flags?: string; className?: string;
}

export function Prompt({ user = 'chase', host = 'louisville', path = '~', command, flags, className }: PromptProps) {
  return (
    <div className={[styles.cmd, className].filter(Boolean).join(' ')}>
      <span className={styles.cmdPre}>
        <span className={styles.user}>{user}</span>
        <span className={styles.at}>@</span>
        <span className={styles.host}>{host}</span>
        <span className={styles.sep}>:</span>
        <span className={styles.path}>{path}</span>
      </span>
      <span className={styles.arrow}>❯</span>
      <span className={styles.c}>
        {command}{flags ? <> <span className={styles.flag}>{flags}</span></> : null}
      </span>
    </div>
  );
}
```

- [ ] **Step 5: Stories** — `Whoami` (`{command:'whoami', flags:'--verbose'}`), `ListProjects` (`{path:'~/projects', command:'ls', flags:'--long --featured'}`). `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): Prompt component`.

---

### Task 8: Output (`terminal`)

**Source:** CSS `../index.html:324-330` (`.out`, `.out.dim`, `.out pre`, `.success/.warn/.info/.key`); markup `../index.html:730-744`, `790`.

**Files:** `src/components/terminal/Output/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface OutputProps {
  children: React.ReactNode;
  dim?: boolean;            // .out.dim
  as?: 'div' | 'pre';       // 'pre' for monospace blocks
  className?: string;
}
export function Output(props: OutputProps): JSX.Element;
// Inline token helper for colored spans inside Output:
export interface OutTokenProps { tone: 'success' | 'warn' | 'info' | 'key'; children: React.ReactNode; }
export function OutToken(props: OutTokenProps): JSX.Element;
```

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Output, OutToken } from './Output';

describe('Output', () => {
  it('renders children and applies dim', () => {
    const { container } = render(<Output dim>total 2 · open source</Output>);
    expect(screen.getByText(/total 2/)).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).className).toMatch(/dim/);
  });
  it('OutToken applies its tone class', () => {
    const { container } = render(<OutToken tone="success">ok</OutToken>);
    expect((container.firstChild as HTMLElement).className).toMatch(/success/);
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: `Output.module.css`** — port `.out`, `.out.dim` (as `.dim`), `.out pre` (as `.pre`), and `.success/.warn/.info/.key` token classes.

- [ ] **Step 4: `Output.tsx`**
```tsx
import styles from './Output.module.css';

export interface OutputProps {
  children: React.ReactNode; dim?: boolean; as?: 'div' | 'pre'; className?: string;
}
export function Output({ children, dim, as = 'div', className }: OutputProps) {
  const Tag = as;
  return <Tag className={[styles.out, dim && styles.dim, as === 'pre' && styles.pre, className].filter(Boolean).join(' ')}>{children}</Tag>;
}

export interface OutTokenProps { tone: 'success' | 'warn' | 'info' | 'key'; children: React.ReactNode; }
export function OutToken({ tone, children }: OutTokenProps) {
  return <span className={styles[tone]}>{children}</span>;
}
```

- [ ] **Step 5: Stories** — `Dim`, `WithTokens`. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): Output component`.

---

### Task 9: Banner (`terminal`)

**Source:** CSS `../index.html:333-335` (`.banner`, `.banner-sm`, `.banner-sub`) plus responsive swaps `581-586`, `627-632`; markup `705-719`.

**Files:** `src/components/terminal/Banner/{...}`; `src/sample-data/banner.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface BannerProps {
  art?: string;        // full ASCII block; defaults to CHASECRAWFORD DEV
  artSmall?: string;   // narrow-viewport ASCII; defaults to short CHASE block
  subtitle?: React.ReactNode;
  className?: string;
}
export function Banner(props?: BannerProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `ch4ze-ui/src/sample-data/banner.ts` — export `BANNER_FULL` and `BANNER_SMALL` string constants copied verbatim from `../index.html:706-711` and `712-717` (preserve the box-drawing characters exactly).

- [ ] **Step 2: Failing test**
```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders the full and small art blocks and a subtitle', () => {
    const { container } = render(<Banner subtitle="v3.0" />);
    const pres = container.querySelectorAll('pre');
    expect(pres.length).toBe(2);            // full + small
    expect(container.textContent).toContain('v3.0');
  });
});
```

- [ ] **Step 3: Run → FAIL.**

- [ ] **Step 4: `Banner.module.css`** — port `.banner`, `.banner-sm`, `.banner-sub`; include the responsive rules that hide `.banner` and show `.banner-sm` at `max-width:860px` and `720px`.

- [ ] **Step 5: `Banner.tsx`**
```tsx
import { BANNER_FULL, BANNER_SMALL } from '../../../sample-data/banner';
import styles from './Banner.module.css';

export interface BannerProps {
  art?: string; artSmall?: string; subtitle?: React.ReactNode; className?: string;
}
export function Banner({ art = BANNER_FULL, artSmall = BANNER_SMALL, subtitle, className }: BannerProps = {}) {
  return (
    <div className={className}>
      <pre className={styles.banner}>{art}</pre>
      <pre className={styles.bannerSm}>{artSmall}</pre>
      {subtitle != null && <div className={styles.bannerSub}>{subtitle}</div>}
    </div>
  );
}
```

- [ ] **Step 6: Stories** — `Default`, `CustomText` (`art` set to a short test block). `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): Banner component`.

---

### Task 10: Ticker (`feedback`)

**Source:** CSS `../index.html:550-563` (`.ticker`, `.ticker-track`, `.ticker-group`, `@keyframes tk`, reduced-motion); markup `688-702`; clone behavior `1466-1476`.

**Files:** `src/components/feedback/Ticker/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface TickerProps {
  items: React.ReactNode[];   // rendered with a '//' separator like the site
  durationSec?: number;       // default 50
  className?: string;
}
export function Ticker(props: TickerProps): JSX.Element;
```

> React approach: instead of cloning DOM at runtime, render the group **twice** in JSX (the second copy `aria-hidden`). The CSS `translateX(-50%)` over the doubled track gives the seamless loop — identical visual result, no imperative cloning.

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Ticker } from './Ticker';

describe('Ticker', () => {
  it('renders each item twice (group + aria-hidden clone) for a seamless loop', () => {
    render(<Ticker items={['REAL HUMAN']} />);
    expect(screen.getAllByText('REAL HUMAN')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: `Ticker.module.css`** — port the ticker rules; set the track animation duration via a CSS variable `--tk-dur` so the prop can override it (`animation: tk var(--tk-dur,50s) linear infinite`).

- [ ] **Step 4: `Ticker.tsx`**
```tsx
import styles from './Ticker.module.css';

export interface TickerProps { items: React.ReactNode[]; durationSec?: number; className?: string; }

function Group({ items, hidden }: { items: React.ReactNode[]; hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.flatMap((it, i) => [
        <span key={`i${i}`}>{it}</span>,
        <span key={`s${i}`}>//</span>,
      ])}
    </div>
  );
}

export function Ticker({ items, durationSec = 50, className }: TickerProps) {
  return (
    <div className={[styles.ticker, className].filter(Boolean).join(' ')}>
      <div className={styles.track} style={{ '--tk-dur': `${durationSec}s` } as React.CSSProperties}>
        <Group items={items} />
        <Group items={items} hidden />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Stories** — `Default` with the site's 4 phrases. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): Ticker component`.

---

## Phase 2 — Shell (`shell`)

### Task 11: Shell (`shell`)

**Source:** CSS `../index.html:40-47` (`.shell`) and `103` (`.body`) and responsive `575-576`, `614`.

**Files:** `src/components/shell/Shell/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface ShellProps { children: React.ReactNode; className?: string; }
export function Shell(props: ShellProps): JSX.Element;
```

- [ ] **Step 1: Failing test** — render `<Shell><div data-testid="x"/></Shell>`, assert child present.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: `Shell.module.css`** — port `.shell` (scanline gradient bg + padding), include responsive padding at 860px.
- [ ] **Step 4: `Shell.tsx`**
```tsx
import styles from './Shell.module.css';
export interface ShellProps { children: React.ReactNode; className?: string; }
export function Shell({ children, className }: ShellProps) {
  return <div className={[styles.shell, className].filter(Boolean).join(' ')}>{children}</div>;
}
```
- [ ] **Step 5: Stories** `Default` (wrap a short `<Window>`-less placeholder). `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): Shell component`.

---

### Task 12: Window (`shell`)

**Source:** CSS `../index.html:48-54` (`.window`), `103` (`.body`), minimized state `79-84`; markup `672-704`, `991`.

**Files:** `src/components/shell/Window/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface WindowProps {
  children: React.ReactNode;  // typically TitleBar, Ticker, body content, StatusBar
  minimized?: boolean;        // collapses to titlebar only (parent-controlled)
  className?: string;
}
export function Window(props: WindowProps): JSX.Element;
// Body wrapper for the padded content region (.body):
export interface WindowBodyProps { children: React.ReactNode; className?: string; }
export function WindowBody(props: WindowBodyProps): JSX.Element;
```

> Minimized behavior: in the site it's a `body.minimized` class hiding ticker/body/statusbar. Here `Window` takes a `minimized` prop and applies a class that hides children marked with `data-window-region="collapsible"`. `WindowBody` and (later) `Ticker`/`StatusBar` placed as children set that attribute via the consumer; to keep it simple, `WindowBody` always sets `data-window-region="collapsible"`, and the minimized class hides those regions via CSS `:where([data-window-region="collapsible"])`.

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Window, WindowBody } from './Window';

describe('Window', () => {
  it('renders children', () => {
    render(<Window><WindowBody>hi</WindowBody></Window>);
    expect(screen.getByText('hi')).toBeInTheDocument();
  });
  it('adds a minimized class when minimized', () => {
    const { container } = render(<Window minimized><WindowBody>hi</WindowBody></Window>);
    expect((container.firstChild as HTMLElement).className).toMatch(/minimized/);
  });
});
```
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: `Window.module.css`** — port `.window` and `.body`; add `.minimized` + `.minimized :where([data-window-region="collapsible"]){display:none}` adapted from 79-84.
- [ ] **Step 4: `Window.tsx`**
```tsx
import styles from './Window.module.css';
export interface WindowProps { children: React.ReactNode; minimized?: boolean; className?: string; }
export function Window({ children, minimized, className }: WindowProps) {
  return <div className={[styles.window, minimized && styles.minimized, className].filter(Boolean).join(' ')}>{children}</div>;
}
export interface WindowBodyProps { children: React.ReactNode; className?: string; }
export function WindowBody({ children, className }: WindowBodyProps) {
  return <div data-window-region="collapsible" className={[styles.body, className].filter(Boolean).join(' ')}>{children}</div>;
}
```
- [ ] **Step 5: Stories** `Default`, `Minimized`. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): Window component`.

---

### Task 13: TitleBar (`shell`)

**Source:** CSS `../index.html:55-76` (`.titlebar`, `.tb-left/.tb-center/.tb-right`, `.wcontrols`, `.wctl`, `.wctl.close`, focus styles); markup `676-686`.

**Files:** `src/components/shell/TitleBar/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface TitleBarProps {
  title?: string;                 // center text; default 'chase@louisville · Windows PowerShell'
  status?: React.ReactNode;       // left; default '● LIVE' in green
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  showControls?: boolean;         // default true
  className?: string;
}
export function TitleBar(props?: TitleBarProps): JSX.Element;
```

- [ ] **Step 1: Failing test**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TitleBar } from './TitleBar';

describe('TitleBar', () => {
  it('renders the title and fires control callbacks', async () => {
    const onClose = vi.fn();
    render(<TitleBar title="t" onClose={onClose} />);
    expect(screen.getByText('t')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: `TitleBar.module.css`** — port titlebar + window-control rules (55-76).
- [ ] **Step 4: `TitleBar.tsx`** — reproduce markup 676-686 with the three control buttons wired to callbacks (use the same glyphs: `＿` minimize, `□` maximize, `×` close). `aria-label`s: "Minimize"/"Maximize"/"Close".
- [ ] **Step 5: Stories** `Default`, `NoControls`. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): TitleBar component`.

---

### Task 14: StatusBar (`shell`)

**Source:** CSS `../index.html:566-571` (`.statusbar`, `.statusbar .g`) + responsive `634`; markup `993-997`; clock behavior `1478-1487`.

**Files:** `src/components/shell/StatusBar/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface StatusBarProps {
  left?: React.ReactNode;     // default 'NORMAL · UTF-8 · LF · READY'
  center?: React.ReactNode;   // default '© <year> CHASE CRAWFORD'
  showClock?: boolean;        // default true — live HH:MM:SS, right segment, label 'LOUISVILLE, KY · '
  className?: string;
}
export function StatusBar(props?: StatusBarProps): JSX.Element;
```

- [ ] **Step 1: Failing test** — uses fake timers to assert the clock updates.
```tsx
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('renders a live clock that ticks', () => {
    render(<StatusBar />);
    const clock = screen.getByTestId('statusbar-clock');
    const first = clock.textContent;
    expect(first).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
```
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: `StatusBar.module.css`** — port statusbar rules + responsive wrap.
- [ ] **Step 4: `StatusBar.tsx`** — `data-window-region="collapsible"`; clock via `useState` + `useEffect` `setInterval(1000)` formatting `HH:MM:SS` (logic from 1480-1486); the clock `<span data-testid="statusbar-clock" className={styles.g}>`. Default center year via `new Date().getFullYear()`.
- [ ] **Step 5: Stories** `Default`, `NoClock`. `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): StatusBar component`.

---

## Phase 3 — Content (`content`)

### Task 15: KVList (`content`)

**Source:** CSS `../index.html:338-345` (`.kv`, `.k`, `.v`, `.v .chip`, `.v.chips`, `.v .ok`, `.v a`) + responsive `587`, `633`; markup `731-743`.

**Files:** `src/components/content/KVList/{...}`; `src/sample-data/whoami.tsx`; modify `src/types.ts` (add `KVRow`); modify `src/index.ts`.

**Interfaces:**
```ts
// in src/types.ts (the single home for the shared row type):
export interface KVRow { k: string; v: React.ReactNode; }
// in KVList.tsx:
export interface KVListProps { rows?: KVRow[]; className?: string; }   // defaults to WHOAMI_ROWS
export function KVList(props?: KVListProps): JSX.Element;
```

- [ ] **Step 1: Add `KVRow` to `src/types.ts`** then create sample data `src/sample-data/whoami.tsx` (`.tsx` because it renders Chips) — `WHOAMI_ROWS: KVRow[]` mirroring 731-743 (name, role, employer link, location, skills as `Chip`s, status `● employed full-time` green, pronouns), importing `KVRow` from `../types` and `Chip` from `../components/feedback/Chip`.
- [ ] **Step 2: Failing test** — render `<KVList />`, assert `getByText('Chase Crawford')` and a skill chip `getByText('PHP')` present.
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `KVList.module.css`** — port `.kv` grid + variants + responsive.
- [ ] **Step 5: `KVList.tsx`**
```tsx
import { WHOAMI_ROWS } from '../../../sample-data/whoami';
import type { KVRow } from '../../../types';
import styles from './KVList.module.css';
export interface KVListProps { rows?: KVRow[]; className?: string; }
export function KVList({ rows = WHOAMI_ROWS, className }: KVListProps = {}) {
  return (
    <div className={[styles.kv, className].filter(Boolean).join(' ')}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'contents' }}>
          <div className={styles.k}>{r.k}</div>
          <div className={styles.v}>{r.v}</div>
        </div>
      ))}
    </div>
  );
}
```
(Put `KVRow` in `whoami.ts` to avoid a cycle, or in `types.ts`; define it in `types.ts` and import in both.)
- [ ] **Step 6: Stories** `Default`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): KVList component`.

---

### Task 16: Card (`content`)

**Source:** CSS `../index.html:347-394` (`.proj`, `.proj-detail`, `.proj-head/.id`, `.proj-name/.nm/.proj-go`, `.proj-desc`, `.proj-thesis` + label/`.vs`, `.proj-stack`, `.proj-stats`); markup `793-803`.

**Files:** `src/components/content/Card/{...}`; `src/sample-data/projects.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface CardThesis { label?: string; body: React.ReactNode; } // label default 'Goal'
export interface CardProps {
  id: string;             // e.g. '001'
  badge?: string;         // top-right, e.g. 'OSS'
  name: string;
  href?: string;          // makes the whole card a link
  description: React.ReactNode;
  stack?: string[];       // rendered as bordered stack tags
  stats?: React.ReactNode[];
  thesis?: CardThesis;
  className?: string;
}
export function Card(props: CardProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `src/sample-data/projects.ts` — `BOT_TRADER` and `FEEDS_BY_CHASE` `CardProps` objects from markup 793-803 and 844-854 (descriptions, stacks, stats, thesis with the `+768%`/`+615%` numbers and `.vs` styling preserved via JSX `<b>` spans).
- [ ] **Step 2: Failing test** — render `<Card {...BOT_TRADER} />`; assert name + thesis label `Goal` + a stack tag present; assert the root is an `<a>` with the href.
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `Card.module.css`** — port the `.proj*` rules incl. `.proj-detail` flex layout and thesis callout.
- [ ] **Step 5: `Card.tsx`** — reproduce 793-803; root element is `<a>` when `href` set else `<div>`; render stack tags (`<span>` each), stats (dashed top border row), thesis callout when present. Use `styles.projDetail` always (matches site's detail cards).
- [ ] **Step 6: Stories** `BotTrader`, `FeedsByChase`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): Card component`.

---

### Task 17: ExperienceTable (`content`)

**Source:** CSS `../index.html:501-510` (`table.exp` + cells, `.role`, `.co`, `.status`) + responsive `637-638`; markup `889-931`.

**Files:** `src/components/content/ExperienceTable/{...}`; `src/sample-data/experience.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface ExperienceRow {
  dates: string; role: string; company: string; companyHref?: string;
  notes: React.ReactNode; status: 'current' | 'closed';
}
export interface ExperienceTableProps { rows?: ExperienceRow[]; className?: string; } // defaults to EXPERIENCE_ROWS
export function ExperienceTable(props?: ExperienceTableProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `src/sample-data/experience.ts` — `EXPERIENCE_ROWS: ExperienceRow[]` from the 6 `<tr>` rows at 893-930 (current row → `status:'current'`, rest `'closed'`).
- [ ] **Step 2: Failing test** — render `<ExperienceTable />`; assert header `ROLE` and the current role `Lead Backend Developer` and a `● CURRENT` status cell.
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `ExperienceTable.module.css`** — port `table.exp` rules; include the responsive rule hiding the STATUS column at `max-width:720px`.
- [ ] **Step 5: `ExperienceTable.tsx`** — `<table>` with thead (DATES/ROLE/NOTES/STATUS) and a row per entry; status cell renders `● CURRENT` (green) or `CLOSED` (dim) via a class.
- [ ] **Step 6: Stories** `Default`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): ExperienceTable component`.

---

### Task 18: Gallery (`content`)

**Source:** CSS `../index.html:512-534` (`.gal`, `.gframe`, `.gframe-label/.gframe-id/.gframe-viz`, `.scan`, `.gframe-photo` duotone + hover) + responsive `578`; markup `942-963`.

**Files:** `src/components/content/Gallery/{...}`; `src/sample-data/gallery.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface GalleryFrame { src: string; label: string; id: string; hue: string; } // hue e.g. '315deg'
export interface GalleryProps { frames?: GalleryFrame[]; className?: string; } // defaults to GALLERY_FRAMES
export function Gallery(props?: GalleryProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `src/sample-data/gallery.ts` — `GALLERY_FRAMES` from 943-962 (4 frames; `src` pointing at the published site path `https://chasecrawford.dev/images/<file>` so previews resolve without bundling the JPGs; hues 315/107/287/15deg).
- [ ] **Step 2: Failing test** — render `<Gallery />`; assert 4 frames and label `XMAS '25` present.
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `Gallery.module.css`** — port the gallery rules incl. duotone filter, hover-to-color, `.scan`, responsive 2-col at 860px.
- [ ] **Step 5: `Gallery.tsx`** — grid of frames; each sets `--hue` and the duotone+overlay `background-image` inline exactly as the markup does (overlay gradient + `url(src)`), with the `.scan` overlay div.
- [ ] **Step 6: Stories** `Default`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): Gallery component`.

---

### Task 19: ContactLinks (`content`)

**Source:** CSS `../index.html:536-544` (`.contact-links`, `.clink`, `button.clink`, `.clink.copied`) + responsive `579`; markup `973-982`; copy behavior `1455-1464`, `1538-1548`.

**Files:** `src/components/content/ContactLinks/{...}`; `src/sample-data/contact.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface ContactLink {
  key: string; value: string;
  href?: string;             // anchor link
  copy?: string;             // if set, renders a button that copies this text on click
  target?: string;
}
export interface ContactLinksProps { links?: ContactLink[]; className?: string; } // defaults to CONTACT_LINKS
export function ContactLinks(props?: ContactLinksProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `src/sample-data/contact.ts` — `CONTACT_LINKS` from 974-981 (email, phone, linkedin, resume, bluesky, steam, xbox; discord as `copy:'chase_22'`).
- [ ] **Step 2: Failing test** — interaction: render `<ContactLinks />`, click the discord copy button, assert `navigator.clipboard.writeText` called with `chase_22` and the button gets a `copied` class. Mock clipboard:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('copies on click for copy links', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ContactLinks />);
    await userEvent.click(screen.getByText('DISCORD').closest('button')!);
    expect(writeText).toHaveBeenCalledWith('chase_22');
  });
});
```
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `ContactLinks.module.css`** — port `.contact-links`/`.clink`/`button.clink`/`.copied` + responsive.
- [ ] **Step 5: `ContactLinks.tsx`** — grid; each link is an `<a>` (href) or a `<button>` (copy). Copy button: on click `navigator.clipboard?.writeText(copy)`, add `copied` class for 1500ms via `useState` + `setTimeout` (clear on unmount).
- [ ] **Step 6: Stories** `Default`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): ContactLinks component`.

---

### Task 20: FeedList (`content`)

**Source:** CSS `../index.html:477-499` (`.proj-feeds`, `.feeds-head/.id`, `.feed-link`, `.feed-meta/.feed-name/.feed-desc/.feed-go`); markup `856-879`.

**Files:** `src/components/content/FeedList/{...}`; `src/sample-data/feeds.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface Feed { name: string; description: React.ReactNode; href: string; }
export interface FeedListProps {
  heading?: string;      // default 'Live on Bluesky'
  badge?: string;        // default '3 FEEDS'
  feeds?: Feed[];        // defaults to FEEDS
  className?: string;
}
export function FeedList(props?: FeedListProps): JSX.Element;
```

- [ ] **Step 1: Create sample data** `src/sample-data/feeds.ts` — `FEEDS` from 858-878 (Louisville Football/Basketball, Alien: Earth, with their bsky URLs).
- [ ] **Step 2: Failing test** — render `<FeedList />`; assert heading `Live on Bluesky` and feed `Louisville Football` present, each feed an `<a>` with href.
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `FeedList.module.css`** — port the feeds rules.
- [ ] **Step 5: `FeedList.tsx`** — reproduce 856-879; head row (heading + badge), then one `.feed-link` `<a>` per feed.
- [ ] **Step 6: Stories** `Default`. `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): FeedList component`.

---

## Phase 4 — Features (`terminal`, `feature`)

### Task 21: BootLoader (`terminal`)

**Source:** CSS `../index.html:289-310` (`#loader`, `.boot-head`, `.boot-log` + line classes, `.boot-bottom`, `.boot-pct`, `.boot-bar`, `.skip`) + responsive `613-624`; behavior `1003-1068`; markup `658-670`.

**Files:** `src/components/terminal/BootLoader/{...}`; `src/sample-data/boot.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface BootLine { t: string; cls: 'ok' | 'warn' | 'info' | 'dim'; txt: string; }
export interface BootLoaderProps {
  lines?: BootLine[];        // defaults to BOOT_LINES
  title?: string;            // default 'chasecrawford.dev // boot sequence'
  onComplete?: () => void;   // fired when the sequence (or skip) finishes
  autoStart?: boolean;       // default true
  className?: string;
}
export function BootLoader(props?: BootLoaderProps): JSX.Element;
```

> React approach: port the line-reveal + percentage ramp from `step()`/`finish()` (1036-1060) into a `useEffect` driving `useState` for revealed-line count and percent. The skip button and Escape key jump to the end and call `onComplete`. Use `setTimeout`/`setInterval` cleaned up on unmount. Honor `prefers-reduced-motion` by revealing all lines immediately. Replace `Math.random()` ramp with a fixed step (e.g. +2/tick) to keep it deterministic and test-friendly.

- [ ] **Step 1: Create sample data** `src/sample-data/boot.ts` — `BOOT_LINES: BootLine[]` from 1016-1033 (drop the `[t]` into `t`, map `cls`).
- [ ] **Step 2: Failing test** — fake timers; render `<BootLoader onComplete={fn} />`, click `SKIP`, assert `onComplete` called and percent shows `100`.
```tsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BootLoader } from './BootLoader';

describe('BootLoader', () => {
  it('skip jumps to 100% and calls onComplete', async () => {
    const onComplete = vi.fn();
    render(<BootLoader onComplete={onComplete} autoStart={false} />);
    await userEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onComplete).toHaveBeenCalled();
    expect(screen.getByTestId('boot-pct').textContent).toBe('100');
  });
});
```
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: `BootLoader.module.css`** — port the loader rules + responsive; the `.gone` fade is optional (parent unmounts on complete).
- [ ] **Step 5: `BootLoader.tsx`** — implement the staged reveal + percent (`data-testid="boot-pct"` on the percent el, padded to 3 digits via `String(n).padStart(3,'0')`), progress bar width, skip button + Escape handler, `onComplete`.
- [ ] **Step 6: Stories** `Playing` (autoStart), `Static` (autoStart=false). `index.ts`.
- [ ] **Step 7: Wire barrel.** **Step 8: Verify.** **Step 9: Commit** `feat(ch4ze-ui): BootLoader component`.

---

### Task 22: DisconnectOverlay (`feature`)

**Source:** CSS `../index.html:87-101` (`#closeOverlay` + `.xtitle/.xmsg/.code/.xbtn` + `@keyframes fadein`); markup `648-656`; behavior `1519-1536`.

**Files:** `src/components/feature/DisconnectOverlay/{...}`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface DisconnectOverlayProps {
  open: boolean;
  onReconnect: () => void;
  className?: string;
}
export function DisconnectOverlay(props: DisconnectOverlayProps): JSX.Element | null;
```

- [ ] **Step 1: Failing test** — render `open`, assert `CONNECTION TERMINATED` visible; click `RECONNECT` → `onReconnect` called; press Enter → `onReconnect` called. When `open={false}` renders nothing.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: `DisconnectOverlay.module.css`** — port the overlay rules (use `.overlay` shown when open; reproduce the `.active` fade-in via always-on when rendered).
- [ ] **Step 4: `DisconnectOverlay.tsx`** — render `null` when `!open`; otherwise the overlay with title/message/reconnect button; `useEffect` adds a keydown listener for Enter/Escape → `onReconnect`; focus the button on open.
- [ ] **Step 5: Stories** `Open` (with a no-op onReconnect). `index.ts`.
- [ ] **Step 6: Wire barrel.** **Step 7: Verify.** **Step 8: Commit** `feat(ch4ze-ui): DisconnectOverlay component`.

---

### Task 23: Magic8Ball (`feature`)

**Source:** CSS `../index.html:111-286` (the full `.cc8*` block); markup `748-782`; behavior `1100-1233` (ASCII sphere `makeBall`, shake/settle, typeResp, reduced-motion path, ANSWERS).

**Files:** `src/components/feature/Magic8Ball/{...}`; `src/components/feature/Magic8Ball/makeBall.ts`; `src/components/feature/Magic8Ball/makeBall.test.ts`; `src/sample-data/answers.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
// makeBall.ts — pure, testable
export function makeBall(angle: number): string;
// Magic8Ball.tsx
export interface Magic8BallProps {
  answers?: string[];         // defaults to EIGHT_BALL_ANSWERS (20)
  meta?: string;              // default 'magic 8-ball · 20 answers'
  rng?: () => number;         // injectable for deterministic tests; default Math.random
  className?: string;
}
export function Magic8Ball(props?: Magic8BallProps): JSX.Element;
```

> React approach: `makeBall` is extracted verbatim (it's pure math) into `makeBall.ts` and unit-tested. The component holds `angle`, `shaking`, `answer`, `flipped`, `status` in state. Shake runs the same 900ms `requestAnimationFrame` loop updating `angle` → re-renders the `<pre>` text; on settle, picks `answers[Math.floor(rng()*len)]`, flips the medallion, and runs the `typeResp` typewriter via `setState` on a timer. `prefers-reduced-motion` skips the animation and shows the answer immediately (mirror 1220-1232). Clean up RAF/timers on unmount.

- [ ] **Step 1: Create sample data** `src/sample-data/answers.ts` — `EIGHT_BALL_ANSWERS: string[]` = the 20 strings from 1104-1112.
- [ ] **Step 2: Write the failing `makeBall` test**
```ts
import { describe, it, expect } from 'vitest';
import { makeBall } from './makeBall';

describe('makeBall', () => {
  it('renders a 25-row sphere of the expected width', () => {
    const out = makeBall(-2.35);
    const rows = out.split('\n');
    expect(rows.length).toBe(25);        // H = R*2+1 = 25
    expect(rows[0].length).toBe(47);     // W = COLS*2+1 = 47
  });
  it('is deterministic for a given angle', () => {
    expect(makeBall(1)).toBe(makeBall(1));
  });
});
```
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: Implement `makeBall.ts`** — port `RAMP`, `R`, `COLS`, `W`, `H`, `makeBall` verbatim from 1114-1137 as a typed pure function.
- [ ] **Step 5: Run `makeBall` test → PASS.** Run: `npm test -- makeBall`.
- [ ] **Step 6: Write the component failing test** — deterministic rng, no reduced-motion:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Magic8Ball } from './Magic8Ball';

describe('Magic8Ball', () => {
  it('shows an answer after shaking (reduced-motion fast path)', async () => {
    // jsdom matchMedia returns matches:false by default; stub reduced-motion = true
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} }) as never;
    render(<Magic8Ball rng={() => 0} />);   // index 0 → 'It is certain'
    await userEvent.click(screen.getByRole('button', { name: /shake/i }));
    expect(await screen.findByText(/It is certain/)).toBeInTheDocument();
  });
});
```
- [ ] **Step 7: Run → FAIL.**
- [ ] **Step 8: Implement `Magic8Ball.module.css`** — port the entire `.cc8*` block (111-286). Keep the reduced-motion media query.
- [ ] **Step 9: Implement `Magic8Ball.tsx`** — reproduce markup 748-782; wire shake/settle/typeResp + reduced-motion path with injectable `rng`. The shake button uses the `Button` primitive (variant primary) or the ported `.cc8-btn` style — reuse `Button` if visually identical, else keep `.cc8-btn`.
- [ ] **Step 10: Run component test → PASS.** Run: `npm test -- Magic8Ball`.
- [ ] **Step 11: Stories** `Idle`, `Answered` (force state via a story decorator or by passing `rng`), and a `ReducedMotion` note. `index.ts`.
- [ ] **Step 12: Wire barrel.** **Step 13: Verify build.** **Step 14: Commit** `feat(ch4ze-ui): Magic8Ball component`.

---

### Task 24: EquityChart (`feature`)

**Source:** CSS `../index.html:396-475` (the full `.equity-*`/`.proj-chart` block) + responsive `588-611`; markup `805-842`; behavior `1235-1453` (windowing `sliceByDays`, SVG path build, SPY benchmark, empty states, positions, formatters).

**Files:** `src/components/feature/EquityChart/{...}`; `src/components/feature/EquityChart/equityModel.ts`; `src/components/feature/EquityChart/equityModel.test.ts`; `src/sample-data/equity.ts`; modify `src/index.ts`.

**Interfaces:**
```ts
export interface EquitySnapshot { date: string; equity: number; spy_equity?: number; }
export interface EquityData {
  start_date?: string; positions?: string[]; snapshots: EquitySnapshot[];
}
// equityModel.ts — pure helpers
export function sliceByDays(snaps: EquitySnapshot[], days: number): EquitySnapshot[];
export interface ChartGeometry {
  linePts: string; areaD: string; refY: string; spyD: string | null;
  yMax: number; yMin: number; startEq: number; nowEq: number;
  xLabels: { i: number; label: string }[]; refPos: number; showRef: boolean;
}
export function buildGeometry(snaps: EquitySnapshot[]): ChartGeometry | null; // null when <2 points
// EquityChart.tsx
export interface EquityChartProps {
  data?: EquityData;          // defaults to bundled PAPER_EQUITY
  defaultDays?: 7 | 30;       // default 30 (matches commit 8d2b097)
  title?: string;             // default 'EMA trend-state strategy'
  className?: string;
}
export function EquityChart(props?: EquityChartProps): JSX.Element;
```

> React approach: extract the pure math (`sliceByDays`, geometry building from 1340-1419) into `equityModel.ts` and unit-test it. The component holds `days` in state, `useMemo`s the geometry, renders the SVG declaratively (`<line class=ref>`, `<path class=area|spy-line|line>`), the Y/X axis labels, footer stats, legend (shown only when SPY present), holdings, and the empty state (`<2` points). The 7D/30D toggle sets `days`. No fetch — `data` comes in as a prop (default bundled snapshot).

- [ ] **Step 1: Create sample data** `src/sample-data/equity.ts` — `import PAPER_EQUITY from '../../../json/paper-equity.json'` is cross-repo; instead **copy** the current `../../json/paper-equity.json` content into `src/sample-data/paper-equity.json` and `export { default as PAPER_EQUITY } from './paper-equity.json'` typed as `EquityData`. (Copy command in this step: `cp ../json/paper-equity.json src/sample-data/paper-equity.json`.)
- [ ] **Step 2: Write the failing `equityModel` test**
```ts
import { describe, it, expect } from 'vitest';
import { sliceByDays, buildGeometry } from './equityModel';

const snaps = [
  { date: '2026-06-01', equity: 5000 },
  { date: '2026-06-05', equity: 5100 },
  { date: '2026-06-08', equity: 5050 },
];

describe('equityModel', () => {
  it('sliceByDays keeps snapshots within N calendar days of the last', () => {
    expect(sliceByDays(snaps, 7).length).toBe(3);
    expect(sliceByDays(snaps, 4).map(s => s.date)).toEqual(['2026-06-05', '2026-06-08']);
  });
  it('buildGeometry returns null for <2 points', () => {
    expect(buildGeometry(snaps.slice(0, 1))).toBeNull();
  });
  it('buildGeometry produces a line path and bounds for >=2 points', () => {
    const g = buildGeometry(snaps)!;
    expect(g.linePts.startsWith('M')).toBe(true);
    expect(g.yMax).toBeGreaterThanOrEqual(5100);
    expect(g.startEq).toBe(5000);
    expect(g.nowEq).toBe(5050);
  });
});
```
- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: Implement `equityModel.ts`** — port `sliceByDays` (1278-1287) and the geometry math (W/H/padX/padY, `xAt`/`yAt`, `linePts`/`areaD`/`refY`, SPY path build, y-label values, x-label thinning at >8 points from 1404-1419) into `buildGeometry`. Include the `fmtUSD0/fmtUSD2/fmtDate` formatters (export them too).
- [ ] **Step 5: Run `equityModel` test → PASS.** Run: `npm test -- equityModel`.
- [ ] **Step 6: Write the component failing test**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { EquityChart } from './EquityChart';

const data = { start_date: '2026-06-01', positions: ['AAPL'], snapshots: [
  { date: '2026-06-01', equity: 5000 }, { date: '2026-06-02', equity: 5100 },
]};

describe('EquityChart', () => {
  it('renders the strategy title and toggles windows', async () => {
    render(<EquityChart data={data} />);
    expect(screen.getByText(/EMA trend-state strategy/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '7D' }));
    expect(screen.getByRole('button', { name: '7D' }).className).toMatch(/active/);
  });
  it('shows an empty state with a single snapshot', () => {
    render(<EquityChart data={{ snapshots: [{ date: '2026-06-01', equity: 5000 }] }} />);
    expect(screen.getByText(/awaiting/i)).toBeInTheDocument();
  });
});
```
- [ ] **Step 7: Run → FAIL.**
- [ ] **Step 8: Implement `EquityChart.module.css`** — port the whole `.equity-*`/`.proj-chart` block + responsive (588-611).
- [ ] **Step 9: Implement `EquityChart.tsx`** — reproduce markup 805-842 declaratively; `days` state (default `defaultDays=30`), `useMemo(buildGeometry(sliceByDays(...)))`, SVG with gradient `<defs>`, ref line/area/spy/line paths, Y/X labels, footer (open/close + since caption), legend (only when `spyD`), holdings list (Yahoo links), and the empty state when geometry is null.
- [ ] **Step 10: Run component test → PASS.** Run: `npm test -- EquityChart`.
- [ ] **Step 11: Stories** `Default` (bundled data), `SevenDay`, `EmptyOnePoint`. `index.ts`.
- [ ] **Step 12: Wire barrel.** **Step 13: Verify build.** **Step 14: Commit** `feat(ch4ze-ui): EquityChart component`.

---

## Phase 5 — Integration & sync-readiness

### Task 25: Barrel completeness, README, full build + verification

**Files:**
- Modify: `ch4ze-ui/src/index.ts` (ensure every component exported)
- Create: `ch4ze-ui/src/index.test.ts`
- Create: `ch4ze-ui/README.md`
- Create: `ch4ze-ui/src/components/_demo/FullPage.stories.tsx` (a composed page proving the parts assemble)

**Interfaces:**
- Consumes: every component from Tasks 4-24.
- Produces: a complete `window.Ch4zeUI` global; a green `dist/` ready for `/design-sync`.

- [ ] **Step 1: Write the barrel completeness test**
```ts
import { describe, it, expect } from 'vitest';
import * as UI from './index';

const expected = [
  'Shell','Window','WindowBody','TitleBar','StatusBar',
  'Prompt','Output','OutToken','Banner','Caret','BootLoader',
  'Button','Chip','Ticker',
  'KVList','Card','ExperienceTable','Gallery','ContactLinks','FeedList',
  'Magic8Ball','EquityChart','DisconnectOverlay',
];

describe('barrel', () => {
  it.each(expected)('exports %s', (name) => {
    expect(typeof (UI as Record<string, unknown>)[name]).toBe('function');
  });
});
```

- [ ] **Step 2: Run → FAIL** for any not-yet-exported names. Run: `npm test -- index`.

- [ ] **Step 3: Fix `src/index.ts`** — ensure an `export * from './components/<group>/<Name>';` line exists for all 23 component modules (21 components; `WindowBody`/`OutToken` ride along with `Window`/`Output`). Keep `import './styles.css';` at the top.

- [ ] **Step 4: Run → PASS.** Run: `npm test -- index`.

- [ ] **Step 5: Build a composed demo story** `src/components/_demo/FullPage.stories.tsx` — assemble `Shell > Window > [TitleBar, Ticker, WindowBody[Banner, Prompt+KVList, Prompt+Card grid (Card/EquityChart), Prompt+ExperienceTable, Prompt+Gallery, Prompt+ContactLinks], StatusBar]` plus a button toggling `DisconnectOverlay`. This is the visual proof the library reproduces the site. (No assertion test — it's a Storybook-only fidelity reference.)

- [ ] **Step 6: Write `README.md`** — a short consumer README: install, the `import { ... } from '@chasecrawford/ch4ze-ui'` usage, `import '@chasecrawford/ch4ze-ui/styles.css'`, and a one-paragraph note that styling is token-based (`var(--green)` etc.). (This is the body the design-sync conventions header later prepends to — keep it accurate.)

- [ ] **Step 7: Full verification gate**

Run each, all must pass:
- `npm run typecheck` → no errors.
- `npm test` → all suites pass.
- `npm run build` → `dist/ch4ze-ui.js`, `dist/ch4ze-ui.umd.cjs`, `dist/ch4ze-ui.css`, `dist/index.d.ts` exist.
- `npm run build-storybook` → builds clean.
- Global check: `node -e "const m=require('./dist/ch4ze-ui.umd.cjs'); ['Shell','Magic8Ball','EquityChart','Card'].forEach(n=>{if(typeof m[n]!=='function')throw new Error('missing '+n)}); console.log('Ch4zeUI complete')"` → prints `Ch4zeUI complete`.
- CSS reachability: confirm `dist/ch4ze-ui.css` contains `--green:` (tokens) and a ported component class (e.g. an equity or proj class).

- [ ] **Step 8: Commit**
```bash
git add ch4ze-ui/src/index.ts ch4ze-ui/src/index.test.ts ch4ze-ui/README.md ch4ze-ui/src/components/_demo
git commit -m "feat(ch4ze-ui): complete barrel, composed demo, README; sync-ready build"
```

---

## Done criteria (whole plan)

- All 21 components implemented (23 named exports incl. `WindowBody`, `OutToken`), each with a Storybook story and a passing test; behavior components (`Magic8Ball`, `EquityChart`, `BootLoader`, `StatusBar` clock, `ContactLinks` copy, `DisconnectOverlay`) have interaction/unit tests.
- `npm run typecheck`, `npm test`, `npm run build`, `npm run build-storybook` all green.
- `dist/` exposes `window.Ch4zeUI.*` and a `ch4ze-ui.css` whose tokens + component styles are present.
- No hard-coded colors in component CSS; tokens reachable from `styles.css`.
- The composed `FullPage` story visually matches `index.html`.
- **Next step (separate, not in this plan):** run `/design-sync` against `ch4ze-ui/`.
