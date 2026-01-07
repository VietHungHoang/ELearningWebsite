package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.event.ClassCreatedEvent;

public interface ClassInfoService {

    void handleClassCreatedEvent(ClassCreatedEvent event);
}
