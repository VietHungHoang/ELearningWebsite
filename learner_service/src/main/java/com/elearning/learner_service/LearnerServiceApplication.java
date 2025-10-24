package com.elearning.learner_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LearnerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnerServiceApplication.class, args);
	}

}
