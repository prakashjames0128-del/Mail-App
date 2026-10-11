# Bulk Mail (MERN)

## Run
```bash
# 1. API
cd server && cp .env.example .env   # fill in Mongo, admin login, SMTP creds
npm install && npm run dev

# 2. UI (new terminal)
cd client && npm install && npm run dev   # http://localhost:5173
```
Gmail SMTP needs 2-Step Verification + an App Password (not your normal password).

## API
- POST /api/auth/login  {email, password} -> {token}
- POST /api/mail/send   {subject, body, recipients[]}   (Bearer token)
- GET  /api/mail/history                                (Bearer token)
