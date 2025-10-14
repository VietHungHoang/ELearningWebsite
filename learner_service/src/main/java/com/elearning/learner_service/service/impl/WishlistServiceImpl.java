package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.CourseServiceClient;
import com.elearning.learner_service.dto.request.WishlistRequest;
import com.elearning.learner_service.dto.response.WishlistResponse;
import com.elearning.learner_service.model.Wishlist;
import com.elearning.learner_service.repository.WishlistRepository;
import com.elearning.learner_service.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CourseServiceClient courseServiceClient;

    @Override
    public WishlistResponse addToWishlist(WishlistRequest request) {
        Wishlist existing = wishlistRepository.findByAccountIdAndCourseId(
                request.getAccountId(), request.getCourseId());
        if (existing != null) {
            throw new RuntimeException("Khóa học đã có trong wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .accountId(request.getAccountId())
                .courseId(request.getCourseId())
                .createdAt(Instant.now().toEpochMilli())
                .build();

        Wishlist saved = wishlistRepository.save(wishlist);
        return mapToResponse(saved);
    }

    @Override
    public List<WishlistResponse> getWishlist(Long accountId) {
        return wishlistRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeFromWishlist(Long accountId, Long courseId) {
        wishlistRepository.deleteByAccountIdAndCourseId(accountId, courseId);
    }

    @Override
    public void removeByCourseId(Long courseId) {
        List<Wishlist> list = wishlistRepository.findAll()
                .stream()
                .filter(w -> w.getCourseId().equals(courseId))
                .collect(Collectors.toList());
        wishlistRepository.deleteAll(list);
    }

    private WishlistResponse mapToResponse(Wishlist wishlist) {
        WishlistResponse response = WishlistResponse.builder()
                .id(wishlist.getId())
                .accountId(wishlist.getAccountId())
                .courseId(wishlist.getCourseId())
                .createdAt(wishlist.getCreatedAt())
                .build();

        try {
            var courseInfo = courseServiceClient.getCourseInfo(wishlist.getCourseId());
            response.setCourseTitle((String) courseInfo.get("title"));
            response.setCourseThumbnail((String) courseInfo.get("thumbnail"));
            response.setCourseDescription((String) courseInfo.get("description"));
            response.setTotalStudents((Integer) courseInfo.getOrDefault("totalStudents", 0));
            response.setTotalLessons((Integer) courseInfo.getOrDefault("totalLessons", 0));
            response.setPrice((Double) courseInfo.getOrDefault("price", 0.0));
            response.setTotalReviews((Integer) courseInfo.getOrDefault("totalReviews", 0));
            response.setRating((Double) courseInfo.getOrDefault("rating", 0.0));
        } catch (Exception e) {
            // nếu course-service lỗi thì vẫn trả wishlist với null/default fields
        }

        return response;
    }
}
