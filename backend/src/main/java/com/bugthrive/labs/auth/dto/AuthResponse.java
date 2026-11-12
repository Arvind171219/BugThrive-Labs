package com.bugthrive.labs.auth.dto;

import com.bugthrive.labs.user.dto.UserResponse;

/**
 * @param accessToken signed JWT to send as {@code Authorization: Bearer <token>}
 * @param tokenType   always {@code Bearer}
 * @param expiresIn   token lifetime in seconds
 * @param user        the authenticated user
 */
public record AuthResponse(String accessToken, String tokenType, long expiresIn, UserResponse user) {
}
