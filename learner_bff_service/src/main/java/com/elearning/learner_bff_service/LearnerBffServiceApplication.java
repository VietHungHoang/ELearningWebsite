package com.elearning.learner_bff_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableCaching
@EnableDiscoveryClient
public class LearnerBffServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnerBffServiceApplication.class, args);
	}
}
