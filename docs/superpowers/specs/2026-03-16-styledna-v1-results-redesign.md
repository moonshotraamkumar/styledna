# StyleDNA V1 — Results Redesign + Waitlist Spec
**Date:** 2026-03-16
**Status:** Approved

---

## Goal
Limit V1 to the Style DNA decode experience only. Remove shopping/retailer matching as post-MVP. Make the results page visual-first with gender-appropriate outfit images. Add viral share mechanic. Route all "coming soon" tabs to a waitlist screen.

---

## Screens

### 1. Decode Screen (`screen-dna`) — unchanged
No changes. Upload photo/link, gender toggle (Women / Men / Everyone), Decode CTA, Recently Decoded slider.

### 2. Results Screen (`screen-dna-result`) — redesigned

**Header (compact):**
- Style type name — large Cormorant Garamond italic
- 1-line bio (max 12 words)
- Confidence score chip (e.g. "94% match")
- Palette strip — 5–7 colour swatches
- 3 style tag chips (primary tags only)

**Look Scroll (Option C — Horizontal Peek):**
- Single horizontally-scrollable row
- 4 cards, each ~78% screen width so the next card peeks ~10%
- Card order: Top → Bottoms → Shoes → Accessory
- Card design: tall portrait image (4:5 ratio), category chip top-left, style label bottom-left
- Images sourced from `STYLE_DATA` per style type, gender-matched via `userGender`
- Dot indicator row below scroll (4 dots, active tracks scroll position)

**Action Buttons (below scroll):**
- Primary: "Share My Style DNA" → triggers Web Share API with branded share text; falls back to clipboard copy
- Secondary: "Decode Again" → navigates back to `screen-dna`

**Remove from results page:**
- Style Dimensions bars (4 progress bar rows)
- Style Vocabulary tag cloud (condensed to 3 chips in header)
- "Shop My Style" button

### 3. Waitlist Screen (`screen-waitlist`) — new

**Triggered by:** tapping Discover, Home, Saved, or Profile tabs.

**Layout:**
- Blurred/dimmed product grid background (static decorative image)
- StyleDNA chip label at top
- Headline: *"Get deals matched to your Style DNA"*
- Subtext: *"We're building personalised shopping across 500+ stores. Be first."*
- Email input field (placeholder: "your@email.com")
- CTA button: "Join the Waitlist"
- Success state: button becomes "You're on the list ✓" (no backend needed, pure UI state)
- Back link: "← Back to your Style DNA"

---

## Tab Bar

| Tab | Behaviour |
|-----|-----------|
| 🧬 Style DNA | Active — navigates to decode/results |
| ✨ Discover | Opens `screen-waitlist` |
| 🏠 Home | Opens `screen-waitlist` |
| ♡ Saved | Opens `screen-waitlist` |
| 👤 Profile | Opens `screen-waitlist` |

Non-DNA tabs render at 50% opacity with a small "Soon" badge.

---

## Share Feature

Uses `navigator.share` (Web Share API):
```js
navigator.share({
  title: 'My Style DNA — Refined Minimalist',
  text: 'My style is Refined Minimalist with Earth Tones & Clean Lines. Decode yours 🧬',
  url: 'https://stylehits.vercel.app'
})
```
Falls back to `navigator.clipboard.writeText(...)` + toast "Link copied!" on desktop.

---

## STYLE_DATA — Extended per Category

Each style type needs 4 gender-split image sets (already partially in place):
```
STYLE_DATA[key].women = { top, bottom, shoes, accessory }
STYLE_DATA[key].men   = { top, bottom, shoes, accessory }
```
Images sourced from Unsplash (free, no auth). 5 style types × 2 genders × 4 categories = 40 images.

---

## What Does NOT Change
- Dark theme (#0C0B09, terracotta accent #CC5F35)
- Decode input screen
- Recently Decoded slider
- `userGender` state
- Vercel deployment pipeline

---

## Out of Scope (Post-MVP)
- Real product API (Etsy / Skimlinks)
- Discover product grid
- Saved items
- User profiles
- Claude vision API (uses mock decode for now)
