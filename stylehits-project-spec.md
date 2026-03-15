# Project spec for StyleHits

---

## Project goals

StyleHits is an AI-powered personal style app that identifies a user's unique **Style DNA** — their aesthetic, preferences, and taste — and then surfaces shoppable product recommendations that match that style at the **lowest available price** across retailers.

The core value proposition: *understand who you are style-wise, then find the exact look (or closest match) for the best deal.*

---

## Product requirements

### Core app functionality

1. **Style DNA Engine** — The foundational feature. Analyzes user inputs (photos, inspiration URLs, Pinterest likes) to build a persistent style profile that drives all recommendations.
2. **Style-matched product recommendations** — Surfaces clothing and accessory products that match the user's Style DNA, sourced from multiple retailers.
3. **Price intelligence** — For each recommended product (or a close style match), the app finds the lowest current price across available retailers.
4. **Shoppable links** — All product links are affiliate-tracked so the app earns commission on purchases.
5. **Saved looks / wishlist** — Users can save recommended items and outfits.
6. **Premium subscription tier** — Unlocks enhanced features (unlimited recommendations, deal alerts, style refresh).

---

### Core user flow

```
1. Onboarding
   └── Sign up (email or social login)
   └── Quick style bootstrap:
       ├── Upload outfit photos you love (own wardrobe or inspo)
       ├── Paste Pinterest board URL or import Pinterest likes
       └── Drop in URLs or screenshots of looks you admire

2. Style DNA Generation
   └── AI processes inputs → produces a Style DNA profile
   └── Profile shows: aesthetic labels, color palette, key style attributes
   └── User can confirm or adjust ("more streetwear, less preppy")

3. Recommendation Feed
   └── Personalized grid of products matching Style DNA
   └── Each card shows: item photo, style match %, current best price, retailer
   └── Tap item → see price across retailers + buy link

4. Save & Shop
   └── Save items to Wishlist
   └── Tap "Buy" → affiliate link opens retailer
   └── Price drop alerts (premium)

5. Ongoing refinement
   └── User likes/dislikes refine the Style DNA over time
   └── Periodic "Style refresh" prompt to re-upload or update preferences
```

---

### App functionality (MVP + future versions)

#### MVP (v1)

| Feature | Description |
|---|---|
| Style DNA onboarding | Photo upload + URL/screenshot drop + Pinterest board URL input |
| AI style analysis | Claude vision API analyzes inputs, generates style attributes and profile |
| Style DNA profile view | Visual summary of user's aesthetic: labels, palette, mood board |
| Product recommendation feed | AI-matched products sourced via shopping APIs, filtered by style |
| Price comparison | Shows current best price and which retailer has it |
| Shoppable affiliate links | All product links are affiliate-tracked |
| Save / wishlist | Bookmark items |
| Basic user account | Email sign-up, profile, saved items |
| Web app (mobile-optimized) | Progressive web app, iOS Safari friendly |

#### v2 (post-MVP)

| Feature | Description |
|---|---|
| Native iOS app | Better camera integration, push notifications |
| Style DNA refresh | Periodic prompts to update preferences |
| Price drop alerts | Notify user when a saved item drops in price |
| Outfit builder | Combine multiple items into a complete outfit |
| Deal score | Algorithmic rating of how good the current deal is vs. historical price |
| Social sharing | Share a look or deal with friends |
| Premium subscription | Unlock unlimited recs, alerts, advanced price history |

#### v3 (future)

| Feature | Description |
|---|---|
| Android app | Expand platform reach |
| Brand / retailer partnerships | Sponsored placements (clearly labeled) |
| AI stylist chat | Ask "What should I wear to X?" and get personalized picks |
| Wardrobe management | Catalog existing clothes, get outfit suggestions from owned items |
| Group / gifting feature | Share a style profile to get gift recommendations |

---

### Design and style guidelines

**Aesthetic**: Energetic, social, and approachable — feels like a stylish friend app, not a cold algorithm. Think TikTok-meets-personal-stylist energy.

- **Tone**: Warm, confident, a little playful. Not stiff or corporate. Not overly luxe/editorial.
- **Color palette**: Vibrant but not garish. Rich accent color on a clean light or dark background. Fashion-forward without alienating.
- **Typography**: Modern sans-serif. Confident headings, readable body text.
- **Layout**: Card-based product grid. Swipeable flows for onboarding. Large imagery — clothes are visual.
- **Interactions**: Smooth, satisfying micro-animations. Swipe to like/dislike on style inputs. Tap to expand price comparison.
- **Mobile-first**: Every screen designed for a phone screen first, even on web.

**Brand name**: StyleHits — implies discovering style moments, hitting on the right look.

---

### Not in scope (MVP)

- Native Android app
- Full wardrobe management / closet scanning
- AI stylist chat interface
- Social feed / following other users
- In-app checkout (redirect to retailer only)
- Advanced price history charts
- Brand/retailer direct partnerships
- Subscription payments (v1 is affiliate-only revenue)

---

## Engineering and tech requirements

### Preferred tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | **Next.js 14+ (App Router)** | Web-first MVP, mobile-optimized PWA, fast iteration, SSR for SEO |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid, consistent UI without heavy design system overhead |
| Backend | **Next.js API routes** (or separate Node/Express if needed) | Keeps stack unified, easy to deploy |
| Database | **Supabase (PostgreSQL)** | Auth, database, storage in one — faster to ship |
| Image storage | **Supabase Storage** (or Cloudinary) | Store uploaded user photos and scraped product images |
| AI / style analysis | **Claude API (claude-opus-4-6 or claude-sonnet-4-6 with vision)** | Best cost/accuracy ratio for vision tasks; no custom model needed |
| Product data | **Shopping APIs** (see below) | TBD — evaluate RapidAPI options |
| Auth | **Supabase Auth** | Email + Google/Apple login |
| Deployment | **Vercel** | Zero-config Next.js deployment |
| Analytics | **PostHog** (free tier) | Event tracking, funnels, session replay |

