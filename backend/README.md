# BugThrive Labs — Backend

Spring Boot 3 REST API for BugThrive Labs.

- **Phase 1:** project structure, configuration, health endpoint, standard response envelope, global error handling.
- **Phase 2A:** `users` table (Flyway V1), student registration, JWT login, BCrypt passwords, STUDENT/ADMIN roles.
  Every endpoint except health, register and login requires a Bearer token.

## Requirements

| Tool       | Version                                      |
|------------|----------------------------------------------|
| JDK        | **21** (`JAVA_HOME` must point to a JDK 21)  |
| Maven      | Not required — use the bundled `mvnw` wrapper |
| PostgreSQL | 14+ (or Docker, via `docker-compose.yml`)    |

## Quick start

```bash
cd backend

# 1. Start a local PostgreSQL (or use your own server with the same credentials)
docker compose up -d

# 2. Run the API (dev profile, port 8080)
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run

# 3. Check it
curl http://localhost:8080/api/v1/health
```

No environment variables are needed for local development — `application.yml` defaults match
`docker-compose.yml`. To override anything, copy `.env.example` and export the variables
(Spring Boot does not read `.env` files automatically).

### Build & test

```bash
./mvnw clean verify      # compile + run tests + package target/bugthrive-labs-backend-0.1.0-SNAPSHOT.jar
java -jar target/bugthrive-labs-backend-0.1.0-SNAPSHOT.jar
```

Tests use an in-memory H2 database (`src/test/resources/application-test.yml`), so they run without PostgreSQL.

## Profiles

| Profile | File                   | Notes                                                                 |
|---------|------------------------|-----------------------------------------------------------------------|
| `dev`   | `application-dev.yml`  | Default. Local DB defaults, debug logging for `com.bugthrive.labs`.    |
| `prod`  | `application-prod.yml` | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`, `JWT_SECRET` are **required**. |
| `test`  | `src/test/resources`   | H2 in PostgreSQL mode, used by the test suite.                         |

Select with `SPRING_PROFILES_ACTIVE=prod`.

## Environment variables

See [`.env.example`](.env.example).

| Variable                 | Default                         |
|--------------------------|---------------------------------|
| `SPRING_PROFILES_ACTIVE` | `dev`                           |
| `SERVER_PORT`            | `8080`                          |
| `DB_URL`                 | built from the variables below  |
| `DB_HOST` / `DB_PORT`    | `localhost` / `5432`            |
| `DB_NAME`                | `bugthrive_labs`                |
| `DB_USERNAME` / `DB_PASSWORD` | `bugthrive` / `bugthrive`  |
| `DB_POOL_SIZE`           | `10`                            |
| `CORS_ALLOWED_ORIGINS`   | `http://localhost:5173`         |
| `JWT_SECRET`             | dev profile: local-only default; **required** otherwise (≥ 32 bytes) |
| `JWT_EXPIRATION`         | `PT1H`                          |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | unset — when both email and password are set, an ADMIN account is created on startup |

## API

### `GET /api/v1/health`

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "service": "BugThrive Labs API",
    "version": "0.1.0",
    "profiles": ["dev"],
    "serverTime": "2026-11-12T10:00:00Z"
  },
  "timestamp": "2026-11-12T10:00:00Z"
}
```

### Authentication

| Method & path               | Auth   | Body / result |
|-----------------------------|--------|---------------|
| `POST /api/v1/auth/register` | public | `{ fullName, email, password }` → **201** `AuthResponse`. Always creates a `STUDENT`. |
| `POST /api/v1/auth/login`    | public | `{ email, password }` → **200** `AuthResponse` |
| `GET  /api/v1/auth/me`       | Bearer | current `UserResponse` |

```json
{ "success": true, "message": "Login successful",
  "data": { "accessToken": "eyJhbGciOiJIUzI1NiJ9...", "tokenType": "Bearer", "expiresIn": 3600,
            "user": { "id": "…", "email": "arvind@example.com", "fullName": "Arvind Kumar",
                      "role": "STUDENT", "createdAt": "…" } } }
```

Send the token as `Authorization: Bearer <accessToken>`.

- **Passwords:** 8–72 characters with at least one letter and one number; stored as BCrypt hashes.
- **Emails** are trimmed and lower-cased; duplicates (any casing) return **409**.
- **Wrong password and unknown email** both return **401** `Invalid email or password` (no account enumeration).
- **Disabled accounts** get **403** at login.
- **JWT:** HS256, claims `sub` (user id), `email`, `roles` (`["STUDENT"]`), `iss` = `bugthrive-labs`, `exp`.
- **Authorization:** `/api/v1/admin/**` requires `ADMIN`; everything else (except the public endpoints) requires any
  authenticated user. Missing/invalid tokens → **401**, insufficient role → **403**, both in the standard envelope.
- **Admins** cannot self-register. Set `ADMIN_EMAIL` + `ADMIN_PASSWORD` to bootstrap the first one.

### Response envelope

Every endpoint returns `ApiResponse<T>` (`common/response/ApiResponse.java`). Null fields are omitted.

```json
{ "success": false, "message": "Validation failed",
  "errors": [{ "field": "email", "message": "must be a well-formed email address" }],
  "path": "/api/v1/...", "timestamp": "..." }
```

`GlobalExceptionHandler` maps:

| Exception                                   | Status |
|---------------------------------------------|--------|
| `ApiException` (and subclasses)             | the exception's status |
| `EmailAlreadyExistsException`               | 409 |
| Bad credentials / disabled account          | 401 / 403 |
| Missing or invalid token / wrong role       | 401 / 403 (from `RestSecurityHandlers`) |
| `ResourceNotFoundException`                 | 404 |
| Bean Validation failures                    | 400 with `errors[]` |
| Malformed body / missing or bad parameters  | 400 |
| Unknown route                               | 404 |
| Wrong HTTP method                           | 405 |
| Anything else                               | 500 (details logged, never returned) |

## Package structure

```
com.bugthrive.labs
├── BugThriveLabsApplication.java
├── config/          SecurityConfig (JWT resource server, BCrypt, CORS), JwtConfig, RestSecurityHandlers,
│                    AppProperties, AdminAccountInitializer
├── common/
│   ├── response/    ApiResponse
│   ├── exception/   ApiException, ResourceNotFoundException, GlobalExceptionHandler
│   └── health/      HealthController
├── auth/            AuthController · AuthService, JwtService, DatabaseUserDetailsService · Register/Login/AuthResponse
├── user/            User, Role · UserRepository · UserService · UserResponse   (controller: later)
├── dashboard/       controller · service · dto   (aggregates other modules)
├── course/          controller · service · repository · entity · dto
├── learningpath/    controller · service · repository · entity · dto
└── progress/        controller · service · repository · entity · dto
```

Empty module packages contain a `package-info.java` placeholder so the structure is kept in Git.

## Database migrations

Flyway runs automatically on startup from `src/main/resources/db/migration`.

| Version | Description |
|---------|-------------|
| `V1__create_users_table.sql` | `users` (UUID id, unique email, BCrypt hash, role `STUDENT`/`ADMIN`, enabled, timestamps) |

Hibernate is set to `ddl-auto: validate`, so the schema is always owned by Flyway. Keep SQL portable —
the test suite runs migrations on H2 (PostgreSQL mode).

## Tests

`./mvnw clean verify` runs 22 tests: registration, BCrypt storage, email normalisation, duplicate email,
password/field validation, malformed JSON, login success/wrong password/unknown email/disabled account,
missing and invalid tokens, `/me`, student → admin route (403), admin bootstrap, plus the Phase 1 health/CORS tests.
