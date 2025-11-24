package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.response.SubjectResponse;
import com.elearning.commonservice.entity.Subject;
import com.elearning.commonservice.mapper.SubjectMapper;
import com.elearning.commonservice.repository.SubjectRepository;
import com.elearning.commonservice.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;

    @Override
    public List<SubjectResponse> getAll() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream()
                .map(subjectMapper::toResponse)
                .collect(Collectors.toList());
    }
}