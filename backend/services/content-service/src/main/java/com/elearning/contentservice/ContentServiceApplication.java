package com.elearning.contentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class ContentServiceApplication {
    public static void main(String[] args) {
        // Set timezone to Vietnam
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        
        SpringApplication.run(ContentServiceApplication.class, args);
    }
}
