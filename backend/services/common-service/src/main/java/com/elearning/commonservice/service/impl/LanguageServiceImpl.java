package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.request.LanguageRequest;
import com.elearning.commonservice.dto.response.LanguageResponse;
import com.elearning.commonservice.entity.Language;
import com.elearning.commonservice.mapper.LanguageMapper;
import com.elearning.commonservice.repository.LanguageRepository;
import com.elearning.commonservice.service.LanguageService;
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
public class LanguageServiceImpl implements LanguageService {

    private final LanguageRepository languageRepository;
    private final LanguageMapper languageMapper;

    @Override
    public LanguageResponse create(LanguageRequest request) {
        Language language = languageMapper.toEntity(request);
        Language saved = languageRepository.save(language);
        return languageMapper.toResponse(saved);
    }

    @Override
    public LanguageResponse getById(UUID id) {
        Language language = getLanguageById(id);
        return languageMapper.toResponse(language);
    }

    @Override
    public List<LanguageResponse> getAll() {
        List<Language> languages = languageRepository.findAll();
        return languages.stream()
                .map(languageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LanguageResponse update(UUID id, LanguageRequest request) {
        Language existing = getLanguageById(id);
        existing.setName(request.getName());
        existing.setCode(request.getCode());
        Language updated = languageRepository.save(existing);
        return languageMapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        languageRepository.deleteById(id);
    }

    private Language getLanguageById(UUID id) {
        Optional<Language> opt = languageRepository.findById(id);
        return opt.orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
    }
}