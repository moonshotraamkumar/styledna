# StyleDNA V1 — Results Redesign + Waitlist Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the DNA results screen to be visual-first (horizontal peek scroll of gender-matched outfit images), add a shared waitlist screen for coming-soon tabs, and grey out non-DNA tabs with "Soon" badges.

**Architecture:** Single HTML file (`styledna-design.html`). All changes are in-file CSS additions + JS function rewrites. No new files needed. Tasks are ordered to avoid breaking the running app at any step.

**Tech Stack:** Vanilla HTML/CSS/JS, Unsplash CDN images, Web Share API, deployed on Vercel via git push.

**Spec:** `docs/superpowers/specs/2026-03-16-styledna-v1-results-redesign.md`

---

## Chunk 1: STYLE_DATA restructure + `renderResults()`

### Task 1: Restructure STYLE_DATA with per-category images + metadata

**Files:**
- Modify: `styledna-design.html` — replace the `STYLE_DATA` const (currently around line 1135)

The existing `STYLE_DATA` has `.women[]` and `.men[]` flat arrays plus a `.sheet[]` array per style. We need to add per-category keys (`top`, `bottom`, `shoes`, `accessory`) while keeping `.sheet[]` intact for the Recently Decoded sheet.

- [ ] **Step 1: Read the current STYLE_DATA block to confirm exact line range**

Run: `grep -n "const STYLE_DATA\|^};" styledna-design.html | head -20`

- [ ] **Step 2: Replace STYLE_DATA with the restructured version**

Find the entire `const STYLE_DATA = { ... };` block (lines ~1135–1186) and replace with:

```js
const STYLE_DATA = {
  'quiet-luxury': {
    label: 'Quiet Luxury',
    bio: 'Understated elegance. Quality over logos.',
    tags: ['Clean Lines', 'Earth Tones', 'Minimal'],
    palette: ['#2C2822','#C4A47C','#7E9B73','#E8E0D0','#CC5F35'],
    women: {
      top:       'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1584917865442-de89be371e60?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&h=533&fit=crop&q=80'],
    },
    men: {
      top:       'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=533&fit=crop&q=80'],
    },
  },
  'urban-edge': {
    label: 'Urban Edge',
    bio: 'Streetwear with a sharp city attitude.',
    tags: ['Dark Tones', 'Streetwear', 'Graphic'],
    palette: ['#1A1A1A','#3D3D3D','#CC5F35','#E8E0D0','#7A7268'],
    women: {
      top:       'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=533&fit=crop&q=80'],
    },
    men: {
      top:       'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=533&fit=crop&q=80'],
    },
  },
  'soft-minimalist': {
    label: 'Soft Minimalist',
    bio: 'Calm, airy, effortless. Nothing extra.',
    tags: ['Pastels', 'Clean Lines', 'Airy'],
    palette: ['#F5F0E8','#DDD5C5','#B8C5B0','#9AABB0','#7A8A7A'],
    women: {
      top:       'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=400&h=533&fit=crop&q=80'],
    },
    men: {
      top:       'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=533&fit=crop&q=80'],
    },
  },
  'boho-luxe': {
    label: 'Boho Luxe',
    bio: 'Warm textures, layered artisan beauty.',
    tags: ['Earth Tones', 'Layered', 'Artisan'],
    palette: ['#8B6B3D','#C4956A','#7E9B73','#D4A96A','#3D2B1F'],
    women: {
      top:       'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1517441169886-9d6a7ffd5fac?w=400&h=533&fit=crop&q=80'],
    },
    men: {
      top:       'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop&q=80'],
    },
  },
  'editorial-chic': {
    label: 'Editorial Chic',
    bio: 'Fashion as art. Every street a runway.',
    tags: ['Bold Cuts', 'Statement', 'Avant-garde'],
    palette: ['#1A1A2E','#E94560','#0F3460','#E8E0D0','#C4A47C'],
    women: {
      top:       'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1475180429745-7f68d7692c6b?w=400&h=533&fit=crop&q=80'],
    },
    men: {
      top:       'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=750&fit=crop&q=80',
      bottom:    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&q=80',
      shoes:     'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=750&fit=crop&q=80',
      accessory: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&q=80',
      sheet:     ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=533&fit=crop&q=80','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=533&fit=crop&q=80'],
    },
  },
};
```

