# Bulk Mail (MERN)

## Run locally

From the repository root:

```bash
npm install
```

Copy `server/.env.example` to `server/.env` and set the MongoDB, admin, and
SMTP values. Start the API and frontend in separate terminals:

```bash
npm run dev --workspace bulk-mail-server
npm run dev --workspace bulk-mail-client
```

The Vite development server runs at http://localhost:5173 and proxies API
requests to the server on port 5000. Gmail SMTP requires 2-Step Verification
and a Gmail App Password (not your regular account password).

## API

- `POST /api/auth/login` with `{ "email", "password" }` returns a JWT.
- `POST /api/mail/send` with `{ "subject", "body", "recipients": [] }` sends
  individual messages.
- `GET /api/mail/history` returns recent campaigns.

## Deploy to Vercel

Import this repository into Vercel with the project root set to the repository
root. The root workspace builds the frontend into `client/dist` and serves the
Express API as a Vercel Function.

Configure these environment variables in Vercel for the environments you use:
`MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. Use a persistent MongoDB
Atlas database and a Gmail App Password. Never commit `server/.env` or expose
secrets as frontend variables.
