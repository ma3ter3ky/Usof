## CBL Log

### Engage

- Big Idea: knowledge and experience exchange.
- Essential Question: How to help people exchange knowledge?
- Challenge: build a backend API for a Q&A system (StackOverflow-like).

### Investigate

- Read the PDF requirements carefully.
- Analyzed what technologies and patterns are required: JS, Node.js, Express, MySQL, MVC, OOP/SOLID, role-based access, admin panel, informative error handling.

### Act: Basic (Hour 1)

- Initialized local Git repo and connected to GitHub.
- Created `README.md` skeleton and `/docs` folder with files: `architecture.md`, `database.md`, `endpoints.md`, `errors.md`, `cbl.md`.
- Added a draft `openapi.yaml` with minimal structure (contract-first approach).
- Fixed PDF requirements into the `README.md`.
- Applied 12-factor principle: planned `.env` files (no secrets in git).
- Planned first 10 hours roadmap (kept notes in Notion).

**Result:** Repo with minimal docs, `/docs` folder and `openapi.yaml` skeleton created. Ready to proceed to environment and linting setup (Hour 2).

### Act: Basic (Hour 2) — Environment, tooling, linting/formatting

- Installed core runtime deps: express, cors, helmet, compression, dotenv, pino.
- Added ESLint (standard config), Prettier, lint-staged, Husky (v9).
- Configured scripts:
  - `dev` (node --watch), `start`, `lint`, `format`, `test` (placeholder).
- Implemented minimal server with health endpoint and centralized error handler.
- Enabled pre-commit hook (Husky v9) to run lint-staged (Prettier + ESLint) on staged files.
- Verified:
  - `npm run dev` boots and reloads on file changes.
  - `/health` returns 200 OK JSON.
  - Linting and pre-commit gate work as expected.

### Act: Basic — SQL setup (Local MySQL 8)

- Started MySQL server and confirmed it’s running.
- Created dedicated app user `usof` with password auth and two databases: `usof_dev`, `usof_test` (UTF8MB4).
- Wired 12-factor DB config into `.env` and `.env.example`.
- Installed `knex` + `mysql2`, added `knexfile.js` (dev/test) and `src/db.js`.
- Extended `/health` to check DB connectivity (returns `{ status: 'ok', db: 'up' }`).

**Result:** Application reliably connects to local MySQL; dev/test DBs isolated and ready for migrations.

### Act: Basic (Hour 4) — Express skeleton, health, centralized errors

- Created Express skeleton with clear layers: routes, controllers, services, repositories, models (no ORM), middlewares, utils.
- Implemented `/health` with version (from package.json) and DB connectivity check (`db: 'up'`).
- Added `405 Method Not Allowed` for non-GET requests on `/health`.
- Added global `404 Not Found` for unknown routes.
- Implemented centralized JSON error handler with consistent shape and MDN-based status codes.
- Enabled structured request logging using pino-http.
  **Result:** Stable base for future endpoints; unified error format; observability via logs; health endpoint shows app version and DB status.

### Act: Basic (Hour 5) — Testing baseline (ESM with Jest)

- Issue: Jest failed on ESM imports (“Cannot use import statement outside a module”).
- Solution: Run Jest with native ESM:
  - Added `jest.config.js` with `transform: {}`, `extensionsToTreatAsEsm: ['.js']`, `setupFiles`.
  - Set `NODE_OPTIONS=--experimental-vm-modules` in `npm test` scripts.
  - Ensured `.env.test` is used via `dotenv/config` and `tests/jest.env.js`.
- Wrote and passed integration tests:
  - `GET /health` → `200` + `{ status: 'ok', db: 'up' }` + version.
  - 404 for unknown routes and 405 for non-GET on `/health`.

**Result:** Jest reliably runs ESM tests against the test DB; green baseline achieved.

### Act: Basic (Hour 6) — Database migrations

- Implemented schema migrations with Knex for entities required by PDF:
  - users, categories, posts, post_categories, comments, likes, email_verification_tokens, password_reset_tokens.
- Added constraints and indexes:
  - users: unique login/email, role enum (user/admin).
  - posts/comments: status enum (active/inactive), is_locked.
  - likes: unique author+target (post or comment), CHECK constraint for exclusive target.
  - FKs with CASCADE on delete where appropriate.
- Fixed rollback logic: removed invalid `DROP TYPE` statements (MySQL enums are column-scoped, not global types).
- Verified cycle: `db:migrate` → schema created; `db:rollback` → schema dropped cleanly.
- Observed internal Knex tables (`knex_migrations`, `knex_migrations_lock`) which track applied migrations and concurrency locks.

**Result:** Stable, normalized DB schema ready for seeding; migrations/rollback run cleanly.

### Act: Basic (Hour 7) — README test accounts + reset scripts

- Documented seeded test accounts (admin + 4 users) with emails, usernames, passwords, and verification flags.
- Noted avatar locations in `seeds/uploads/avatars` and how to expose them in dev if needed.
- Added convenience scripts:
  - `reset:dev` → rollback → migrate → seed (development DB)
  - `reset:test` → same flow for the test DB (uses `.env.test`)

**Result:** Faster local iteration; reviewers have clear credentials; data/files are reproducible.

### Act: Basic (Hour 8) — Auth: register, verify, login (verified only), reset request

- Added Joi validation for register/login/reset endpoints.
- Implemented registration with bcrypt hashing, verification token creation, and email delivery via Nodemailer (Ethereal in dev).
- Implemented email verification endpoint; enforces verified-only login.
- Implemented password reset request (token + email), confirmation deferred to Hour 9.
- Issued JWT access/refresh tokens on successful login.
- Updated OpenAPI spec with new auth endpoints and response codes.

**Result:** Secure auth baseline with email proof-of-ownership; flows testable via Postman and Ethereal previews.

### Act: Basic (Hour 9) — JWT sessions, refresh, logout, reset confirm, RBAC

- Implemented access (short TTL) + refresh (httpOnly cookie) JWTs with `ver` claim.
- Added `/api/auth/refresh` to rotate refresh and mint new access.
- Added `/api/auth/logout` to bump `users.refresh_token_version` and clear cookie.
- Added `/api/auth/password-reset/:token` to confirm password change (bcrypt).
- Introduced `requireAuth` and `requireRole('admin')` middlewares.
- Verified E2E via cURL: login → refresh → logout → refresh (401 invalidated).

### Act: Basic (Hour 10) — Users/Categories skeleton + AdminJS

- Created placeholder REST endpoints for users & categories according to PDF spec.
- Secured admin-only routes with requireAuth + requireRole('admin').
- Mounted minimal AdminJS dashboard under `/admin` (role: admin only).
- Updated openapi.yaml, endpoints.md and cbl.md with access matrix & progress.
