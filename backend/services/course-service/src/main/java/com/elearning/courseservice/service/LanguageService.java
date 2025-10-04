package com.elearning.courseservice.service;

import com.elearning.courseservice.dto.response.LanguageResponse;
import com.elearning.courseservice.mapper.LanguageMapper;
import com.elearning.courseservice.model.Language;
import com.elearning.courseservice.repository.LanguageRepository;
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
public class LanguageService {
    
    private final LanguageRepository languageRepository;
    
    public List<LanguageResponse> getAllLanguages() {
        log.info("Fetching all languages");
        
        List<Language> languages = languageRepository.findAllOrderByName();
        
        return languages.stream()
                .map(LanguageMapper::toResponse)
                .collect(Collectors.toList());
    }

}