- [ ] **Step 3: Update `openStyleSheet()` to use `.sheet` array**

Find `openStyleSheet` (lines ~1189–1200) and update the image lookup.

⚠️ **Important:** The old STYLE_DATA used `s.desc` for descriptions. The new STYLE_DATA uses `s.bio`. The line `document.getElementById('ssheet-desc').textContent = s.desc` will silently show `undefined` unless updated to `s.bio`. This step fixes that.

```js
function openStyleSheet(key) {
  const s = STYLE_DATA[key];
  if (!s) return;
  const gd = userGender === 'men' ? s.men : s.women;
  const imgs = gd.sheet;
  document.getElementById('ssheet-chip').textContent = 'Style DNA';
  document.getElementById('ssheet-title').textContent = s.label;
  document.getElementById('ssheet-desc').textContent = s.bio;  // was s.desc — renamed
  document.getElementById('ssheet-grid').innerHTML = imgs.map(src =>
    `<img class="ssheet-img" src="${src}" alt="${s.label}" loading="lazy" />`
  ).join('');
  document.getElementById('style-sheet').scrollTop = 0;
  document.getElementById('backdrop').classList.add('open');
  document.getElementById('style-sheet').classList.add('open');
}
```

- [ ] **Step 4: Add `currentStyle`, `hasDecode` globals and `getImgs()` helper**

Find the globals block (around line 1251: `let activeTab = 'dna';`) and add:

```js
let currentStyle = null;
let hasDecode = false;

function getImgs(s) {
  if (userGender === 'men') return s.men;
  if (userGender === 'women') return s.women;
  // 'everyone': fixed mixed mapping
  return { top: s.women.top, bottom: s.men.bottom, shoes: s.women.shoes, accessory: s.men.accessory };
}
```

- [ ] **Step 5: Verify no console errors**

Open `styledna-design.html` in browser, open DevTools console, tap a Recently Decoded card → sheet opens with images. No errors.

- [ ] **Step 6: Commit**

```bash
git add styledna-design.html
git commit -m "refactor: restructure STYLE_DATA with per-category images and metadata"
```

---

### Task 2: Add `renderResults()` and wire into `startAnalysis()`

**Files:**
- Modify: `styledna-design.html` — add `renderResults()`, update `startAnalysis()` end block

- [ ] **Step 1: Add `renderResults()` function before `startAnalysis()`**

Insert before the `function startAnalysis()` definition:

```js
/* ── Render DNA results ── */
const STYLE_KEYS = Object.keys(STYLE_DATA);

function renderResults() {
  const s = STYLE_DATA[currentStyle];
  const imgs = getImgs(s);

  // Header
  document.getElementById('res-style-name').textContent = s.label;
  document.getElementById('res-bio').textContent = s.bio;
  document.getElementById('res-palette').innerHTML = s.palette
    .map(c => `<div class="res-swatch" style="background:${c}"></div>`).join('');
  document.getElementById('res-tags').innerHTML = s.tags
    .map(t => `<span class="res-tag">${t}</span>`).join('');

  // Look scroll cards
  const CATS = [
    { key: 'top',       label: 'Top' },
    { key: 'bottom',    label: 'Bottoms' },
    { key: 'shoes',     label: 'Shoes' },
    { key: 'accessory', label: 'Accessory' },
  ];
  document.getElementById('look-scroll').innerHTML = CATS.map(c => `
    <div class="look-card">
      <img src="${imgs[c.key]}" alt="${c.label}" loading="lazy" />
      <div class="look-cat-chip">${c.label}</div>
      <div class="look-label-scrim">
        <div class="look-style-label">${s.label}</div>
      </div>
    </div>
  `).join('');

  // Dots
  const dotsEl = document.getElementById('look-dots');
  dotsEl.innerHTML = CATS.map((_, i) =>
    `<div class="look-dot${i===0?' active':''}"></div>`
  ).join('');

  // Dot scroll tracking
  const scrollEl = document.getElementById('look-scroll');
  scrollEl.addEventListener('scroll', () => {
    const cardW = scrollEl.querySelector('.look-card').offsetWidth + 12;
    const idx = Math.round(scrollEl.scrollLeft / cardW);
    dotsEl.querySelectorAll('.look-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
  }, { passive: true });
}
```

