package com.bugthrive.labs.config;

import com.bugthrive.labs.user.entity.Role;
import com.bugthrive.labs.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Creates the first ADMIN account from {@code ADMIN_EMAIL} / {@code ADMIN_PASSWORD} if both are set
 * and no user with that email exists. Public registration only ever creates STUDENT accounts.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final AppProperties appProperties;
    private final UserService userService;

    @Override
    public void run(ApplicationArguments args) {
        AppProperties.Admin admin = appProperties.admin();
        if (admin == null || !admin.isConfigured()) {
            return;
        }
        if (userService.findByEmail(admin.email()).isPresent()) {
            log.debug("Bootstrap admin {} already exists", admin.email());
            return;
        }
        String name = admin.fullName() == null || admin.fullName().isBlank() ? "Platform Admin" : admin.fullName();
        userService.createUser(admin.email(), admin.password(), name, Role.ADMIN);
        log.info("Created bootstrap admin account {}", UserService.normalizeEmail(admin.email()));
    }
}
