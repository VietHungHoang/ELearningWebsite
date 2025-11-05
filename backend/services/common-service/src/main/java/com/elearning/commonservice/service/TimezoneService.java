package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.request.TimezoneRequest;
import com.elearning.commonservice.dto.response.TimezoneResponse;

import java.util.List;
import java.util.UUID;

public interface TimezoneService {
    TimezoneResponse create(TimezoneRequest request);

    TimezoneResponse getById(UUID id);

    List<TimezoneResponse> getAll();

    TimezoneResponse update(UUID id, TimezoneRequest request);

    void delete(UUID id);
}