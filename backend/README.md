# BugThrive Labs — Backend

Spring Boot 3 REST API for BugThrive Labs. **Phase 1 is a skeleton**: it provides the project
structure, configuration, a health endpoint, a standard response envelope and global error handling.
There is no authentication, no business API and no database entity yet.

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
| `prod`  | `application-prod.yml` | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS` are **required**. |
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
├── config/          SecurityConfig (permit-all, stateless, CORS), AppProperties
├── common/
│   ├── response/    ApiResponse
│   ├── exception/   ApiException, ResourceNotFoundException, GlobalExceptionHandler
│   └── health/      HealthController
├── auth/            controller · service · dto
├── user/            controller · service · repository · entity · dto
├── dashboard/       controller · service · dto   (aggregates other modules)
├── course/          controller · service · repository · entity · dto
├── learningpath/    controller · service · repository · entity · dto
└── progress/        controller · service · repository · entity · dto
```

Empty module packages contain a `package-info.java` placeholder so the structure is kept in Git.

## Database migrations

Flyway runs automatically on startup from `src/main/resources/db/migration`.
Phase 1 ships no migrations (Flyway logs "No migrations found" — expected). Add files as
`V1__create_users_table.sql`, `V2__...` etc. Hibernate is set to `ddl-auto: validate`, so the schema
is always owned by Flyway.

## Security

Spring Security is on the classpath and configured in `config/SecurityConfig.java` to **permit all
requests** (stateless, CSRF off, CORS on). The default generated user is disabled. Authentication
(JWT) will be added in the auth phase.
