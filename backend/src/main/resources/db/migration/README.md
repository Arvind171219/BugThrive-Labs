# Flyway migrations

SQL migrations are applied automatically on startup.

- Naming: `V<version>__<description>.sql`, e.g. `V2__create_courses_table.sql`
- Never edit a migration that has already been applied — add a new one instead.
- Keep SQL portable (PostgreSQL + H2 in PostgreSQL mode): the test suite runs every migration on H2.

| Version | Description |
|---------|-------------|
| V1 | `users` table (Phase 2A authentication) |
