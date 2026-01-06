package com.elearning.healthcheckservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HealthCheckServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthCheckServiceApplication.class, args);
    }
}