---

### How product search works

**Goal**: Given a Style DNA profile, find real, shoppable products that match it at the lowest available price.

**Recommended approach (to validate in spike):**

1. **Primary source — Shopping aggregator APIs via RapidAPI:**
   - `Shopping API by DataFiniti` or `Real-Time Product Search` — returns products with prices across retailers
   - `Google Shopping API (unofficial)` via RapidAPI — broad coverage
   - Query by clothing category + style keywords extracted from Style DNA

2. **Affiliate tracking:**
   - **Amazon Associates** — product links earn 1–10% commission
   - **ASOS Affiliate Program** (via Awin) — fashion-focused, strong conversion
   - **ShareASale / CJ Affiliate** — access to multiple mid-tier fashion retailers
   - Wrap product links through affiliate tracking before showing to user

3. **Price comparison logic:**
   - For a given product (identified by name/SKU/description), query multiple sources and surface the current lowest price
   - If exact product isn't available across retailers, surface the closest style match with the best price

4. **Search query construction:**
   - Claude extracts structured style attributes from Style DNA (e.g., `{"style": "streetwear", "color": "earth tones", "item_type": "oversized hoodie", "aesthetic": "casual minimalist"}`)
   - These attributes become shopping API query terms
   - Filter by user-set price budget (optional)

**Spike tasks before full implementation:**
- Evaluate RapidAPI product search coverage for apparel
- Test affiliate link construction for Amazon + ASOS
- Validate that Claude vision can reliably extract style attributes from user photos

---

### Technical implementation notes

**Style DNA generation flow:**
1. User uploads images / pastes URLs during onboarding
2. For Pinterest URLs: scrape public board images (or use Pinterest API if accessible)
3. Images sent to Claude vision with a structured prompt to extract: color palette, style keywords, clothing categories, aesthetic labels, vibe descriptors
4. Claude returns structured JSON → stored as user's Style DNA profile in Supabase
5. Profile is used as the basis for all product recommendation queries

**Recommendation feed:**
- On login / refresh, feed is generated by querying product APIs with Style DNA attributes
- Results ranked by: style match relevance, price value, freshness
- Results cached per user (refresh daily or on Style DNA update)

**Affiliate link handling:**
- Product links stored with source retailer ID
- At click time, URL is transformed into affiliate-tracked URL before redirect
- Click events logged for reporting

**Data model (simplified):**
```
users: id, email, created_at
style_dna: user_id, attributes (JSONB), palette, labels[], raw_inputs[], updated_at
saved_items: user_id, product_id, saved_at
products: id, title, image_url, category, price, retailer, affiliate_url, style_tags[], fetched_at
feed_items: user_id, product_id, match_score, shown_at
```

---

## Monetization model

### Revenue streams

| Stream | Model | Timeline |
|---|---|---|
| **Affiliate commissions** | Earn % of sale when user clicks through and buys. Amazon: 1–10%; ASOS/fashion retailers: 5–15% | From day 1 |
| **Premium subscription** | Monthly or annual plan unlocking: unlimited recs, price drop alerts, advanced style tools | v2 |

### Subscription tiers (v2 design)

| Tier | Price | Features |
|---|---|---|
| Free | $0 | 10 recommendations/week, basic Style DNA, affiliate links |
| StyleHits Pro | ~$7.99/mo or $59.99/yr | Unlimited recs, price drop alerts, style refresh, deal score |

### Affiliate strategy
- Prioritize retailers with the best commission rates and product coverage
- Track click-through rate (CTR) and conversion per retailer to optimize mix
- Never show a product without an affiliate link attached

---

## Success criteria

### 3-month targets (post-launch)

| Metric | Target |
|---|---|
| Weekly Active Users (WAU) | 500+ |
| Average sessions per user per week | 2+ |
| Style DNA completion rate | >70% of signups |
| Product recommendation CTR | >15% of shown items clicked |
| Affiliate link click-to-buy conversion | >3% |
| 30-day user retention | >25% |

### Leading indicators (weekly tracking)
- Users completing Style DNA onboarding
- Feed engagement: items clicked, saved, dismissed
- Affiliate link clicks per session
- Session length and return frequency

---

## Known risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Shopping API product quality is poor for fashion | Medium | High | Run a product search spike before committing to architecture; evaluate 3+ API sources |
| Claude vision style analysis is inconsistent | Low-Medium | High | Prompt engineering + test with 50+ diverse style inputs before launch; add user correction flow |
| Affiliate commissions are too low to sustain | Medium | Medium | Diversify affiliate partners; model revenue at realistic conversion rates early |
| Pinterest import doesn't work (API restrictions) | High | Medium | Fall back to manual URL paste + screenshot upload; Pinterest scraping as a workaround |
| User churn after Style DNA creation if recs aren't good | Medium | High | Nail recommendation quality before scaling acquisition; use early beta feedback |
| Low conversion on affiliate links | Medium | Medium | A/B test CTA copy, card design, and price display; track per-retailer conversion |
| App feels generic vs. established competitors | Low | High | Invest in design quality and the Style DNA identity; make the profile feel personal and surprising |

---

*Last updated: 2026-03-15 — generated from founder interview session*
*This document is the single source of truth for the StyleHits MVP build.*
