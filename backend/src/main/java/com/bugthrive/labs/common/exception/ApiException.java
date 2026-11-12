package com.bugthrive.labs.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base class for expected, client-facing errors. Throw a subclass (or this directly) from
 * services; {@link GlobalExceptionHandler} turns it into an {@code ApiResponse} with the given status.
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
