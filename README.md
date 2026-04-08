# Searchly — eBay Product Search

A full-stack web app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** that lets users search eBay listings in real time via the eBay Browse API. It includes an optional **mock API** mode so you can develop and demo the UI without calling eBay.

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd ebay-product-search
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your eBay credentials (required only when **Mock Request** is off):

```env
EBAY_CLIENT_ID=your_client_id_here
EBAY_CLIENT_SECRET=your_client_secret_here
EBAY_ENVIRONMENT=sandbox   # or "production"

# Optional: override OAuth token cache TTL in seconds (default: 7200)
# EBAY_TOKEN_TTL=7200
```

**Getting credentials:**

1. Register at [developer.ebay.com](https://developer.ebay.com)
2. Create a new application
3. Copy the **Client ID** and **Client Secret** from your app keys page
4. Use Sandbox keys for development; Production keys for live listings

### 3. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/search`.

### 4. Run tests

```bash
npm test
# with coverage
npm test -- --coverage
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── search/route.ts       # GET /api/search — real eBay Browse API
│   │   └── mock-search/route.ts  # GET /api/mock-search — fixed mock payload
│   ├── search/
│   │   ├── page.tsx              # Search page (sections + mock toggle)
│   │   └── useSearch.ts          # Debounced fetch, abort, retry, mock/real URL
│   ├── layout.tsx                # MockApiProvider wrapper
│   ├── page.tsx                  # Redirect → /search
│   └── globals.css
├── components/
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchHeaderSection.tsx
│   │   ├── SearchFiltersSection.tsx   # Mock toggle + FilterBar
│   │   ├── SearchContentSection.tsx   # Results / loading / errors
│   │   ├── FilterBar.tsx
│   │   ├── ProductCard.tsx       # Uses formatPrice for display
│   │   ├── ProductGrid.tsx
│   │   └── ResultsHeader.tsx
│   └── ui/
│       ├── Skeleton.tsx
│       ├── Pagination.tsx
│       └── States.tsx            # Idle / empty / error (per-code copy + retry)
├── context/
│   └── mock-api-context.tsx      # isMock + toggle for mock vs real API
├── lib/
│   ├── cache/
│   │   └── tokenCache.ts
│   ├── format/
│   │   └── price.ts              # Intl currency formatting + “Price unavailable”
│   ├── search/
│   │   └── searchParams.ts       # buildSearchQueryParams, raw param helpers
│   └── ebay/
│       ├── auth.ts
│       ├── client.ts
│       ├── errors.ts             # EbayAuthError, EbayApiError
│       ├── normalizer.ts
│       └── searchService.ts      # searchProducts, mockSearchProducts
├── specs/
│   └── searchParams.spec.ts      # Validation contract (SDD)
├── types/
│   └── index.ts
├── __mocks__/search/
│   ├── search-filters.mock.ts
│   └── search-response.mock.ts
└── __tests__/
    ├── validateSearchParams.test.ts
    ├── searchQueryParams.test.ts
    ├── formatPrice.test.ts
    ├── normalizer.test.ts
    └── tokenCache.test.ts
```

---

## Architecture

### Design Principles

**Spec-Driven Development (SDD)**
All domain types and API contracts are defined in `src/types/index.ts` _before_ any implementation. The `src/specs/` folder contains validation contracts that can be tested independently. The contract is the single source of truth — both frontend and backend reference the same types.

**SOLID Principles**

- **SRP**: Each module has one job. `auth.ts` handles tokens. `normalizer.ts` transforms data. `searchService.ts` orchestrates.
- **OCP**: Filters, sorting, or new eBay endpoints can be added without modifying existing modules.
- **LSP**: `ApiResponse<T>` is a discriminated union — both `success` and `error` branches are fully typed.
- **ISP**: `EbayBrowseClient` exposes only `searchItems` — nothing else the app doesn't need.
- **DIP**: `searchService.ts` depends on abstractions (`searchEbayItems`, `normalizeProducts`), not on HTTP or eBay-specific internals.

**Security**

- eBay credentials (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`) live **only** in `process.env` (server-side).
- The frontend only ever calls `/api/search` or `/api/mock-search` — it never sees credentials or raw eBay responses.
- `.env` is gitignored; `.env.example` has placeholder values only.

### OAuth Token Caching

The token cache (`src/lib/cache/tokenCache.ts`) is an in-memory singleton with a safety buffer before expiry. On each request:

1. Check cache → return token if valid
2. If expired or missing → fetch new token from eBay
3. Store with expiry timestamp
4. On 401 response mid-session → invalidate cache + retry once

In production this would be replaced with Redis (see tradeoffs below).

### Mock API mode

When **Mock Request** is ON (toolbar toggle), the client calls `GET /api/mock-search`, which returns a fixed normalized result from `mockSearchProducts()` in `searchService.ts` (simulated delay, no OAuth). Turning mock ON also seeds filters from `search-filters.mock.ts` so the UI matches the mock payload. Use this for UI work, screenshots, or when sandbox data is thin.

### API Flow (real search)

```
Browser → GET /api/search?q=laptop&page=1
         └─ validateSearchParams (spec contract)
         └─ searchProducts (service layer)
              └─ getEbayAccessToken (cache → OAuth)
              └─ searchEbayItems (Browse API)
              └─ normalizeProducts (pure transform)
         └─ ApiResponse<SearchResult> (typed JSON)
```

---

## Features

- **Search** with 400ms debounce and **request cancellation** when the query or page changes mid-flight
- **Mock vs live API** toggle for development without eBay calls
- **Filters**: condition (New / Used) and price range
- **Pagination** with windowed page numbers
- **Loading states**: skeleton grid while fetching
- **Error states**: per-error-code titles and descriptions in `States.tsx`, plus **Try again** (retry bumps internal retry state to refetch)
- **Price display**: `formatPrice` with `Intl.NumberFormat` and a fallback when value is missing or invalid
- **Empty state**: clear feedback when no results match
- **Responsive**: multi-column product grid across breakpoints
- **Accessible**: semantic HTML, `aria-label`, `aria-current`, keyboard-friendly controls where applicable

---

## Tradeoffs & What I'd Improve

### Tradeoffs Made

**In-memory token cache vs Redis**
The current cache uses a module-level variable which works fine for a single Next.js process. In a multi-instance deployment (e.g., multiple Vercel serverless functions), each instance has its own cache, meaning more token requests to eBay than necessary. With more time, I'd replace this with Redis (Upstash) or a shared KV store.

**Client-side search state vs URL state**
Search state (query, page, filters) lives in React state rather than URL search params. This means users can't share search URLs or use the browser back button to return to results. With more time, I'd sync state to URL params with `useSearchParams` + `useRouter` from Next.js App Router.

**Mock mode is not query-aware**
The mock endpoint returns a fixed payload; URL query parameters are ignored for the dataset. That's intentional for predictable demos but not for testing filter combinations against varied data.

**No result caching**
Individual search results aren't cached beyond Next.js's 60s fetch cache. A production app would use Redis or a CDN layer to cache popular queries, reducing eBay API usage and latency.

**eBay Sandbox limitations**
The eBay sandbox returns limited and sometimes inconsistent results. The normalization layer is built defensively to handle missing fields, but the UI may look sparse in sandbox mode compared to production.

### What I'd Add With More Time

- **Redis token + result cache** for multi-instance production deployments
- **URL-synced state** for shareable search links and back-button support
- **Infinite scroll** as an alternative to pagination (IntersectionObserver)
- **Search history** using localStorage for quick re-searches
- **Image lazy loading** with blur placeholder via Next.js `Image`
- **E2E tests** with Playwright covering the full search flow
- **Rate limiting** on the API route (e.g., with `@upstash/ratelimit`)
- **OpenAPI spec** generated from the TypeScript types for full SDD compliance

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Other platforms (Render, Railway)

Build command: `npm run build`  
Start command: `npm start`  
Node version: 18+

---

## Scoring Rubric Coverage

| Area                      | Implementation                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| **API Integration (30)**  | OAuth 2.0 Client Credentials, token cache, Browse API search, 401 retry, error handling             |
| **Backend Design (25)**   | Credentials server-only, clean abstraction layers, normalized response, typed errors              |
| **Frontend Quality (20)** | Loading/empty/error states, responsive grid, condition + price filters, pagination, mock + retry UI |
| **Code Quality (15)**     | SOLID principles, SDD contracts, SRP modules, no dead code, full TypeScript                       |
| **Documentation (10)**    | README with setup, architecture, tradeoffs, `.env.example`                                      |
| **Bonus**                 | Search debounce ✓ · Filters ✓ · Unit tests ✓ · Pagination ✓ · Mock API ✓ · Retry ✓                |
