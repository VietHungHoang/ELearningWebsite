package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.request.SubjectRequest;
import com.elearning.commonservice.dto.response.SubjectResponse;
import com.elearning.commonservice.entity.Category;
import com.elearning.commonservice.entity.Subject;
import com.elearning.commonservice.mapper.SubjectMapper;
import com.elearning.commonservice.repository.CategoryRepository;
import com.elearning.commonservice.repository.SubjectRepository;
import com.elearning.commonservice.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final SubjectMapper subjectMapper;

    @Override
    public List<SubjectResponse> getAll() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream()
                .map(subjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectResponse create(SubjectRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        }

        Subject subject = subjectMapper.toEntity(request, category);
        Subject savedSubject = subjectRepository.save(subject);
        return subjectMapper.toResponse(savedSubject);
    }

    @Override
    @Transactional
    public SubjectResponse update(UUID id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));

        // Update fields
        subject.setNameVi(request.getNameVi());
        subject.setNameEn(request.getNameEn());

        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            subject.setCategory(category);
        }

        Subject savedSubject = subjectRepository.save(subject);
        return subjectMapper.toResponse(savedSubject);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }
}
