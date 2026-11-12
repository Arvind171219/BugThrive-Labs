package com.bugthrive.labs.auth.service;

import com.bugthrive.labs.auth.dto.AuthResponse;
import com.bugthrive.labs.auth.dto.LoginRequest;
import com.bugthrive.labs.auth.dto.RegisterRequest;
import com.bugthrive.labs.user.dto.UserResponse;
import com.bugthrive.labs.user.entity.Role;
import com.bugthrive.labs.user.entity.User;
import com.bugthrive.labs.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /** Public registration always creates a STUDENT account and signs the user in. */
    public AuthResponse register(RegisterRequest request) {
        User user = userService.createUser(request.email(), request.password(), request.fullName(), Role.STUDENT);
        return toResponse(user);
    }

    /**
     * Verifies credentials with Spring Security (BCrypt). Unknown email and wrong password both surface as
     * {@link BadCredentialsException}, so the response never reveals which accounts exist.
     */
    public AuthResponse login(LoginRequest request) {
        String email = UserService.normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = userService.findByEmail(email).orElseThrow(() -> new BadCredentialsException("Bad credentials"));
        userService.recordLogin(user.getId());
        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        return new AuthResponse(jwtService.issueToken(user), "Bearer", jwtService.expiresInSeconds(), UserResponse.from(user));
    }
}
