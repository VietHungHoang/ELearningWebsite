package com.elearning.bffservice.controller.search;

import com.elearning.bffservice.bff.tutors.request.TutorSearchBffRequest;
import com.elearning.bffservice.bff.tutors.response.TutorBffResponse;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/bff")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search/tutors")
    public ResponseEntity<ApiResponse<Page<TutorBffResponse>>> searchTutors(
            @ModelAttribute TutorSearchBffRequest request) {

        Page<TutorBffResponse> result = searchService.searchTutors(request);
        ApiResponse<Page<TutorBffResponse>> response = ApiResponse.success(result, "Tutors searched successfully");
        return ResponseEntity.ok(response);
    }
}