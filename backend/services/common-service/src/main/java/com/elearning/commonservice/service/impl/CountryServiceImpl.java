package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.response.CountryResponse;
import com.elearning.commonservice.entity.Country;
import com.elearning.commonservice.mapper.CountryMapper;
import com.elearning.commonservice.repository.CountryRepository;
import com.elearning.commonservice.service.CountryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    @Override
    public List<CountryResponse> getAll() {
        log.info("Fetching all countries");
        List<Country> countries = countryRepository.findAll();
        List<CountryResponse> responses = countries.stream()
                .map(countryMapper::toResponse)
                .collect(Collectors.toList());
        log.info("Retrieved {} countries", responses.size());
        return responses;
    }
}