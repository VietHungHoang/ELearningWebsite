package com.elearning.learner_bff_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class LearnerBffServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnerBffServiceApplication.class, args);
	}}
