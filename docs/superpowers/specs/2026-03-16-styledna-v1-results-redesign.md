# StyleDNA V1 — Results Redesign + Waitlist Spec
**Date:** 2026-03-16
**Status:** Approved

---

## Goal
Limit V1 to the Style DNA decode experience only. Remove shopping/retailer matching as post-MVP. Make the results page visual-first with gender-appropriate outfit images per category. Add viral share mechanic. Route all "coming soon" tabs to a single shared waitlist screen.

---

## Data Flow

### `currentStyle` (new global)
```js
let currentStyle = null; // set by startAnalysis(), e.g. 'quiet-luxury'
```
`startAnalysis()` randomly picks a key from `STYLE_DATA`, sets `currentStyle`, then calls `renderResults()` before switching to `screen-dna-result`.

### `userGender`
Already set by the gender toggle. Valid values: `'women'` | `'men'` | `'everyone'`.
When `'everyone'`: alternate images by card index — even indices use `.women`, odd use `.men`.

---

## STYLE_DATA — Restructured Shape

Each style type gets gender-split image objects with one image per category:

```js
STYLE_DATA['quiet-luxury'] = {
  label: 'Quiet Luxury',
  bio: 'Understated elegance. Quality over logos.',
  tags: ['Clean Lines', 'Earth Tones', 'Minimal'],
  palette: ['#2C2822','#C4A47C','#7E9B73','#E8E0D0','#CC5F35'],
  women: {
    top:       'https://images.unsplash.com/...',
    bottom:    'https://images.unsplash.com/...',
    shoes:     'https://images.unsplash.com/...',
    accessory: 'https://images.unsplash.com/...',
    // flat array retained for Recently Decoded sheet:
    sheet: ['url1','url2','url3','url4']
  },
  men: {
    top:       'https://images.unsplash.com/...',
    bottom:    'https://images.unsplash.com/...',
    shoes:     'https://images.unsplash.com/...',
    accessory: 'https://images.unsplash.com/...',
    sheet: ['url1','url2','url3','url4']
  }
}
```

`openStyleSheet()` (Recently Decoded) continues to use `.sheet` flat array — no behaviour change there.

`renderResults()` uses the per-category keys (`top`, `bottom`, `shoes`, `accessory`).

---

## Screens

### 1. Decode Screen (`screen-dna`) — unchanged
No changes. Upload photo/link, gender toggle (Women / Men / Everyone), Decode CTA, Recently Decoded slider.

### 2. Results Screen (`screen-dna-result`) — redesigned

**`renderResults()` function** (called by `startAnalysis()` before screen switch):
```js
function renderResults() {
  const s = STYLE_DATA[currentStyle];
  // populate header fields
  // build 4 look cards using getImgs(s)
}

function getImgs(s) {
  if (userGender === 'men') return s.men;
  if (userGender === 'women') return s.women;
  // 'everyone': fixed mixed mapping (women top+shoes, men bottom+accessory)
  return {
    top:       s.women.top,
    bottom:    s.men.bottom,
    shoes:     s.women.shoes,
    accessory: s.men.accessory
  };
}
// Note: no index loop — the 4-card order is fixed (Top/Bottom/Shoes/Accessory).
// If a 5th card is ever added, extend this mapping explicitly.
```

**Header (compact, above scroll):**
- Style type name — large Cormorant Garamond italic, populated from `s.label`
- 1-line bio from `s.bio` (max 12 words)
- Confidence chip: `"94% match"` (static for mock)
- Palette strip — 5 swatches (static per style type, defined in STYLE_DATA)
- 3 tag chips from `s.tags`

**Look Scroll — Horizontal Peek (Option C):**
- Container: `overflow-x: auto; scroll-snap-type: x mandatory; display: flex; gap: 12px`
- 4 cards, each `width: 78vw; max-width: 320px; flex-shrink: 0; scroll-snap-align: start`
- Card aspect ratio: `4:5` (portrait)
- Card anatomy:
  - Full-bleed background image
  - Category chip top-left: "Top" / "Bottoms" / "Shoes" / "Accessory"
  - Style label bottom-left in white over a gradient scrim
