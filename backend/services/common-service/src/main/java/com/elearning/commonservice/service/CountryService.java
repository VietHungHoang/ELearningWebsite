package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.response.CountryResponse;

import java.util.List;

public interface CountryService {
    List<CountryResponse> getAll();
}