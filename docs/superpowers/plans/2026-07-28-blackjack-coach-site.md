# Blackjack Coach Site Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Blackjack Coach to the chasecrawford.dev projects grid and ship a shareable `/blackjack-coach/` page that walks a prospective Play beta tester from zero to installed.

**Architecture:** Two hand-edited static HTML files. `index.html` gains a third `.proj-detail` card plus a companion "closed beta" card so the 2-column grid stays paired. `blackjack-coach/index.html` is a new standalone page modeled structurally on `404.html` (self-contained inline `<style>`, GTM snippet, same design tokens) using the site's terminal window chrome as a frame around plain, tappable step blocks.

**Tech Stack:** Hand-written HTML5 + inline CSS. No build step, no framework, no JS required for either change. GitHub Pages, `.nojekyll`.

## Global Constraints

- **Never mention "Sea Cow Company"** anywhere on chasecrawford.dev. The app's manatee artwork is fine; the publisher name is not.
- The live site is `index.html` at the repo root. `ch4ze-ui/` is a mirrored component library that does **not** ship — do not modify it.
- Design tokens, copied verbatim: `--bg:#0a0a0a` `--bg2:#0f0f0f` `--ink:#d8e4d8` `--ink2:#8a9d8a` `--line:#1d2a1d` `--green:#00ff88` `--cyan:#00d4ff` `--yellow:#ffd60a` `--red:#ff5c5c`.
- Font is `'JetBrains Mono', ui-monospace, monospace` loaded from Google Fonts.
- The GTM container ID is `GTM-TMFW9FK`. Every page carries both the `<head>` script and the `<body>` `<noscript>` block.
- `blackjack-coach/index.html` lives one directory deep, so **every internal path must be root-absolute** (`/images/...`, `/`), never relative. `404.html` uses relative paths; do not copy that part.
- Package name is `dev.chasecrawford.blackjack.twa`. Canonical web app URL is `https://blackjack.chasecrawford.dev`.
- The app repo is **private** — never link to a GitHub repo for this project.
- All copy is pre-approved in `docs/superpowers/specs/2026-07-28-blackjack-coach-site-design.md`. Reproduce it exactly; do not improvise new marketing copy.

---

### Task 1: Copy app assets into the site repo

The site repo must be self-contained — GitHub Pages serves only this repo, so referencing the sibling app repo would 404 in production.

**Files:**
- Create: `images/bjc-og.png`, `images/bjc-play.png`, `images/bjc-coach.png`, `images/bjc-icon.png`
- Source: `../blackjack-coach/store/` and `../blackjack-coach/public/icons/`

**Interfaces:**
- Produces: four image paths consumed by Task 2 (`/images/bjc-og.png`, `/images/bjc-play.png`, `/images/bjc-coach.png`, `/images/bjc-icon.png`).

- [ ] **Step 1: Copy the four assets**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
cp ../blackjack-coach/store/feature-graphic.png       images/bjc-og.png
cp ../blackjack-coach/store/screenshots/ss-play.png   images/bjc-play.png
cp ../blackjack-coach/store/screenshots/ss-coach.png  images/bjc-coach.png
cp ../blackjack-coach/public/icons/icon-192.png       images/bjc-icon.png
```

- [ ] **Step 2: Verify all four exist with the expected dimensions**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
for f in images/bjc-og.png images/bjc-play.png images/bjc-coach.png images/bjc-icon.png; do
  printf "%s " "$f"
  python -c "
import struct,sys
d=open(sys.argv[1],'rb').read(33)
print('%dx%d' % struct.unpack('>II', d[16:24]))" "$f"
done
```

Expected, exactly:
```
images/bjc-og.png 1024x500
images/bjc-play.png 470x932
images/bjc-coach.png 470x932
images/bjc-icon.png 192x192
```

If any line is missing or the dimensions differ, the wrong source file was copied — stop and re-check the source paths before continuing.

- [ ] **Step 3: Commit**

