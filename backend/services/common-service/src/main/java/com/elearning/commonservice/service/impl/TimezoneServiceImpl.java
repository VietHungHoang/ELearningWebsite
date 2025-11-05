package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.request.TimezoneRequest;
import com.elearning.commonservice.dto.response.TimezoneResponse;
import com.elearning.commonservice.entity.Timezone;
import com.elearning.commonservice.mapper.TimezoneMapper;
import com.elearning.commonservice.repository.TimezoneRepository;
import com.elearning.commonservice.service.TimezoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TimezoneServiceImpl implements TimezoneService {

    private final TimezoneRepository timezoneRepository;
    private final TimezoneMapper timezoneMapper;

    @Override
    public TimezoneResponse create(TimezoneRequest request) {
        Timezone timezone = timezoneMapper.toEntity(request);
        Timezone saved = timezoneRepository.save(timezone);
        return timezoneMapper.toResponse(saved);
    }

    @Override
    public TimezoneResponse getById(UUID id) {
        Timezone timezone = getTimezoneById(id);
        return timezoneMapper.toResponse(timezone);
    }

    @Override
    public List<TimezoneResponse> getAll() {
        List<Timezone> timezones = timezoneRepository.findAll();
        return timezones.stream()
                .map(timezoneMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TimezoneResponse update(UUID id, TimezoneRequest request) {
        Timezone existing = getTimezoneById(id);
        existing.setName(request.getName());
        existing.setUtcOffset(request.getUtcOffset());
        Timezone updated = timezoneRepository.save(existing);
        return timezoneMapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        timezoneRepository.deleteById(id);
    }

    private Timezone getTimezoneById(UUID id) {
        Optional<Timezone> opt = timezoneRepository.findById(id);
        return opt.orElseThrow(() -> new RuntimeException("Timezone not found with id: " + id));
    }
}