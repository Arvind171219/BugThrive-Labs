package com.bugthrive.labs.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application-specific settings bound from the {@code app.*} namespace.
 *
 * @param name    public product name
 * @param version API version reported by the health endpoint
 * @param cors    CORS settings for browser clients
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(String name, String version, Cors cors) {

    public record Cors(List<String> allowedOrigins) {
    }
}
