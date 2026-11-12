package com.bugthrive.labs.user.dto;

import java.time.Instant;
import java.util.UUID;

import com.bugthrive.labs.user.entity.Role;
import com.bugthrive.labs.user.entity.User;

/** Public view of a user. Never includes the password hash. */
public record UserResponse(UUID id, String email, String fullName, Role role, Instant createdAt) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getCreatedAt());
    }
}