- [ ] **Step 2: Update `startAnalysis()` to pick a random style, set globals, call `renderResults()`**

Find the `setTimeout` block at the end of `startAnalysis()` (around line 1401) that calls `switchTab('dna-result')` and update it:

```js
setTimeout(()=>{
  clearInterval(iv);
  loading.classList.remove('show');
  form.style.display = 'block';
  dnaBuilt = true;
  hasDecode = true;
  // Pick random style
  currentStyle = STYLE_KEYS[Math.floor(Math.random() * STYLE_KEYS.length)];
  renderResults();
  document.getElementById('mvp-entry').style.display = 'none';
  document.getElementById('home-hero-active').classList.add('visible');
  switchTab('dna-result');
}, 3000);
```

- [ ] **Step 3: Verify in browser**

Tap "Decode My Style DNA" on the DNA screen → loading animation plays → results screen shows (even though HTML skeleton not updated yet, no JS errors).

- [ ] **Step 4: Commit**

```bash
git add styledna-design.html
git commit -m "feat: add renderResults() with random style pick and getImgs() routing"
```

---

## Chunk 2: Results screen HTML + CSS redesign

### Task 3: Replace results screen HTML

**Files:**
- Modify: `styledna-design.html` — replace `<div class="screen" id="screen-dna-result">` block (lines ~886–960)

- [ ] **Step 1: Replace the entire `screen-dna-result` div**

Find and replace the block from `<div class="screen" id="screen-dna-result">` to its closing `</div>` (before the `<!-- DISCOVER -->` comment):

```html
<!-- ══════════════ DNA RESULT ══════════════ -->
<div class="screen" id="screen-dna-result">

  <!-- Compact header -->
  <div class="res-header">
    <div class="section-chip" style="margin-bottom:10px">Your Style DNA</div>
    <div class="res-style-name" id="res-style-name">Quiet Luxury</div>
    <div class="res-bio" id="res-bio">Understated elegance. Quality over logos.</div>
    <div class="res-meta-row">
      <div class="res-conf-chip">94% match</div>
      <div class="res-palette" id="res-palette">
        <div class="res-swatch" style="background:#2C2822"></div>
        <div class="res-swatch" style="background:#C4A47C"></div>
        <div class="res-swatch" style="background:#7E9B73"></div>
        <div class="res-swatch" style="background:#E8E0D0"></div>
        <div class="res-swatch" style="background:#CC5F35"></div>
      </div>
    </div>
    <div class="res-tags" id="res-tags">
      <span class="res-tag">Clean Lines</span>
      <span class="res-tag">Earth Tones</span>
      <span class="res-tag">Minimal</span>
    </div>
  </div>

  <!-- Horizontal look scroll -->
  <div class="look-scroll-wrap">
    <div class="look-scroll" id="look-scroll">
      <!-- Populated by renderResults() -->
      <div class="look-card look-card--placeholder"></div>
      <div class="look-card look-card--placeholder"></div>
      <div class="look-card look-card--placeholder"></div>
      <div class="look-card look-card--placeholder"></div>
    </div>
    <div class="look-dots" id="look-dots">
      <div class="look-dot active"></div>
      <div class="look-dot"></div>
      <div class="look-dot"></div>
      <div class="look-dot"></div>
    </div>
  </div>

  <!-- Actions -->
  <div class="res-actions">
    <button class="btn-pri" onclick="shareStyle()">
      <span>Share My Style DNA</span><span>↗</span>
    </button>
    <button class="btn-sec" onclick="switchTab('dna')">Decode Again</button>
  </div>

  <div style="height:24px"></div>
</div>
```

- [ ] **Step 2: Remove old results screen sections no longer needed**

Confirm the old `.dims`, `.palette-sec`, `.vtags-sec`, `.prof-actions` blocks are gone (they were inside the old `screen-dna-result`). They should be removed as part of the replacement above.

- [ ] **Step 3: Verify structure in browser**

Open file in browser → tap Decode → results screen shows (will be unstyled but structurally correct). No console errors.

- [ ] **Step 4: Commit**

