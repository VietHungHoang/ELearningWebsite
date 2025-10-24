package com.elearning.learner_bff_service.service;


import java.util.Map;

public interface DashboardService {
    Map<String, Object> getDashboard(Long accountId);
}
