# Phase 2A — Database & Authentication

## Delivered

### Backend
- **Database:** existing PostgreSQL (docker-compose) via env-driven config. Flyway `V1__create_users_table.sql`.
  Removed `baseline-on-migrate`, so V1 can never be silently skipped on a non-empty schema.
- **User module:** `User` entity (UUID id, unique lower-cased email, BCrypt hash, `Role` STUDENT/ADMIN, enabled,
  last login, timestamps), `UserRepository`, `UserService`, `UserResponse`.
- **Auth module:** `POST /api/v1/auth/register` (201, STUDENT only, returns token), `POST /api/v1/auth/login`,
  `GET /api/v1/auth/me`.
- **Security:** Spring Security OAuth2 resource server with HS256 JWTs (Nimbus — no third-party JWT library),
  `DaoAuthenticationProvider` + `BCryptPasswordEncoder` for login, roles from the `roles` claim.
  Public: health, register, login. `/api/v1/admin/**` → ADMIN. Everything else → authenticated.
- **Errors:** 400 validation (field errors), 401 bad credentials / missing / invalid token, 403 disabled account /
  wrong role, 409 duplicate email — all in the standard `ApiResponse` envelope.
- **Admin bootstrap:** optional `ADMIN_EMAIL` + `ADMIN_PASSWORD` create the first ADMIN on startup.
- **Tests:** 22 passing (17 new auth tests + Phase 1 tests).

### Frontend
- `/login` and `/register` pages (brand split layout, inline validation mirroring the backend rules,
  server field errors mapped to inputs, show/hide password, live password checklist).
- `AuthProvider` (`src/auth/AuthContext.tsx`): token + user in `localStorage`, `/me` check on startup,
  automatic sign-out on token expiry or any 401.
- `ProtectedRoute` guards every app page (redirects to `/login`, remembering the target);
  `GuestRoute` sends signed-in users from `/login`/`/register` to `/dashboard`.
- Successful login/registration → `/dashboard`. Profile menu shows the real user, role and a working **Sign out**.
- API client `src/lib/api.ts`; Vite dev server proxies `/api` → `http://localhost:8080`
  (set `VITE_API_BASE_URL` for other environments).

## Not in scope (unchanged)
Courses/learning data APIs (the dashboard content is still mock data), labs, payments, subscriptions,
admin UI, password reset, email verification, refresh tokens.

## Known limitations / follow-ups
- Tokens live in `localStorage` (simple, but readable by any XSS). Consider httpOnly refresh-token cookies later.
- No refresh tokens: users sign in again after `JWT_EXPIRATION` (default 1 hour).
- No login rate limiting / lockout yet.
- Stateless JWTs can't be revoked before expiry; disabling a user blocks new logins only.
