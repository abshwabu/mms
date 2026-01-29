# MMS Users & Auth (minimal)

Quick scaffold for Users & Auth using Express + JWT and a simple JSON file user store.

Run

```bash
npm install
npm start
```

Endpoints

- `POST /auth/register` { username, password, email? }
- `POST /auth/login` { username, password } -> { token }
- `GET /users/me` (Authorization: Bearer <token>)

Config

- `JWT_SECRET` environment variable (defaults to `change-me` if not set)
