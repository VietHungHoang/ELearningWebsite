package com.elearning.classservice.exception;

import java.util.UUID;

public class UserNotParticipantException extends RuntimeException {
    public UserNotParticipantException(UUID userId, UUID sessionId) {
        super("User " + userId + " is not a participant of session " + sessionId);
    }
}