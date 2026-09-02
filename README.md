# MS Tours & Travels

A complete, production-ready MERN travel-OTA web app — packages, hotels, and flights, all in one place. Bold 90s/Y2K visual design (think **decathlonyestalgia.com** meets the functional flow of **travrun.com**).

## Stack

- **Frontend:** React 18, Vite, React Router v6, Redux Toolkit, redux-persist, Framer Motion, Tailwind CSS, react-icons, react-helmet-async
- **Backend:** Node 18+, Express 4, Mongoose 8, MongoDB 6+, Redis (optional, soft-fail), JWT auth, bcryptjs, helmet, express-rate-limit
- **Monorepo:** npm workspaces (root + `/client` + `/server`)

## Quick start

```bash
# 1. install
npm install

# 2. configure env
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, etc.

# 3. seed the database (drops + re-inserts)
npm run seed

# 4. dev mode (concurrently starts server :5000 and client :5173)
npm run dev
```

Open <http://localhost:5173>.

## Project structure

```
MS-Tours/
├── client/                     React SPA
│   ├── src/
│   │   ├── api/                Axios + per-resource modules
│   │   ├── components/         Layout, common, cards, forms, gallery, booking
│   │   ├── constants/          Mirrored seed data + design tokens
│   │   ├── hooks/              useForm, useAuth, useFetch, useDebounce, useScrollReveal, useToast
│   │   ├── pages/              15 page components (Home, BookingFlow, Dashboard, …)
│   │   ├── router/             ProtectedRoute
│   │   ├── store/              Redux Toolkit slices + persist
│   │   ├── utils/              Formatters, image helpers, animation variants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js          @/ alias + /api proxy + manualChunks code-split
└── server/                     Express API
    ├── server.js
    └── src/
        ├── config/             db, redis
        ├── controllers/
        ├── data/               Seed data (USERS, DESTINATIONS, PACKAGES, HOTELS, FLIGHTS, REVIEWS, BOOKINGS)
        ├── middleware/         auth, error, validate, asyncHandler
        ├── models/             Mongoose schemas
        ├── routes/             9 resource routers
        ├── seed/seed.js
        └── utils/              generateToken, generateBookingRef, AppError
```

## Key flows

- **Browse** Home → Hero search (Packages | Hotels | Flights tabs) → results with filters, sort, pagination
- **Detail** → image gallery, itinerary, amenities, reviews + ReviewForm, sticky "Book now"
- **Booking** → 3-step flow (Dates & options → Traveler details → Payment) with live price summary, success screen
- **Dashboard** → tabs for Upcoming, History, Profile, Favorites
- **Auth** → JWT stored in localStorage, redux-persisted; ProtectedRoute + guest guard preserve redirect

## API

- `GET  /api/health`
- `POST /api/auth/register | /login` · `GET /api/auth/me`
- `GET  /api/destinations | /:id`
- `GET  /api/packages | /search | /featured | /:id`
- `GET  /api/hotels | /search | /:id`
- `GET  /api/flights/search | /:id`
- `GET  /api/reviews/package/:id | /hotel/:id` · `POST /api/reviews`
- `POST /api/bookings` · `GET /api/bookings | /:id` · `PATCH /api/bookings/:id/cancel`
- `GET/PUT /api/users/profile` · `GET/POST/DELETE /api/users/favorites`
- `POST /api/payments/process` (mock — swap for Stripe/Razorpay, see `server/src/controllers/payment.controller.js`)

## Scripts

| From root         | What it does                         |
|-------------------|--------------------------------------|
| `npm run dev`     | Start server + client concurrently   |
| `npm run seed`    | Drop & re-seed MongoDB               |
| `npm run build`   | Build client (Vite)                  |
| `npm start`       | Start server in production mode      |

| From `/server`    | What it does                         |
|-------------------|--------------------------------------|
| `npm run dev`     | Nodemon                              |
| `npm start`       | Node                                 |
| `npm run seed`    | Run seed script                      |

| From `/client`    | What it does                         |
|-------------------|--------------------------------------|
| `npm run dev`     | Vite dev server                      |
| `npm run build`   | Production build                     |
| `npm run preview` | Preview the build                    |

## Seed data

After `npm run seed` you'll have:
- 4 users (1 admin, 3 travellers)
- 10 destinations (Goa, Kerala, Rajasthan, Kashmir, Himachal, Ladakh, Andaman + Bangkok, Bali, Dubai)
- 18 packages (with itineraries, highlights, inclusions/exclusions, prices in INR)
- 10 hotels (with room types, amenities, prices in INR)
- 12+ flights (multiple carriers, fare classes)
- 12 reviews, 6 bookings

Aggregate ratings on packages + hotels are recomputed from the inserted reviews.

