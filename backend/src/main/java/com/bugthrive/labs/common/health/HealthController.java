package com.bugthrive.labs.common.health;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import com.bugthrive.labs.common.response.ApiResponse;
import com.bugthrive.labs.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lightweight liveness endpoint used by the frontend, load balancers and uptime checks. */
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final AppProperties appProperties;
    private final Environment environment;

    @GetMapping
    public ApiResponse<HealthResponse> health() {
        HealthResponse body = new HealthResponse(
                "UP",
                appProperties.name(),
                appProperties.version(),
                Arrays.asList(environment.getActiveProfiles()),
                Instant.now());
        return ApiResponse.success(body, "Service is healthy");
    }

    public record HealthResponse(String status, String service, String version, List<String> profiles,
                                 Instant serverTime) {
    }
}
