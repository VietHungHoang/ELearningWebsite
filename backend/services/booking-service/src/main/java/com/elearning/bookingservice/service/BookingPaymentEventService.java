package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.bookingservice.dto.event.BookingPaymentSuccessEvent;

public interface BookingPaymentEventService {
    
    void handlePaymentSuccess(BookingPaymentSuccessEvent event);
    
    void handlePaymentFailed(BookingPaymentFailedEvent event);
}
