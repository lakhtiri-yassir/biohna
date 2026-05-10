# Biohna — Project Context

> **How to use this file:** At the start of any new conversation, tell the assistant:
> *"Read CONTEXT.md at the root of the project before doing anything."*
> This gives instant project orientation without needing conversation history.

---

## What This App Is

**Biohna** is a Moroccan artisan e-commerce marketplace. It connects natural-product cooperatives/vendors with consumers, selling organic honey, argan oil, spices, cosmetics, and traditional foods. The brand emphasises bio-certification, regional heritage, and sustainable artisan partnerships.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Runtime | React | 19.2.4 |
| Database | PostgreSQL via Neon | — |
| ORM | Prisma | 5.22.0 |
| Auth | NextAuth.js (Credentials) | 4.24.14 |
| Password hashing | bcryptjs | 3.0.3 |
| Animations | Framer Motion | 12.38.0 |
| i18n | i18next + react-i18next | 26.x / 17.x |
| Styling | CSS custom properties + inline style objects | — |
| Linting | ESLint flat config (v9) | — |

> **IMPORTANT:** Next.js 16 has breaking changes vs. earlier versions. Before writing any Next.js-specific code, read `node_modules/next/dist/docs/` and heed AGENTS.md.

### Import alias
`@/*` maps to `./` (project root) — use `@/components/…`, `@/lib/…`, `@/context/…`, etc.

---

## Directory Map

```
app/                   Next.js App Router pages + API routes
  api/                 All backend endpoints (see API Routes section)
  cart/                Cart page
  favoris/             Wishlist page
  login/               Login page
  produits/            Products browse + [id] detail
  signin/              Multi-step registration
  profile/             User profile
  vendeurs/            Vendor directory + [id] detail
  layout.js            Root layout
  page.jsx             Home / landing page
  template.js          Page transition wrapper (Framer Motion)
  globals.css          CSS custom properties + design tokens

components/            Reusable client components
  modals/              PanierModal, CategoriesModal, ContactModal, FavoritesModal, VendeurModal
  NavBar.jsx           Fixed header (logo, links, search, cart, favourites, theme, lang, profile)
  Providers.jsx        Root providers + background orbs + modal portals
  ProfileDropdown.jsx  User menu
  MobileMenu.jsx       Mobile nav drawer
  LanguagePicker.jsx   FR / EN / AR / TZ selector
  ThemeToggle.jsx      Dark / light toggle
  SortDropdown.jsx     Product sort options
  PageWrapper.jsx      Layout wrapper
  ViewportScale.jsx    Responsive scaling utility

context/
  AuthContext.jsx      Auth state, login(), logout(), profile update
  ThemeContext.jsx     Dark/light mode (persisted to localStorage)
  ModalContext.jsx     Which modal is open (global)

hooks/
  useIsNarrow.js       true when viewport < 768 px
  useDirection.js      { isRTL, dir, flip() } for RTL languages

i18n/
  index.js             i18next config (4 languages, lazy namespace loading)
  locales/fr|en|ar|tz/ Translation JSON files (common, home, products, auth, profile, vendors, cart, modals, data)

lib/
  auth-options.js      NextAuth Credentials provider + JWT/session callbacks
  prisma.js            Singleton Prisma client
  response.js          successResponse() / errorResponse() helpers
  validation.js        requireFields(), isValidRating()

prisma/
  schema.prisma        Full data model
  migrations/          Migration history
  seed.js              Seed script

utils/
  rtl.js               CSS property flipper for RTL (left↔right, padding, margin)

assets/                Static images + video (logos, hero media)
public/                Next.js public folder
```

---

## Data Model (Prisma Schema)

```
User          id·firstName·lastName·email·phone?·passwordHash?·picture?·createdAt·updatedAt·deletedAt?
              → settings (1:1), orders (1:N), reviews (1:N), addresses (1:N)

UserSettings  id·userId·language(fr)·currency(MAD)·notificationsEnabled·createdAt·updatedAt

Vendor        id·storeName·storeAddress?·storePhone?·commissionRate(10%)·createdAt·updatedAt
              → products (1:N), orderItems (1:N)

Category      id·name·slug·parentId? (self-referential tree)
              → parent/children (self), products (1:N)

Product       id·vendorId·categoryId?·name·description?·price·stockQuantity(0)·bioCertified·status·createdAt·updatedAt
              → vendor, category, pictures (1:N), reviews (1:N), orderItems (1:N)
              status enum: ACTIVE | INACTIVE | DRAFT | ARCHIVED

ProductPic    id·productId·imageUrl   (CASCADE delete with product)

ProductReview id·productId·userId·rating(1-5)·content?·createdAt
              unique: (productId, userId)

Order         id·userId·totalAmount·status·paymentMethod·createdAt·updatedAt
              status enum: PENDING | PAID | SHIPPED | COMPLETED | CANCELLED
              paymentMethod enum: CARD | CASH | APPEL | TRANSFER
              → user, items (1:N), shipping (1:1)

OrderItem     id·orderId·productId·vendorId·quantity·pricePerUnit

ShippingInfo  id·orderId·recipientName·addressLine1·city·postalCode?·phone?·shippingMethod
              shippingMethod enum: STANDARD | EXPRESS | PICKUP

Address       id·userId·rue·ville·region?·codePostal?·isDefault
```

