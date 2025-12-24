package com.elearning.classservice.service;

import com.elearning.classservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.classservice.dto.event.BookingPaymentSuccessEvent;

public interface ClassPaymentEventService {
    
    void handlePaymentSuccess(BookingPaymentSuccessEvent event);
    
    void handlePaymentFailed(BookingPaymentFailedEvent event);
}
