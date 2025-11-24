package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.response.CountryResponse;
import com.elearning.commonservice.entity.Country;
import com.elearning.commonservice.mapper.CountryMapper;
import com.elearning.commonservice.repository.CountryRepository;
import com.elearning.commonservice.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    @Override
    public List<CountryResponse> getAll() {
        List<Country> countries = countryRepository.findAll();
        return countries.stream()
                .map(countryMapper::toResponse)
                .collect(Collectors.toList());
    }
}