package com.bugthrive.labs.common.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standard envelope for every API response.
 *
 * <pre>
 * { "success": true,  "message": "OK", "data": {...}, "timestamp": "..." }
 * { "success": false, "message": "Validation failed", "errors": [...], "path": "/api/v1/...", "timestamp": "..." }
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        List<FieldError> errors,
        String path,
        Instant timestamp) {

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "OK");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, null, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, String path) {
        return error(message, null, path);
    }

    public static <T> ApiResponse<T> error(String message, List<FieldError> errors, String path) {
        return new ApiResponse<>(false, message, null, errors, path, Instant.now());
    }

    /** A single validation problem tied to a request field or parameter. */
    public record FieldError(String field, String message) {
    }
}
