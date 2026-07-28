# Blackjack Coach — project card + tester opt-in page

**Date:** 2026-07-28
**Status:** approved

## Problem

Blackjack Coach is an Android app in Google Play closed testing. Play will not let it go
public until **12 testers stay opted in for 14 consecutive days**. Recruiting those testers
currently means explaining a multi-step opt-in flow over text, one person at a time.

Two deliverables:

1. Add the app to the projects section of `chasecrawford.dev` alongside the existing OSS work.
2. Ship a standalone page at `/blackjack-coach/` that can be sent to a prospective tester as
   a single link and walks them from zero to installed without further help.

## What the app actually is

Facts sourced from the app repo (`../blackjack-coach/CLAUDE.md`, `store/listing.md`,
`package.json`) — implementation must not contradict these.

- React 18 + Vite, **no backend**; all state in `localStorage` under `bjcoach.*`.
- Ships as an installable PWA, packaged for Play as a **TWA built with Bubblewrap**.
  Bubblewrap wraps the *web* app — it is not React Native.
- Hosted on **Cloudflare Pages**; canonical URL `https://blackjack.chasecrawford.dev`.
- Package name `dev.chasecrawford.blackjack.twa`.
- `getCorrectPlay()` in `src/engine/strategy.js` is the single source of truth for basic
  strategy; the coach, the chart, and the stats all derive from it.
- Play money only. No ads, no in-app purchases, no real-money gambling. Works offline.
- Feedback channel: **Settings tab → "Send feedback"** (`SettingsScreen.jsx:73`), which
  relays to email via Web3Forms.
- The app repo is **private**. Existing project cards are all public/OSS.

### Consequence of being a TWA

Web content updates reach installed testers on next launch via Cloudflare deploy — no Play
update prompt. Only changes baked into the APK require a new rollout. The tester page must
say this, or testers read silence as abandonment.

## Constraints from the existing site

- The live site is one hand-written `index.html`. No build step, no framework. `ch4ze-ui/` is
  a mirrored component library and does **not** ship. Edit `index.html` directly.
- `.projects` is a 2-column grid where each project ships as a **pair**: a `.proj-detail`
  description card plus a live companion card (`#equityCard`, `.proj-feeds`). A lone third
  card leaves a hole in the grid.
- Cards currently carry an `OSS` badge, and the section header reads `total 2 · open source`.
  Blackjack Coach is closed-source and in beta; both must change to stay honest.
- Sub-pages are served as directories (precedent: `resume.pdf/index.html`). GitHub Pages,
  `.nojekyll` present.
- **The publisher brand "Sea Cow Company" must not appear anywhere on chasecrawford.dev.**
  The app's own artwork (which features a manatee) is fine; the company name is not.

## Assets

Copied from the app repo into `images/`. The site repo must be self-contained.

| Source | Destination | Size | Use |
|---|---|---|---|
| `store/feature-graphic.png` (1024×500) | `images/bjc-og.png` | 357 KB | Open Graph / Twitter card image |
| `store/screenshots/ss-play.png` (470×932) | `images/bjc-play.png` | 300 KB | Tester page screenshot |
| `store/screenshots/ss-coach.png` (470×932) | `images/bjc-coach.png` | 148 KB | Tester page screenshot |
| `public/icons/icon-192.png` (192×192) | `images/bjc-icon.png` | — | Tester page header icon |

~800 KB added, all below the fold or lazily loaded except the icon. Acceptable for a static
site; revisit only if it measurably hurts load.

## Section A — project card 003

A `.proj-detail` card, third in the `.projects` grid. `href` points at the **live web app**
(`https://blackjack.chasecrawford.dev/`), not GitHub — the repo is private. The beta ask
lives in the companion card, not here.

- **Head:** `003` / `ANDROID · TWA`
- **Name:** `blackjack-coach`
- **Desc:** Blackjack trainer that grades you while you play. Deal real hands at a 6-deck
  Vegas table, then a coach reviews every decision against basic strategy and names the
  correct play — *"you hit; basic strategy says stand 14 vs dealer 5."* Ships with a
  generated strategy chart, accuracy stats, and a hand log. Play money only, no ads, works
  offline.
- **Stack:** `REACT` `VITE` `PWA` `BUBBLEWRAP TWA` `CLOUDFLARE PAGES`
- **Stats:** `blackjack.chasecrawford.dev` · `dev.chasecrawford.blackjack.twa`
- **Goal:** Turn basic strategy into muscle memory — hands get graded in the moment instead
  of at the table. One engine call, `getCorrectPlay()`, feeds the coach, the chart, and your
  stats, so the app can never grade you against a rule it doesn't also show you.

### Counter lines to update

- Section header: `total 2 · open source` → `total 3 · 2 open source · 1 in closed beta`
- Boot sequence (`index.html` ~line 1026):
  `mount /home/chase/projects (2 entries · open source)` → `(3 entries)`

## Section B — beta companion card

Sibling of card 003 in the grid, styled off `.proj-chart` (non-link container, `cursor:default`,
no hover lift) with an explicit CTA anchor inside pointing at `/blackjack-coach/`.

- **Head:** `CLOSED BETA` / `ANDROID`
- **Status row:** `● recruiting testers`
- **Name:** Needs 12 testers
- **Body:** Google Play won't let a new app go public until 12 people have been opted into
  the beta for 14 straight days. Android phone + two minutes and you're one of them.
- **Steps:** `01` Join the testers group · `02` Opt in on Google Play · `03` Install it,
  leave it installed
