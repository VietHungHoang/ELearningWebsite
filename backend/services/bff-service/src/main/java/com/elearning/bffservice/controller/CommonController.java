package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/common")
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/tutor-filter")
    public ResponseEntity<TutorFilterResponse> getTutorFilter() {
        TutorFilterResponse response = commonService.getTutorFilter();
        return ResponseEntity.ok(response);
    }
}