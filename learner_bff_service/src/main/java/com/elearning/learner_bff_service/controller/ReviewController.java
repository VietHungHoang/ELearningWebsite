package com.elearning.learner_bff_service.controller;

import com.elearning.learner_bff_service.dto.request.ReviewRequest;
import com.elearning.learner_bff_service.dto.response.ApiResponse;
import com.elearning.learner_bff_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/learners/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<Map<String, Object>> createReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.createReview(request), "Tạo đánh giá thành công");
    }

    @PutMapping
    public ApiResponse<Map<String, Object>> updateReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.updateReview(request), "Cập nhật đánh giá thành công");
    }

    @DeleteMapping("/{accountId}/{courseId}")
    public ApiResponse<Void> deleteReview(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        reviewService.deleteReview(accountId, courseId);
        return ApiResponse.success(null, "Xóa đánh giá thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<Map<String, Object>>> getMyReviews(@PathVariable Long accountId) {
        return ApiResponse.success(reviewService.getMyReviews(accountId), "Lấy danh sách đánh giá thành công");
    }
}
