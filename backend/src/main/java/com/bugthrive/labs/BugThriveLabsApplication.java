package com.bugthrive.labs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/** Entry point for the BugThrive Labs API. */
@SpringBootApplication
@ConfigurationPropertiesScan
public class BugThriveLabsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BugThriveLabsApplication.class, args);
    }
}