```bash
git add images/bjc-og.png images/bjc-play.png images/bjc-coach.png images/bjc-icon.png
git commit -m "chore(site): add Blackjack Coach icon, screenshots, and OG image"
```

---

### Task 2: Build the tester opt-in page

The page a prospective tester receives as a link. Non-technical audience, phone-first. Terminal chrome is a frame only — no simulated shell prompts inside.

**Files:**
- Create: `blackjack-coach/index.html`

**Interfaces:**
- Consumes: the four image paths from Task 1.
- Produces: the URL path `/blackjack-coach/`, which Task 3's companion-card CTA links to.

- [ ] **Step 1: Create `blackjack-coach/index.html` with this exact content**

```html
<!doctype html>
<html lang="en">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TMFW9FK');</script>
<!-- End Google Tag Manager -->
<meta charset="utf-8"/>
<title>Join the Blackjack Coach beta — chasecrawford.dev</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="description" content="Blackjack Coach is in closed testing on Google Play. Three steps, about two minutes: join the testers group, opt in, install.">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="https://chasecrawford.dev/blackjack-coach/">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">

<!-- Open Graph / Twitter — this page exists to be pasted into texts and chat,
     so it must preview as a card rather than a naked URL. -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://chasecrawford.dev/blackjack-coach/">
<meta property="og:title" content="Join the Blackjack Coach beta">
<meta property="og:description" content="A free blackjack trainer that grades every hand you play. Android closed beta — three steps, about two minutes.">
<meta property="og:image" content="https://chasecrawford.dev/images/bjc-og.png">
<meta property="og:image:width" content="1024">
<meta property="og:image:height" content="500">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Join the Blackjack Coach beta">
<meta name="twitter:description" content="A free blackjack trainer that grades every hand you play. Android closed beta — three steps, about two minutes.">
<meta name="twitter:image" content="https://chasecrawford.dev/images/bjc-og.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0a0a0a;
    --bg2:#0f0f0f;
    --ink:#d8e4d8;
    --ink2:#8a9d8a;
    --line:#1d2a1d;
    --green:#00ff88;
    --cyan:#00d4ff;
    --yellow:#ffd60a;
    --red:#ff5c5c;
  }
  *,*::before,*::after{box-sizing:border-box}
  html,body{
    margin:0;padding:0;background:var(--bg);color:var(--ink);
    font-family:'JetBrains Mono',ui-monospace,monospace;
    font-size:14px;line-height:1.65;overflow-x:hidden;
    -webkit-text-size-adjust:100%;
  }
  a{color:var(--cyan);text-decoration:none;border-bottom:1px dashed transparent}
  a:hover{border-bottom-color:var(--cyan)}
  ::selection{background:var(--green);color:#000}
  img{max-width:100%;height:auto;display:block}

  /* ============ CRT shell + window chrome (frame only) ============ */
  .shell{
    min-height:100vh;padding:12px;
    background:
      linear-gradient(180deg, transparent 50%, rgba(0,255,136,.015) 50%),
      var(--bg);
    background-size:100% 4px, 100% 100%;
  }
  .window{
    border:1px solid var(--line);background:var(--bg2);
    box-shadow:0 0 0 1px #000 inset, 0 40px 80px -40px rgba(0,255,136,.08);
    max-width:760px;margin-inline:auto;width:100%;
    display:flex;flex-direction:column;
  }
  .titlebar{
    display:flex;align-items:center;gap:12px;
    padding:0 14px;border-bottom:1px solid var(--line);
    background:#060606;min-height:34px;
    font-size:11px;letter-spacing:.14em;color:var(--ink2);text-transform:uppercase;
  }
  .tb-dots{display:flex;gap:6px;flex:0 0 auto}
  .tb-dots i{width:9px;height:9px;border-radius:50%;background:var(--line);display:block}
  .tb-dots i:first-child{background:#3a2020}
  .tb-center{flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tb-right{flex:0 0 auto}
  .tb-right a{color:var(--ink2);font-size:11px;letter-spacing:.14em}
  .tb-right a:hover{color:var(--green);border-bottom-color:transparent}

  .body{padding:24px 20px 28px}

  /* ============ hero ============ */
  .hero{display:flex;align-items:center;gap:16px;margin-bottom:18px}
  .hero img{
    width:72px;height:72px;flex:0 0 auto;
    border:1px solid var(--line);border-radius:14px;
  }
  .hero h1{
    margin:0;font-size:24px;line-height:1.2;font-weight:800;
    color:var(--ink);letter-spacing:.01em;
  }
  .hero .kicker{
    margin:6px 0 0;color:var(--green);font-size:11px;
    letter-spacing:.22em;text-transform:uppercase;
  }
  .lede{color:var(--ink2);margin:0 0 20px;font-size:14px}
  .lede b{color:var(--ink);font-weight:700}

  /* ============ screenshots ============ */
  .shots{display:flex;gap:12px;margin:0 0 24px}
  .shots figure{margin:0;flex:1;min-width:0}
  .shots img{border:1px solid var(--line);width:100%}
  .shots figcaption{
    margin-top:8px;color:var(--ink2);font-size:11px;
    letter-spacing:.12em;text-transform:uppercase;text-align:center;
  }

  /* ============ callouts ============ */
  .callout{
    border:1px solid var(--line);border-left:2px solid var(--yellow);
    background:rgba(255,214,10,.04);
    padding:14px 16px;margin:0 0 24px;font-size:13px;line-height:1.6;
  }
  .callout .label{
    color:var(--yellow);font-size:11px;letter-spacing:.18em;
    text-transform:uppercase;margin-bottom:6px;display:block;
  }
  .callout b{color:var(--ink);font-weight:700}
  .callout.ask{border-left-color:var(--green);background:rgba(0,255,136,.04)}
  .callout.ask .label{color:var(--green)}

  /* ============ steps ============ */
  .steps{list-style:none;margin:0 0 24px;padding:0;display:flex;flex-direction:column;gap:14px}
  .step{border:1px solid var(--line);background:rgba(0,255,136,.02);padding:18px 16px}
  .step .num{
    color:var(--cyan);font-size:11px;letter-spacing:.22em;
    text-transform:uppercase;display:block;margin-bottom:6px;
  }
  .step h2{margin:0 0 8px;font-size:17px;font-weight:700;color:var(--ink);line-height:1.3}
  .step p{margin:0 0 14px;color:var(--ink2);font-size:13px}
  .step p b{color:var(--ink);font-weight:700}
  .step .aside{margin:12px 0 0;font-size:12px;opacity:.85}
  .step .aside code{color:var(--cyan);font-size:12px;word-break:break-all}

  .btn{
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    width:100%;min-height:52px;padding:14px 18px;
    border:1px solid var(--green);background:rgba(0,255,136,.08);
    color:var(--green);font-family:inherit;font-size:13px;font-weight:700;
    letter-spacing:.16em;text-transform:uppercase;
    transition:all .15s;
  }
  .btn:hover{background:var(--green);color:#000;box-shadow:0 0 16px rgba(0,255,136,.35);border-bottom-color:var(--green)}
  .btn .arr{font-size:16px}

  /* ============ generic block + faq ============ */
  .block{margin:0 0 24px}
  .block h2, .faq h2{
    margin:0 0 8px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;
    color:var(--ink2);font-weight:400;
  }
  .block p{margin:0;color:var(--ink2);font-size:13px}
  .block p b{color:var(--ink);font-weight:700}

  .faq{margin:0 0 8px}
  .faq details{border-top:1px dashed var(--line);padding:12px 0}
  .faq details:last-of-type{border-bottom:1px dashed var(--line)}
  .faq summary{
    cursor:pointer;color:var(--ink);font-size:13px;font-weight:700;
    list-style:none;display:flex;justify-content:space-between;gap:12px;
  }
  .faq summary::-webkit-details-marker{display:none}
  .faq summary::after{content:'+';color:var(--cyan);font-weight:400}
  .faq details[open] summary::after{content:'−'}
  .faq details p{margin:10px 0 0;color:var(--ink2);font-size:13px}

  /* ============ statusbar ============ */
  .statusbar{
    border-top:1px solid var(--line);background:#060606;
    padding:10px 14px;display:flex;justify-content:space-between;gap:12px;
    font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2);
  }
  .statusbar a{color:var(--ink2)}
  .statusbar a:hover{color:var(--green);border-bottom-color:transparent}

  @media (max-width:520px){
    .body{padding:20px 14px 24px}
    .hero{gap:12px}
    .hero img{width:60px;height:60px}
    .hero h1{font-size:20px}
    .shots{flex-direction:column;gap:16px;max-width:280px;margin-inline:auto}
    .btn{font-size:12px;letter-spacing:.12em;padding:14px}
    .statusbar{letter-spacing:.06em}
  }
</style>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TMFW9FK"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div class="shell">
  <div class="window">

    <div class="titlebar">
      <span class="tb-dots"><i></i><i></i><i></i></span>
      <span class="tb-center">blackjack-coach — closed beta</span>
      <span class="tb-right"><a href="/">chasecrawford.dev</a></span>
    </div>

    <main class="body">

      <header class="hero">
        <img src="/images/bjc-icon.png" alt="Blackjack Coach app icon" width="192" height="192">
        <div>
          <h1>Blackjack Coach</h1>
          <p class="kicker">Android · closed beta</p>
        </div>
      </header>

      <p class="lede">A free blackjack trainer. Realistic 6-deck table, and after every hand a coach tells you whether your play matched basic strategy. <b>No real money, no ads, no purchases, works offline.</b></p>

      <div class="shots">
        <figure>
          <img src="/images/bjc-play.png" alt="Blackjack Coach table screen: dealer showing a 5, player holding 4 and Queen for 14, with Hit, Stand and Double buttons." width="470" height="932" loading="lazy">
          <figcaption>Play a hand</figcaption>
        </figure>
        <figure>
          <img src="/images/bjc-coach.png" alt="Coach Review panel reading: you hit — basic strategy says stand 14 vs dealer 5." width="470" height="932" loading="lazy">
          <figcaption>Coach reviews it</figcaption>
        </figure>
      </div>

      <section class="callout">
        <span class="label">Before you start</span>
        You'll need an <b>Android phone</b> and a <b>Gmail address</b>. Use the <b>same</b> Gmail that's signed into the Play Store on that phone — this is the #1 reason people get stuck at step 3.
      </section>

      <ol class="steps">
        <li class="step">
          <span class="num">Step 01</span>
          <h2>Join the testers group</h2>
          <p>Sign in with your Gmail and join. It's a plain Google Group; I use it only as the tester list.</p>
          <a class="btn" href="https://groups.google.com/g/blackjack-coach-testers" target="_blank" rel="noopener">
            <span>Join the group</span><span class="arr">&rarr;</span>
          </a>
          <p class="aside">Link not working? Search Google Groups for <code>blackjack-coach-testers@googlegroups.com</code>.</p>
        </li>

        <li class="step">
          <span class="num">Step 02</span>
          <h2>Opt in to the test</h2>
          <p>Open this on the phone you'll install on and tap <b>Become a tester</b>. You have to do this before Google will show you the app at all.</p>
          <a class="btn" href="https://play.google.com/apps/testing/dev.chasecrawford.blackjack.twa" target="_blank" rel="noopener">
            <span>Opt in on Google Play</span><span class="arr">&rarr;</span>
          </a>
        </li>

        <li class="step">
          <span class="num">Step 03</span>
          <h2>Install it</h2>
          <p>Once you're a tester, the Play Store page works normally. Tap Install.</p>
          <a class="btn" href="https://play.google.com/store/apps/details?id=dev.chasecrawford.blackjack.twa" target="_blank" rel="noopener">
            <span>Open in Play Store</span><span class="arr">&rarr;</span>
          </a>
        </li>
      </ol>

      <section class="callout ask">
        <span class="label">Then: leave it installed</span>
        Google counts 12 testers who stay opted in for <b>14 straight days</b>. Uninstalling or leaving the group resets the clock for everyone, so please leave it on your phone for two weeks. Play it or don't — that part's up to you.
      </section>

      <section class="block">
        <h2>Found a bug?</h2>
        <p>Settings tab → <b>Send feedback</b>. It comes straight to me.</p>
      </section>

      <section class="faq">
        <h2>Stuck?</h2>
        <details>
          <summary>Play says the app isn't available</summary>
          <p>Almost always the wrong Google account, or the opt-in hasn't propagated yet. Check that the Play Store on your phone is signed in with the same Gmail you used in step 1, then wait a few minutes and retry.</p>
        </details>
        <details>
          <summary>There's never an update to install</summary>
          <p>That's expected. Most updates ship silently and are live the next time you open the app — there's usually no Play Store update prompt.</p>
        </details>
        <details>
          <summary>I'm on an iPhone</summary>
          <p>Then you can't test the Android build, unfortunately. The browser version works on any phone though: <a href="https://blackjack.chasecrawford.dev" target="_blank" rel="noopener">blackjack.chasecrawford.dev</a></p>
        </details>
      </section>

    </main>

    <div class="statusbar">
      <a href="/">&larr; chasecrawford.dev</a>
      <a href="https://blackjack.chasecrawford.dev/privacy" target="_blank" rel="noopener">Privacy</a>
    </div>

  </div>
</div>
</body>
</html>
```