---

## API Routes

All responses follow `{ success: boolean, data?: any, error?: string }`.

### Auth
| Route | Method | Notes |
|---|---|---|
| `/api/auth/register` | POST | Creates User + UserSettings in transaction; bcrypt 12 rounds |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler; JWT strategy |

### Users
| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/users/me` | GET | ✓ | Returns user + settings + addresses |
| `/api/users/me` | PATCH | ✓ | Update firstName, lastName, phone, picture (one field required) |

### Products
| Route | Method | Notes |
|---|---|---|
| `/api/products` | GET | Filters: `category`, `vendor`, `search`, `bio`, `minPrice`, `maxPrice`, `page`, `limit` |
| `/api/products` | POST | Create product; body: vendorId, name, price, + optionals |
| `/api/products/[id]` | GET | Single product with vendor, category, pictures |

### Vendors
| Route | Method | Notes |
|---|---|---|
| `/api/vendors` | GET | All vendors with product counts |
| `/api/vendors/[id]` | GET | Single vendor |

### Categories
| Route | Method | Notes |
|---|---|---|
| `/api/categories` | GET | Hierarchical tree (parent → children) |

### Orders
| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/orders` | POST | ✓ | Body: userId, paymentMethod, cart[], shipping{} |
| `/api/orders/[id]` | GET | ✓ | Order with items, shipping, user |

### Reviews
| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/reviews` | POST | ✓ | rating 1–5, unique per (productId, userId) |

### Payment
| Route | Method | Notes |
|---|---|---|
| `/api/payment/initiate` | POST | **Stub only** — returns mock transactionId. CMI/PayZone integration pending. |

---

## Auth Flow

1. **Register** → `POST /api/auth/register` → bcrypt hash → DB transaction (User + UserSettings) → auto-login via `AuthContext.login()`
2. **Login** → `AuthContext.login(email, pass)` → `signIn('credentials')` → NextAuth Credentials provider → `authorize()` queries DB, verifies bcrypt → returns user object
3. **Session** → JWT callbacks enrich token/session with id, email, name, phone, picture, settings
4. **Protection** → API routes call `getServerSession(authOptions)` → 401 if unauthenticated

---

## i18n & RTL

- **Languages:** `fr` (default), `en`, `ar`, `tz` (Tamazight)
- **RTL languages:** Arabic and Tamazight — `useDirection()` returns `{ isRTL: true, dir: 'rtl' }`
- **CSS flipping:** `utils/rtl.js` flips left/right CSS properties for RTL layouts
- **Persistence:** `biohna_lang` in localStorage
- **DOM:** `html[lang]`, `html[dir]`, `html[data-lang]` updated on language change
- **Namespaces:** common · home · products · auth · profile · vendors · cart · modals · data

---

## Styling Conventions

- **No CSS framework** — all styles via inline `style={{}}` objects + CSS custom property tokens
- **Tokens** defined in `app/globals.css`: `--bg-base`, `--text-primary`, `--accent-gold`, `--shadow-card`, etc.
- **Theme switching** via `data-theme="dark|light"` on `<html>`; tokens defined per attribute selector
- **Glass-morphism** — backdrop-filter blur on nav, modals, cards
- **Fonts:** Anton SC (display) · Cormorant Garamond (serif) · Anek Latin (body) · Noto Sans/Kufi Arabic · Noto Sans Tifinagh
- **Core accent:** gold `#d4af37` / deep green `#061108` / cream `#faf9f6`
- **Animations:** Framer Motion for page transitions, entrance animations, hover/tap

---

## Responsive Design

- **Breakpoint:** 768 px (`useIsNarrow()` hook → boolean)
- **Pattern:** `{!isNarrow && <DesktopEl />}` or ternary style values
- **Mobile nav:** hamburger → `MobileMenu.jsx` drawer
- **Grid:** 2-col mobile, 3+ col desktop

---

## State Management

| Concern | Mechanism |
|---|---|
| Auth | `AuthContext` (useContext) |
| Theme | `ThemeContext` (useContext + localStorage) |
| Modal visibility | `ModalContext` (useContext) |
| Form state | Local `useState` per component |
| Server data | `fetch()` in `useEffect` (client-side, no SWR/React Query) |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled) |
| `DIRECT_URL` | Direct PostgreSQL connection (bypasses proxy) |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `NEXTAUTH_URL` | NextAuth callback base URL |

All must be in `.env.local` (git-ignored).

---

## Scripts

```bash
npm run dev                # Dev server
npm run build              # prisma generate → prisma migrate deploy → next build
npm run start              # Production server
npm run lint               # ESLint
```

---

## Known Gaps / In-Progress

- **Payment:** `/api/payment/initiate` is a stub. Real CMI/PayZone integration not yet built.
- **Vendor portal:** Vendor application form exists in UI (`/signin` step 3), but no admin approval flow in code.
- **Image upload:** `ProductPic.imageUrl` stores URLs, but no file-upload API route exists yet.
- **Cart persistence:** Cart state not yet confirmed to be persisted (check ModalContext / PanierModal).
- **Admin panel:** No admin routes exist in the codebase.

---

## Prisma Error Codes to Watch

| Code | Meaning |
|---|---|
| P2002 | Unique constraint violation |
| P2003 | Foreign key constraint violation |
| P2025 | Record not found |
