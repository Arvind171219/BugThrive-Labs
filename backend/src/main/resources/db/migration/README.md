# Flyway migrations

SQL migrations are applied automatically on startup.

- Naming: `V<version>__<description>.sql`, e.g. `V1__create_users_table.sql`
- Never edit a migration that has already been applied — add a new one instead.
- Phase 1 intentionally has no migrations; the first schema arrives with the user/auth module.
