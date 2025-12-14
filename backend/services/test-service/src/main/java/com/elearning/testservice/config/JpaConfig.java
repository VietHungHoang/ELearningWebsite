package com.elearning.testservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class JpaConfig {

    @Value("${spring.datasource.main.jdbc-url}")
    private String mainJdbcUrl;

    @Value("${spring.datasource.main.username}")
    private String mainUsername;

    @Value("${spring.datasource.main.password}")
    private String mainPassword;

    @Bean(name = "mainDataSource")
    @Primary
    public DataSource mainDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(mainJdbcUrl);
        dataSource.setUsername(mainUsername);
        dataSource.setPassword(mainPassword);
        return dataSource;
    }

    @Bean(name = "mainJdbcTemplate")
    @Primary
    public JdbcTemplate mainJdbcTemplate() {
        return new JdbcTemplate(mainDataSource());
    }
}