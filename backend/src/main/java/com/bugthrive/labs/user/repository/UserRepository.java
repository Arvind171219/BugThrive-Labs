package com.bugthrive.labs.user.repository;

import java.util.Optional;
import java.util.UUID;

import com.bugthrive.labs.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    /** Emails are stored lower-cased; callers must normalise before querying. */
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