## Environment variables

See `.env.example` for the full list. Critical ones:

| Var           | Purpose                                            |
|---------------|----------------------------------------------------|
| `MONGO_URI`   | MongoDB connection string                          |
| `JWT_SECRET`  | Long random string — used to sign JWTs             |
| `REDIS_URL`   | Optional. App runs without Redis (cache soft-fail) |
| `CLIENT_URL`  | Used for CORS allow-list                           |
| `VITE_API_URL`| Injected into client build for the axios base URL  |
| `TRAVELPORT_*`| Travelport uAPI integration — see below           |

## Design system

Defined in `client/tailwind.config.js`:

- **Fonts:** Fredoka (headings), Inter (body)
- **Palette:** green `#00C853`, orange `#FF6D00`, sky `#00B0FF`, violet `#7C4DFF`, rose `#FF4081`, mint `#69F0AE`, navy `#1A1A2E`, cream `#FFF8E1`
- **Shadows:** `shadow-retro` (hard offset), `shadow-card-soft`, `shadow-card-lift`
- **Keyframes:** float, wiggle, spin-slow, shimmer
- **A11y:** `MotionConfig reducedMotion="user"` honors the OS setting; focus rings preserved on `:focus-visible`

## Payment

The `/api/payments/process` endpoint is a **mock** — it sleeps ~800ms and flips the booking's `paymentStatus` to `paid`. To swap in a real provider:

1. Install Stripe (or Razorpay) SDK
2. In `server/src/controllers/payment.controller.js`, create a PaymentIntent server-side and return its client secret
3. In `client/src/components/booking/PaymentForm.jsx`, mount the provider's Elements / Checkout
4. Webhook → mark booking paid (idempotent)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md). The client is a static SPA; the server is a small Node process. MongoDB Atlas free tier works for the data layer.

## Travelport uAPI integration

The `/api/travelport/*` route group talks to Travelport Universal API (SOAP). All four operations are wired and stub-driven, so the flow works end-to-end with **zero credentials** today — when you fill in the env vars, the same code switches to live without any change to call sites.

**Three modes** (`TRAVELPORT_MODE`):

- `demo` (default) — `/flights` shows only the local catalog. Live toggle hides.
- `stub` — "Live fares" toggle shows simulated offers from `server/src/integrations/travelport/fixtures/*.xml`, plus a yellow banner. Booking creates a real Mongo `Booking` with `provider:'travelport'` and a fixed PNR (`6NKJ2K`). The lookup page retrieves the same fixture. **Use this while developing without creds.**
- `live` — Hits the real uAPI SOAP endpoints (`apicert.travelport.com` for cert, `apis.travelport.com` for prod). Requires credentials.

**Two auth schemes** (`TRAVELPORT_AUTH`):

- `oauth` (default) — `client_credentials` bearer token fetched from `TRAVELPORT_TOKEN_URL` (default cert OAuth URL is pre-filled).
- `wsse` — legacy WS-Security `<UsernameToken>` in the SOAP header (built by `server/src/integrations/travelport/soap.js`).

**To go live:**

1. Sign up at https://developer.travelport.com (uAPI).
2. From your account manager, get: PCC, Target Branch, username, password, API key.
3. Fill the matching `TRAVELPORT_*` vars in `.env` (see `.env.example` for annotated block).
4. Set `TRAVELPORT_MODE=live` and `TRAVELPORT_ENV=cert` (switch to `prod` when you have a production PCC).
5. Restart the server. The yellow "Simulated live data" banner disappears, and `GET /api/travelport/status` returns `{ credsConfigured: true, mode: 'live' }`.

**Stub fixture set** (sample locator `6NKJ2K`):

- `lowfare.xml` — 3 offers DEL ⇄ BOM
- `createPnr.xml` — booking confirmation
- `retrievePnr.xml` — full itinerary with 1 segment
- `cancelPnr.xml` — void confirmation

**Route map:**

| Method | Path                          | Auth     | Purpose                                    |
|--------|-------------------------------|----------|--------------------------------------------|
| GET    | `/api/travelport/status`      | public   | Tells the client which mode is active      |
| POST   | `/api/travelport/search`      | public   | LowFareSearchReq → offers                  |
| POST   | `/api/travelport/pnr`         | protect  | UniversalRecordCreateReq → booking + PNR   |
| GET    | `/api/travelport/pnr/:locator`| protect  | UniversalRecordRetrieveReq → itinerary     |
| DELETE | `/api/travelport/pnr/:locator`| protect  | UniversalRecordCancelReq → void + refund   |

Search results are cached server-side in Redis for 180s, keyed by request hash. Live offers are not persisted — the seeded catalog stays authoritative for demo mode.

## License

MIT.
