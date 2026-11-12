package com.bugthrive.labs.auth.controller;

import java.util.UUID;

import com.bugthrive.labs.auth.dto.AuthResponse;
import com.bugthrive.labs.auth.dto.LoginRequest;
import com.bugthrive.labs.auth.dto.RegisterRequest;
import com.bugthrive.labs.auth.service.AuthService;
import com.bugthrive.labs.common.response.ApiResponse;
import com.bugthrive.labs.user.dto.UserResponse;
import com.bugthrive.labs.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request), "Registration successful");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "Login successful");
    }

    /** Current user, resolved from the Bearer token's subject. */
    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ApiResponse.success(UserResponse.from(userService.getById(UUID.fromString(jwt.getSubject()))));
    }
}