```bash
git add styledna-design.html
git commit -m "feat: replace results screen HTML with look scroll + compact header"
```

---

### Task 4: Add CSS for results screen and look cards

**Files:**
- Modify: `styledna-design.html` — add CSS rules inside `<style>` block, before the closing `</style>` tag

- [ ] **Step 1: Add results header CSS**

```css
/* ── Results screen ── */
.res-header {
  padding: 20px 20px 0;
}
.res-style-name {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-style: italic;
  font-weight: 300;
  line-height: 1.1;
  color: var(--fg);
  margin-bottom: 8px;
}
.res-bio {
  font-size: 0.9rem;
  color: var(--fg-muted);
  margin-bottom: 14px;
  line-height: 1.5;
}
.res-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.res-conf-chip {
  font-family: var(--font-ui);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--accent-glow);
  color: var(--accent-light);
  border: 1px solid rgba(204,95,53,0.25);
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.res-palette {
  display: flex;
  gap: 5px;
  align-items: center;
}
.res-swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(237,232,222,0.1);
  flex-shrink: 0;
}
.res-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.res-tag {
  font-family: var(--font-ui);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-muted);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 20px;
}
```

- [ ] **Step 2: Add look scroll CSS**

```css
/* ── Look scroll ── */
.look-scroll-wrap {
  padding: 0 0 0 20px;
}
.look-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-right: 20px;
  padding-bottom: 4px;
}
.look-scroll::-webkit-scrollbar { display: none; }
.look-card {
  flex-shrink: 0;
  width: 78vw;
  max-width: 320px;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  scroll-snap-align: start;
  position: relative;
  background: var(--surface-2);
}
.look-card--placeholder {
  background: var(--surface-2);
}
.look-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.look-cat-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-ui);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(12,11,9,0.75);
  color: var(--fg);
  padding: 4px 10px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(237,232,222,0.12);
}
.look-label-scrim {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(12,11,9,0.85) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 14px;
}
.look-style-label {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--fg);
}
.look-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 14px 0 20px;
}
.look-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--border-strong);
  transition: background 0.25s, transform 0.25s;
}
.look-dot.active {
  background: var(--accent);
  transform: scale(1.3);
}
```

- [ ] **Step 3: Add results action buttons CSS**

```css
/* ── Results actions ── */
.res-actions {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

- [ ] **Step 4: Verify results screen looks correct**

Open browser, decode → results screen shows:
- Large italic style name at top
- Bio line below
- Confidence chip + palette swatches in a row
- 3 tag chips
- 4 cards in horizontal scroll with peek (next card visible)
- Dots below scroll
- Share + Decode Again buttons

- [ ] **Step 5: Commit**

```bash
git add styledna-design.html
git commit -m "feat: add CSS for results screen - look cards, header, dots, actions"
```

---

## Chunk 3: Waitlist screen + tab bar updates

### Task 5: Add waitlist screen HTML

**Files:**
- Modify: `styledna-design.html` — add new screen after `screen-profile` (around line 1010), before the tab bar

- [ ] **Step 1: Add `screen-waitlist` div after `screen-profile`**

Find `<!-- ══════════ TAB BAR ══════════ -->` (or `<div class="tab-bar">`) and insert before it:

```html
<!-- ══════════════ WAITLIST ══════════════ -->
<div class="screen" id="screen-waitlist">
  <div class="waitlist-bg"></div>
  <div class="waitlist-content">
    <div class="section-chip" style="margin-bottom:16px">Coming Soon</div>
    <div class="display-head" style="font-size:1.7rem;margin-bottom:12px">
      Get deals matched to<br><em>your Style DNA</em>
    </div>
    <p class="waitlist-sub">We're building personalised shopping across 500+ stores. Be first.</p>
    <div class="waitlist-form" id="waitlist-form">
      <input
        type="email"
        id="waitlist-email"
        class="waitlist-input"
        placeholder="your@email.com"
        autocomplete="email"
      />
      <button class="btn-pri" onclick="joinWaitlist()">Join the Waitlist</button>
    </div>
    <div class="waitlist-success" id="waitlist-success" style="display:none">
      <div class="waitlist-tick">✓</div>
      <div class="waitlist-success-txt">You're on the list</div>
    </div>
    <button class="waitlist-back" onclick="switchTab(hasDecode ? 'dna-result' : 'dna')">
      ← Back to your Style DNA
    </button>
  </div>
