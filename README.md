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

## License

MIT.
