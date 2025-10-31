package com.elearning.authservice.service.impl;

import com.elearning.authservice.client.NotificationClient;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.service.AuthService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {

    private final StringRedisTemplate redisTemplate;
    private final NotificationClient notificationClient;

    public AuthServiceImpl(StringRedisTemplate redisTemplate, NotificationClient notificationClient) {
        this.redisTemplate = redisTemplate;
        this.notificationClient = notificationClient;
    }

    @Override
    public void startRegistration(RegistrationStartRequest request) {
        String email = request.getEmail();
        String fullname = request.getFullname();

        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        redisTemplate.opsForValue().set("reg:" + email, otp, 300, TimeUnit.SECONDS);
        redisTemplate.opsForValue().set("reg_name:" + email, fullname, 300, TimeUnit.SECONDS);
        notificationClient.sendOtpEmail(email, otp);
    }
}