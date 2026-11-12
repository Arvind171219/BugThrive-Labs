package com.bugthrive.labs.user.entity;

/** Platform roles. Stored as text in {@code users.role}; exposed to Spring Security as {@code ROLE_<name>}. */
public enum Role {
    STUDENT,
    ADMIN
}