- [ ] **Step 2: Serve the site and confirm the page returns 200 with no missing assets**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
python -m http.server 8765 &
sleep 2
curl -s -o /dev/null -w "page:%{http_code}\n" http://localhost:8765/blackjack-coach/
for f in bjc-icon bjc-play bjc-coach bjc-og; do
  curl -s -o /dev/null -w "$f:%{http_code}\n" "http://localhost:8765/images/$f.png"
done
curl -s -o /dev/null -w "favicon:%{http_code}\n" http://localhost:8765/images/favicon.svg
```

Expected: every line reports `200`. A `404` on an image means a path is relative instead of root-absolute, or Task 1 didn't run.

- [ ] **Step 3: Screenshot at phone and desktop width**

Use the Playwright MCP browser tools:
1. `browser_resize` to 390 × 844, `browser_navigate` to `http://localhost:8765/blackjack-coach/`, `browser_take_screenshot`.
2. `browser_resize` to 1440 × 900, `browser_take_screenshot`.

Confirm by eye:
- No horizontal scrollbar at 390px.
- Screenshots stack vertically at 390px and sit side by side at 1440px.
- All three green buttons are full-width and at least ~52px tall.
- The window is centered and capped at 760px on desktop, not stretched edge to edge.

- [ ] **Step 4: Commit**

