package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.request.ReviewRequest;
import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.dto.response.ReviewResponse;
import com.elearning.learner_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learners/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.createReview(request), "Tạo review thành công");
    }

    @PutMapping
    public ApiResponse<ReviewResponse> updateReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.updateReview(request), "Cập nhật review thành công");
    }

    @DeleteMapping("/{accountId}/{courseId}")
    public ApiResponse<Void> deleteReview(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        reviewService.deleteReview(accountId, courseId);
        return ApiResponse.success(null, "Xóa review thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<ReviewResponse>> getMyReviews(@PathVariable Long accountId) {
        return ApiResponse.success(reviewService.getMyReviews(accountId), "Lấy danh sách review thành công");
    }
}
