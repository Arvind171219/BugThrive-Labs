package com.bugthrive.labs.user.service;

import com.bugthrive.labs.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApiException {

    public EmailAlreadyExistsException() {
        super(HttpStatus.CONFLICT, "An account with this email already exists");
    }
}