```bash
git add blackjack-coach/index.html
git commit -m "feat(site): add /blackjack-coach/ beta tester opt-in page"
```

---

### Task 3: Add project card 003 and the beta companion card

**Files:**
- Modify: `index.html` — insert CSS after line 504 (end of the `.feed-link` block, before the `/* ============ experience table ============ */` comment)
- Modify: `index.html` — insert markup after the closing `</div>` of `.proj-feeds` (~line 885), still inside `.projects`
- Modify: `index.html:796` — the `total 2 · open source` line
- Modify: `index.html:1026` — the boot-sequence projects line

**Interfaces:**
- Consumes: `/blackjack-coach/` from Task 2 (the companion card's CTA target).
- Produces: no downstream consumers; this is the last content change.

- [ ] **Step 1: Add the CSS for the beta companion card**

Insert immediately after line 504 (`.feed-link .feed-go{...}`) and before the blank line preceding `/* ============ experience table ============ */`:

```css

  /* beta pairing — sits next to blackjack-coach the way the equity chart sits
     next to bot-trader. Container is a non-interactive grid cell; the CTA
     anchor inside carries the hover treatment. */
  .proj-beta{display:flex;flex-direction:column;cursor:default}
  .proj-beta:hover{border-color:var(--line);background:rgba(0,255,136,.02)}
  .proj-beta .beta-status{
    display:flex;align-items:center;gap:8px;
    color:var(--yellow);font-size:12px;letter-spacing:.12em;
    text-transform:uppercase;margin-bottom:10px;
  }
  .proj-beta .beta-status .dot{
    width:7px;height:7px;border-radius:50%;background:var(--yellow);
    box-shadow:0 0 8px rgba(255,214,10,.6);flex:0 0 auto;
  }
  .proj-beta .beta-steps{
    list-style:none;margin:0 0 16px;padding:0;
    display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--ink);
  }
  .proj-beta .beta-steps li{display:flex;gap:10px}
  .proj-beta .beta-steps .n{color:var(--cyan);flex:0 0 auto}
  .beta-cta{
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    margin-top:auto;padding:14px 16px;
    border:1px solid var(--green);background:rgba(0,255,136,.08);
    color:var(--green);font-size:13px;font-weight:700;
    letter-spacing:.16em;text-transform:uppercase;
    transition:all .15s;
  }
  .beta-cta:hover{background:var(--green);color:#000;box-shadow:0 0 16px rgba(0,255,136,.35);border-bottom-color:var(--green)}
  .proj-beta .beta-alt{
    margin:12px 0 0;font-size:12px;color:var(--ink2);line-height:1.5;
  }
```

- [ ] **Step 2: Add the two cards to the projects grid**

Insert after the `</div>` that closes `.proj-feeds` (~line 885) and before the `</div>` that closes `.projects` (~line 886):

```html

        <a class="proj proj-detail" href="https://blackjack.chasecrawford.dev/" target="_blank" rel="noopener">
          <div class="proj-head"><span class="id">003</span><span>ANDROID &middot; TWA</span></div>
          <div class="proj-name"><span class="nm">blackjack-coach</span><span class="proj-go">&rarr;</span></div>
          <div class="proj-desc">Blackjack trainer that grades you while you play. Deal real hands at a 6&#8209;deck Vegas table, then a coach reviews every decision against basic strategy and names the correct play &mdash; <i>"you hit; basic strategy says stand 14 vs dealer 5."</i> Ships with a generated strategy chart, accuracy stats, and a hand log. Play money only, no ads, works offline.</div>
          <div class="proj-stack"><span>REACT</span><span>VITE</span><span>PWA</span><span>BUBBLEWRAP TWA</span><span>CLOUDFLARE PAGES</span></div>
          <div class="proj-stats"><div>blackjack.chasecrawford.dev</div><div>dev.chasecrawford.blackjack.twa</div></div>
          <div class="proj-thesis">
            <div class="thesis-label">Goal</div>
            Turn basic strategy into muscle memory &mdash; hands get graded in the moment instead of at the table. One engine call, <code>getCorrectPlay()</code>, feeds the coach, the chart, and your stats, so the app can never grade you against a rule it doesn't also show you.
          </div>
        </a>

        <div class="proj proj-beta" aria-label="Blackjack Coach closed beta — how to join">
          <div class="proj-head"><span class="id">Closed Beta</span><span>ANDROID</span></div>
          <div class="beta-status"><span class="dot"></span>recruiting testers</div>
          <div class="proj-name"><span class="nm">Needs 12 testers</span></div>
          <div class="proj-desc">Google Play won't let a new app go public until 12 people have been opted into the beta for 14 straight days. Android phone + two minutes and you're one of them.</div>
          <ol class="beta-steps">
            <li><span class="n">01</span><span>Join the testers group</span></li>
            <li><span class="n">02</span><span>Opt in on Google Play</span></li>
            <li><span class="n">03</span><span>Install it, leave it installed</span></li>
          </ol>
          <a class="beta-cta" href="/blackjack-coach/"><span>How to join the beta</span><span>&rarr;</span></a>
          <p class="beta-alt">Not on Android? Play it in any browser: <a href="https://blackjack.chasecrawford.dev/" target="_blank" rel="noopener">blackjack.chasecrawford.dev</a></p>
        </div>
```

- [ ] **Step 3: Update the two counter lines**

`index.html:796` — replace:
```html
      <div class="out dim">total 2 · open source</div>
```
with:
```html
      <div class="out dim">total 3 · 2 open source · 1 in closed beta</div>
```

`index.html:1026` — replace:
```js
    {t:'[0.120]', cls:'ok',   txt:'> mount /home/chase/projects (2 entries · open source)'},
```
with:
```js
    {t:'[0.120]', cls:'ok',   txt:'> mount /home/chase/projects (3 entries)'},
```

- [ ] **Step 4: Verify the stale counters are gone and the new content is present**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
echo "--- must print nothing ---"
grep -n "total 2 · open source\|2 entries · open source" index.html
echo "--- must print one line each ---"
grep -c "proj-beta" index.html
grep -c "blackjack-coach" index.html
```

Expected: the first grep prints **nothing**. `proj-beta` appears 6 times (CSS + markup), `blackjack-coach` at least 2 times. Any hit in the first grep means a counter line was missed.

- [ ] **Step 5: Screenshot the projects grid**

With the server from Task 2 still running, use Playwright MCP: `browser_resize` to 1440 × 900, `browser_navigate` to `http://localhost:8765/`, then `browser_take_screenshot`.

Confirm by eye:
- Three rows of two cards, no empty grid cell.
- Card 003's Goal callout pins to the bottom of the card like bot-trader's does.
- The green CTA on the beta card sits at the bottom edge of its card (that's what `margin-top:auto` is for).

Then `browser_resize` to 390 × 844 and screenshot again — cards must stack to a single column.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(site): add blackjack-coach project card and beta recruiting companion"
```

---

### Task 4: Final verification sweep

**Files:** none modified — this task only verifies and reports.

**Interfaces:**
- Consumes: everything from Tasks 1–3.

- [ ] **Step 1: Confirm every outbound link resolves**

```bash
for u in \
  "https://blackjack.chasecrawford.dev/" \
  "https://blackjack.chasecrawford.dev/privacy" \
  "https://groups.google.com/g/blackjack-coach-testers" \
  "https://play.google.com/apps/testing/dev.chasecrawford.blackjack.twa" \
  "https://play.google.com/store/apps/details?id=dev.chasecrawford.blackjack.twa" ; do
  printf "%s -> " "$u"
  curl -s -o /dev/null -w "%{http_code}\n" -L -A "Mozilla/5.0" "$u"
done
```

Expected: `200` for the web app and privacy page. Google Play and Groups URLs may return `404`, `403`, or a redirect to a sign-in page even when correct, because they are account-gated — **do not "fix" a Play URL based on this output.** Report the actual codes and let Chase confirm the two Google links by opening them in a signed-in browser.

- [ ] **Step 2: Confirm the in-page CTA path**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/blackjack-coach/
```

Expected: `200`.

- [ ] **Step 3: Stop the server**

```bash
pkill -f "http.server 8765" || true
```

- [ ] **Step 4: Report**

State plainly: which links returned what, which screenshots were reviewed at which widths, and the two items still needing Chase's manual confirmation (the Google Group join URL and the privacy page path). Do not claim the funnel works end to end — that requires a real Android device and a second Google account.

---

## Notes for whoever pushes

Pushing requires switching the `gh` account to `chasecrawford`; the default `ccrawfordhatfield` account gets a 403. Pull with `--rebase` before pushing.
