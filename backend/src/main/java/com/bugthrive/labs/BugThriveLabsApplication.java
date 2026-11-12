package com.bugthrive.labs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Entry point for the BugThrive Labs API.
 *
 * <p>{@link UserDetailsServiceAutoConfiguration} is excluded so Spring Security does not create a
 * default in-memory user with a generated password. Real authentication is added in a later phase.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@ConfigurationPropertiesScan
public class BugThriveLabsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BugThriveLabsApplication.class, args);
    }
}