</div>
```

- [ ] **Step 2: Add `joinWaitlist()` function in JS**

Add after `closeStyleSheet()`:

```js
function joinWaitlist() {
  const email = document.getElementById('waitlist-email').value.trim();
  if (!email || !email.includes('@')) return;
  document.getElementById('waitlist-form').style.display = 'none';
  document.getElementById('waitlist-success').style.display = 'flex';
}
```

- [ ] **Step 3: Add `shareStyle()` function**

```js
function shareStyle() {
  if (!currentStyle) return;
  const s = STYLE_DATA[currentStyle];
  const text = `My Style DNA is ${s.label} — ${s.tags.join(', ')}. Decode yours 🧬`;
  const url = 'https://stylehits.vercel.app';
  if (navigator.share) {
    navigator.share({ title: `My Style DNA — ${s.label}`, text, url }).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text + ' ' + url).then(()=> showShareToast());
  }
}
function showShareToast() {
  let t = document.getElementById('share-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'share-toast';
    t.className = 'share-toast';
    document.querySelector('.app').appendChild(t);
  }
  t.textContent = 'Link copied!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
```

- [ ] **Step 4: Commit**

```bash
git add styledna-design.html
git commit -m "feat: add waitlist screen HTML and shareStyle() function"
```

---

### Task 6: Waitlist screen CSS

**Files:**
- Modify: `styledna-design.html` — add CSS inside `<style>` block

- [ ] **Step 1: Add waitlist CSS**

```css
/* ── Waitlist screen ── */
.waitlist-bg {
  position: absolute; inset: 0; z-index: 0;
  background: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60') center/cover;
  filter: brightness(0.18);
}
.waitlist-content {
  position: relative; z-index: 1;
  padding: 60px 24px 40px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.waitlist-sub {
  font-size: 0.9rem;
  color: var(--fg-muted);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 300px;
}
.waitlist-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.waitlist-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.waitlist-input:focus {
  border-color: var(--accent);
}
.waitlist-input::placeholder { color: var(--fg-dim); }
.waitlist-success {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.waitlist-tick {
  width: 32px; height: 32px;
  background: var(--accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: #fff;
}
.waitlist-success-txt {
  font-family: var(--font-ui);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--fg);
}
.waitlist-back {
  background: none; border: none; cursor: pointer;
  color: var(--fg-muted);
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: 0;
  margin-top: auto;
  padding-top: 24px;
}
.waitlist-back:hover { color: var(--fg); }

/* ── Share toast ── */
.share-toast {
  position: absolute;
  bottom: calc(var(--tab-h) + 16px);
  left: 50%; transform: translateX(-50%) translateY(8px);
  background: var(--surface-3);
  border: 1px solid var(--border-strong);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: 10px 20px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
  z-index: 800;
  white-space: nowrap;
}
.share-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

- [ ] **Step 2: Verify waitlist screen**

Open browser → tap Discover tab → waitlist screen with blurred background, headline, email input appears.
Enter email → tap "Join the Waitlist" → form hides, "You're on the list ✓" shows.
Tap "← Back to your Style DNA" → returns to DNA screen.

- [ ] **Step 3: Commit**

```bash
git add styledna-design.html
git commit -m "feat: add waitlist screen CSS and share toast"
```

---

### Task 7: Update tab bar routing + "Soon" badges

**Files:**
- Modify: `styledna-design.html` — tabMap JS + tab button HTML + CSS

- [ ] **Step 1: Update `tabMap` to route non-DNA tabs to waitlist**

Find `const tabMap = {` (line ~1246) and replace:

```js
const tabMap = {
  home:        'screen-waitlist',
  discover:    'screen-waitlist',
  dna:         'screen-dna',
  saved:       'screen-waitlist',
  profile:     'screen-waitlist',
  'dna-result':'screen-dna-result',
  waitlist:    'screen-waitlist',
};
```

- [ ] **Step 2: Update DNA tab button to route based on `hasDecode`**

Find `<button class="tab-btn" id="tab-dna" onclick="switchTab('dna')">` and update:

```html
<button class="tab-btn active" id="tab-dna" onclick="switchTab(hasDecode ? 'dna-result' : 'dna')">
```

- [ ] **Step 3: Add `soon` class to non-DNA tab buttons in HTML**

Find the 4 non-DNA tab buttons and add class `soon`:

```html
<button class="tab-btn soon" id="tab-home" onclick="switchTab('home')">
<button class="tab-btn soon" id="tab-discover" onclick="switchTab('discover')">
<button class="tab-btn soon" id="tab-saved" onclick="switchTab('saved')">
<button class="tab-btn soon" id="tab-profile" onclick="switchTab('profile')">
```

- [ ] **Step 4: Add "Soon" badge CSS**

```css
/* ── Soon badge on tab buttons ── */
.tab-btn.soon {
  opacity: 0.5;
  position: relative;
}
.tab-btn.soon::after {
  content: 'Soon';
  position: absolute;
  top: 4px; right: 6px;
  font-size: 8px;
  font-family: var(--font-ui);
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--accent);
  color: #fff;
  padding: 1px 4px;
  border-radius: 4px;
}
```

- [ ] **Step 5: Update `switchTab()` to keep DNA tab active when showing waitlist**

Find `switchTab()` function and replace entirely.

⚠️ **Important:** When a "soon" tab is tapped, the waitlist screen opens but the DNA tab button must stay highlighted. The logic must: (a) switch the screen, (b) skip clearing tab-button active states for "soon" tabs, AND (c) explicitly ensure the DNA tab button is marked active. Simply skipping the clear is not enough — other code paths (e.g. `startAnalysis()`) may have removed the active class earlier.

```js
const SOON_TABS = new Set(['home','discover','saved','profile']);

function switchTab(tab) {
  document.querySelectorAll('.screen.active').forEach(s=>s.classList.remove('active'));
  const screenId = tabMap[tab] || ('screen-' + tab);
  const sc = document.getElementById(screenId);
  if (sc) setTimeout(()=>{ sc.classList.add('active'); sc.scrollTop=0; }, 50);

  if (SOON_TABS.has(tab)) {
    // Keep DNA tab button active — user is on waitlist, DNA is still their home
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('tab-dna').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    const tabId = 'tab-' + (tab === 'dna-result' ? 'dna' : tab);
    const btn = document.getElementById(tabId);
    if (btn) btn.classList.add('active');
  }
  activeTab = tab;
  closeStyleSheet();
}
```

- [ ] **Step 6: Verify tab bar**

In browser:
- DNA tab → goes to decode screen (or results if already decoded)
- Discover/Home/Saved/Profile tabs → all show waitlist screen, DNA tab stays highlighted, "soon" badge visible, tabs are 50% opacity
- "← Back to your Style DNA" from waitlist → correct screen

- [ ] **Step 7: Commit**

```bash
git add styledna-design.html
git commit -m "feat: tab bar — soon badges, waitlist routing, hasDecode-aware DNA tab"
```

---

## Chunk 4: Deploy + smoke test

### Task 8: Deploy to Vercel and smoke test

- [ ] **Step 1: Push to git and deploy**

```bash
git push
npx vercel --prod 2>&1 | tail -5
```

Expected: deployment URL printed.

- [ ] **Step 2: Smoke test on mobile (or DevTools mobile mode)**

Open `https://stylehits.vercel.app` on iPhone or Chrome DevTools device mode (375px wide):

| Action | Expected |
|--------|----------|
| App loads | DNA decode screen visible |
| Tap Discover | Waitlist screen — blurred bg, headline, email input |
| Enter email + tap Join | "You're on the list ✓" |
| Tap back | DNA screen |
| Tap "Decode My Style DNA" | Loading animation → results screen |
| Results screen | Large italic style name, bio, palette chips, 3 tags |
| Swipe cards | 4 cards (Top/Bottoms/Shoes/Accessory), dots track |
| Tap "Share My Style DNA" | Native share sheet (or "Link copied!" toast) |
| Tap "Decode Again" | Back to decode screen |

- [ ] **Step 3: Final commit if any hotfixes needed**

```bash
git add styledna-design.html
git commit -m "fix: post-deploy smoke test fixes"
git push && npx vercel --prod 2>&1 | tail -3
```
