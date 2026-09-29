# Médoc Vibes API — AdonisJS

Local boot (SQLite by default, no Postgres required):

```bash
cp .env.example .env
node ace generate:key
npm install
npm run dev
```

Postgres (Dokploy / infra): set `DATABASE_URL` on the container.
**Port:** Dokploy injects / maps `PORT` — bind `HOST=0.0.0.0` and read `PORT` from env.

See root README + `.env.example`.
