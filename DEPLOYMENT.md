# Deployment

This is a monorepo with a Node/Express API server and a static React SPA. Both pieces can be hosted cheaply and independently.

## Recommended architecture

```
        ┌──────────┐
        │   CDN    │  ←  client/  (Vite build → static)
        └────┬─────┘
             │
        ┌────┴─────┐
        │   API    │  ←  server/  (Express)
        └────┬─────┘
             │
   ┌─────────┼─────────┐
   │         │         │
┌──┴──┐   ┌──┴──┐   ┌──┴──┐
│Mongo│   │Redis│   │S3 / │
│ Atlas│   │     │   │ CDN │
└─────┘   └─────┘   └─────┘
```

## Server (Render / Railway / Fly / VPS)

1. **Build command:** `npm install --production=false && npm --prefix client install --production=false && npm --prefix client run build`
2. **Start command:** `node server/server.js` (the server serves the built client from `client/dist` if `NODE_ENV=production`, or you can let the CDN host it and keep the API separate)
3. **Env vars** (set in the platform's dashboard — never commit):
   - `NODE_ENV=production`
   - `PORT` (platform-assigned)
   - `MONGO_URI` (Atlas connection string)
   - `JWT_SECRET` (long random)
   - `JWT_EXPIRES_IN=7d`
   - `REDIS_URL` (optional)
   - `CLIENT_URL` (your frontend origin, for CORS)
4. **Health check:** `GET /api/health` → `{ status: 'ok' }`

## Client (Vercel / Netlify / Cloudflare Pages / S3+CloudFront)

The simplest split: **host the client and server on the same platform but separate concerns**.

- Vite build output is `client/dist/`
- If the same host serves both, set `VITE_API_URL` to the relative path `'/api'`
- If the client and server are on different hosts, set `VITE_API_URL` to the full API origin (e.g. `https://api.example.com/api`) and ensure the server's CORS allows it

### Vercel (client only)

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### Netlify (client only)

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (M0) — 512 MB is plenty for this app.

1. Create a cluster, whitelist `0.0.0.0/0` (or your server's IP) for access
2. Create a database user
3. Copy the connection string and put it in `MONGO_URI`
4. After first deploy, run the seed: `npm run seed` against the Atlas URI

## Redis

Optional. The app logs a warning and continues if Redis is unreachable. For production caching, use [Upstash](https://upstash.com) free tier — the connection is plain `redis://default:<password>@<host>.upstash.io:6379`.

## CORS

`CLIENT_URL` must match the deployed client origin (no trailing slash). Multiple origins are not supported by the default config — extend `server.js` to allow an array if you need it.

## Rate limiting

`/api/auth/*` is rate-limited (10 req / 15 min / IP). If you put the API behind a CDN/load balancer, add the proxy IP to Express's `trust proxy` setting.

## Security checklist

- [ ] `JWT_SECRET` is a 32+ char random string
- [ ] `NODE_ENV=production`
- [ ] `.env` is NOT committed (it's gitignored)
- [ ] MongoDB Atlas user has least-privilege access (readWrite to a single DB)
- [ ] HTTPS everywhere (platform default)
- [ ] Helmet is enabled (it is, by default)
- [ ] CORS restricted to your client origin
- [ ] Rate limiting on auth routes (it is, by default)

## Post-deploy

```bash
# 1. seed production DB
MONGO_URI="mongodb+srv://..." npm run seed

# 2. verify
curl https://api.example.com/api/health
curl https://api.example.com/api/destinations | jq '.[0]'
```

## Monitoring

Free tiers that work well:

- **Logs:** platform-native (Render/Railway logs)
- **Errors:** [Sentry](https://sentry.io) (drop in `@sentry/react` + `@sentry/node`)
- **Uptime:** [BetterStack](https://betterstack.com) or [UptimeRobot](https://uptimerobot.com) (ping `/api/health`)