- **CTA:** `HOW TO JOIN THE BETA →`
- **Footnote:** Not on Android? Play it in any browser: `blackjack.chasecrawford.dev`

## Section C — tester page at `/blackjack-coach/`

New file `blackjack-coach/index.html`. Self-contained: inline CSS, no shared stylesheet, no
JS required for the page to function. Reuses the site's tokens (green `#00ff88`, cyan accent,
dark ground, monospace) and terminal window chrome as a **frame only** — the content inside is
plain, large, and tappable, with no simulated shell prompts. Single column, mobile-first;
audience is non-technical people opening a texted link on a phone.

### Head

- `<title>` — Join the Blackjack Coach beta — chasecrawford.dev
- Meta description, canonical, and **Open Graph + Twitter card** tags using
  `https://chasecrawford.dev/images/bjc-og.png` (absolute URL required). This page's entire
  purpose is being pasted into texts, Discord, and Reddit; it must preview as a card.
- Indexable (no `noindex`) — organic tester discovery is upside.

### Body order

1. **Header** — `images/bjc-icon.png`, `Blackjack Coach`, `Android · closed beta`, and the
   two screenshots (`bjc-play.png`, `bjc-coach.png`) side by side.
2. **What you'd be testing** — "A free blackjack trainer. Realistic 6-deck table, and after
   every hand a coach tells you whether your play matched basic strategy. No real money, no
   ads, no purchases, works offline."
3. **Before you start** — warning callout: "You'll need an **Android phone** and a **Gmail
   address**. Use the *same* Gmail that's signed into the Play Store on that phone — this is
   the #1 reason people get stuck at step 3."
4. **Step 01 — Join the testers group.** "Sign in with your Gmail and join. It's a plain
   Google Group; I use it only as the tester list."
   → `JOIN THE GROUP →` → `https://groups.google.com/g/blackjack-coach-testers`
   (derived from the group address `blackjack-coach-testers@googlegroups.com`; **Chase to
   confirm this join URL loads before ship** — a wrong slug here breaks the whole funnel).
   The group address is also shown as plain text on the page so a tester can search it
   manually if the link fails.
5. **Step 02 — Opt in to the test.** "Open this on the phone you'll install on and tap
   *Become a tester*. You have to do this before Google will show you the app at all."
   → `OPT IN ON GOOGLE PLAY →` → `https://play.google.com/apps/testing/dev.chasecrawford.blackjack.twa`
6. **Step 03 — Install it.** "Once you're a tester, the Play Store page works normally. Tap
   Install." → `OPEN IN PLAY STORE →` →
   `https://play.google.com/store/apps/details?id=dev.chasecrawford.blackjack.twa`
7. **Then: play it now and then** — "Google counts 12 testers who stay opted in for **14
   straight days** — and when I apply to launch, they ask how much testers actually used the
   app. So two asks:" followed by two bullets — (a) "Leave it installed the full two weeks.
   Uninstalling or leaving the group resets the clock for everyone." (b) "Open it every couple
   of days and play a few hands. If you can, poke at all four tabs at least once — Table,
   Chart, Stats, and Settings." Closing line: "Ten minutes total across two weeks covers it."

   **Why this wording** (revised 2026-07-28 after the initial build): Play has *two* gates and
   they measure different things. The automated 12-tester counter is opt-in only —
   [Google's requirements page](https://support.google.com/googleplay/android-developer/answer/14151465)
   says "a minimum of 12 testers who have been opted-in for at least the last 14 days
   continuously," with no activity condition. But the **production access application** asks
   the developer to "provide information about the engagement you received from testers,"
   explicitly including "whether testers used all of your app's features," and to "summarize
   the feedback that you received from testers, and let us know how you collected this
   feedback." Idle installs satisfy the counter and sink the application. Naming the four tabs
   maps onto the "all of your app's features" question; pointing testers at the in-app **Send
   feedback** button supplies the "how you collected this feedback" answer.
8. **Found a bug?** — "Settings tab → **Send feedback**. It comes straight to me."
9. **Stuck?** — three fixes:
   - *App says "not available"* — wrong Google account, or the opt-in hasn't propagated; wait
     a few minutes and retry on the same Gmail.
   - *No update showing?* — updates ship silently on next launch; there's usually no Play
     update prompt.
   - *On an iPhone?* — can't test the Android build, but the browser version works:
     `blackjack.chasecrawford.dev`.
10. **Footer** — `← chasecrawford.dev` · privacy policy
    (`https://blackjack.chasecrawford.dev/privacy`).

### Accessibility / responsive requirements

- Tap targets ≥ 44px tall; buttons full-width on narrow screens.
- Screenshots stack vertically below ~520px, `max-width:100%`.
- Real `<a>` elements for every CTA (no JS-driven navigation).
- `alt` text on all images.

## Out of scope

- No live data, counters, or tester-count widget. Nothing on either page needs a backend.
- No changes to `ch4ze-ui/` — it mirrors the live site but does not ship it. Porting the new
  card into the component library is a separate task if wanted later.
- No changes to the app repo itself.

## Verification

- Serve the repo locally; confirm the projects grid renders 3 pairs with no orphaned cell at
  desktop width and stacks correctly under the 640px breakpoint (`.projects{grid-template-columns:1fr}`).
- Load `/blackjack-coach/` at ~390px and ~1440px wide.
- Confirm all five outbound links resolve: group, opt-in, store listing, web app, privacy.
- Confirm the OG image path resolves at its absolute URL after deploy.

## Notes

Pushing requires switching the `gh` account to `chasecrawford` (the default
`ccrawfordhatfield` gets a 403); pull with `--rebase` first.
