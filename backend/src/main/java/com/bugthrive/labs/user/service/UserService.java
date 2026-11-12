package com.bugthrive.labs.user.service;

import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import com.bugthrive.labs.common.exception.ResourceNotFoundException;
import com.bugthrive.labs.user.entity.Role;
import com.bugthrive.labs.user.entity.User;
import com.bugthrive.labs.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    /** Creates a user with a BCrypt-hashed password. Throws if the email is taken. */
    @Transactional
    public User createUser(String email, String rawPassword, String fullName, Role role) {
        String normalized = normalizeEmail(email);
        if (userRepository.existsByEmail(normalized)) {
            throw new EmailAlreadyExistsException();
        }
        User user = new User(normalized, passwordEncoder.encode(rawPassword), fullName.trim(), role);
        try {
            return userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException e) {
            // A concurrent registration with the same email hit the unique constraint.
            throw new EmailAlreadyExistsException();
        }
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email));
    }

    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @Transactional
    public void recordLogin(UUID id) {
        userRepository.findById(id).ifPresent(user -> user.setLastLoginAt(Instant.now()));
    }
}
