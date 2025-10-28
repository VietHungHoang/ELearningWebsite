package com.elearning.apigateway.service;


import java.util.Map;

public interface DashboardService {
    Map<String, Object> getDashboard(Long accountId);
}

