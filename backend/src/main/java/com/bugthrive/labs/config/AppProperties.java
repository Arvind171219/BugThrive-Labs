package com.bugthrive.labs.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application-specific settings bound from the {@code app.*} namespace.
 *
 * @param name    public product name
 * @param version API version reported by the health endpoint
 * @param cors    CORS settings for browser clients
 * @param jwt     access-token settings
 * @param admin   optional bootstrap administrator account
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(String name, String version, Cors cors, Jwt jwt, Admin admin) {

    public record Cors(List<String> allowedOrigins) {
    }

    /**
     * @param secret     HMAC-SHA256 signing secret, at least 32 bytes
     * @param expiration access-token lifetime
     * @param issuer     value of the {@code iss} claim
     */
    public record Jwt(String secret, Duration expiration, String issuer) {
    }

    /** When both email and password are set, an ADMIN account is created on startup if it does not exist. */
    public record Admin(String email, String password, String fullName) {

        public boolean isConfigured() {
            return email != null && !email.isBlank() && password != null && !password.isBlank();
        }
    }
}