- Image sources: `imgs.top`, `imgs.bottom`, `imgs.shoes`, `imgs.accessory`

**Dot Indicators:**
```js
// On scroll of the look-scroll container:
// Card width = 78vw + 12px gap. Use the first card's offsetWidth for accuracy.
scrollEl.addEventListener('scroll', () => {
  const cardW = scrollEl.querySelector('.look-card').offsetWidth + 12; // 12px gap
  const idx = Math.round(scrollEl.scrollLeft / cardW);
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
});
```
4 dots. Active dot: filled terracotta circle. Inactive: hollow. Dots are display-only (not tappable).

**Action Buttons:**
- Primary: `"Share My Style DNA"` — calls `shareStyle()`
- Secondary: `"Decode Again"` — calls `switchTab('dna')`

```js
function shareStyle() {
  const s = STYLE_DATA[currentStyle];
  const text = `My Style DNA is ${s.label} — ${s.tags.join(', ')}. Decode yours 🧬`;
  if (navigator.share) {
    navigator.share({ title: `My Style DNA — ${s.label}`, text, url: 'https://stylehits.vercel.app' });
  } else {
    navigator.clipboard.writeText(text + ' https://stylehits.vercel.app');
    showToast('Link copied!');
  }
}
```

**Removed from results page:**
- Style Dimensions bars
- Style Vocabulary tag cloud
- "Shop My Style" button

---

### 3. Waitlist Screen (`screen-waitlist`) — new, single shared screen

One screen, shared by all four non-DNA tabs. The `tabMap` maps all four to this screen:
```js
const tabMap = {
  dna: 'screen-dna',
  'dna-result': 'screen-dna-result',
  discover: 'screen-waitlist',
  home: 'screen-waitlist',
  saved: 'screen-waitlist',
  profile: 'screen-waitlist'
};
```

**Layout (scrollable, dark):**
- Blurred decorative background:
  `background: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60') center/cover; filter: brightness(0.18); position: absolute; inset: 0; z-index: 0`
  All content sits in a relative `z-index:1` wrapper above the background.
- StyleDNA chip label
- Headline: *"Get deals matched to your Style DNA"*
- Subtext: *"We're building personalised shopping across 500+ stores. Be first."*
- Email `<input type="email">` (placeholder: `your@email.com`)
- CTA: `"Join the Waitlist"` button
- **Success state:** on submit, replace button with `"You're on the list ✓"` (CSS class toggle, no backend)
- Back link: `"← Back to your Style DNA"` → calls `switchTab(hasDecode ? 'dna-result' : 'dna')`
  - `hasDecode`: `let hasDecode = false;` — set to `true` when `startAnalysis()` completes

---

## Tab Bar

| Tab | Behaviour | Opacity |
|-----|-----------|---------|
| 🧬 Style DNA | `hasDecode ? switchTab('dna-result') : switchTab('dna')` | 100% |
| ✨ Discover | `switchTab('discover')` → waitlist | 50% |
| 🏠 Home | `switchTab('home')` → waitlist | 50% |
| ♡ Saved | `switchTab('saved')` → waitlist | 50% |
| 👤 Profile | `switchTab('profile')` → waitlist | 50% |

**"Soon" badge:** `::after` pseudo-element on non-DNA `.tab-btn` buttons.
```css
.tab-btn.soon::after {
  content: 'Soon';
  position: absolute;
  top: 4px; right: 4px;
  font-size: 8px; font-family: var(--font-sans);
  background: var(--accent); color: #fff;
  padding: 1px 4px; border-radius: 4px;
  letter-spacing: 0.04em;
}
.tab-btn.soon { opacity: 0.5; }
```
Add class `soon` to Discover, Home, Saved, Profile tab buttons in HTML.

---

## What Does NOT Change
- Dark theme (`#0C0B09`, terracotta accent `#CC5F35`)
- Decode input screen
- Recently Decoded slider + `openStyleSheet()` (uses `.sheet` array)
- `userGender` state
- Vercel deployment pipeline

---

## Out of Scope (Post-MVP)
- Real product API (Etsy / Skimlinks)
- Discover product grid
- Saved items
- User profiles
- Claude vision API (mock decode only for V1)
