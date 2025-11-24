package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.response.SubjectResponse;
import com.elearning.commonservice.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/common/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAll() {
        return ResponseEntity.ok(subjectService.getAll());
    }
}