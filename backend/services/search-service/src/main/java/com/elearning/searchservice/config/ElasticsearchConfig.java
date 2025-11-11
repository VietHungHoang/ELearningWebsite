package com.elearning.searchservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    @Value("${app.elastic.index.tutors}")
    private String tutorIndexName;

    public String getTutorIndexName() {
        return tutorIndexName;
    }
}