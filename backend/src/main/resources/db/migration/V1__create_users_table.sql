-- Phase 2A: user accounts.
-- Kept to portable SQL so the H2 (PostgreSQL mode) test database can run it too.

CREATE TABLE users (
    id             UUID                     NOT NULL,
    email          VARCHAR(255)             NOT NULL,
    password_hash  VARCHAR(100)             NOT NULL,
    full_name      VARCHAR(100)             NOT NULL,
    role           VARCHAR(20)              NOT NULL DEFAULT 'STUDENT',
    enabled        BOOLEAN                  NOT NULL DEFAULT TRUE,
    last_login_at  TIMESTAMP WITH TIME ZONE,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    -- Emails are normalised to lower case by the application before insert.
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT ck_users_role CHECK (role IN ('STUDENT', 'ADMIN'))
);
