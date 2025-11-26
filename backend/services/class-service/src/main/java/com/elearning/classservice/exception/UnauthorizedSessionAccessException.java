package com.elearning.classservice.exception;

import java.util.UUID;

public class UnauthorizedSessionAccessException extends RuntimeException {
    public UnauthorizedSessionAccessException(UUID tutorId, UUID sessionId) {
        super("Tutor " + tutorId + " is not authorized to access session " + sessionId);
    }
}
