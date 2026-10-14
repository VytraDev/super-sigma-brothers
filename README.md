# Super Sigma Brothers

A local plumbing visit booking app for Sigmo Mission 12. Select a house, view its visits and book a date and hour. All dates and times use Malaysia time. Seed owners and streets are fictional.

## Run it

Use Node 24. Create a Supabase project, then run `server/db/schema.sql` once in its SQL editor. Copy `server/.env.example` to `server/.env`. In Supabase's Connect dialog, choose the Session pooler and copy its connection string into `DATABASE_URL`, replacing the password placeholder. URL-encode special characters in the password.

In one terminal:

```sh
cd server
npm install
npm run dev
```

In a second terminal:

```sh
cd client
npm install
npm run dev
```

Open the Local URL printed by Vite, usually http://127.0.0.1:5173. If that port is occupied, Vite chooses the next available port. Run `npm test` in `server`. Run `npm run lint` and `npm run build` in `client`.
