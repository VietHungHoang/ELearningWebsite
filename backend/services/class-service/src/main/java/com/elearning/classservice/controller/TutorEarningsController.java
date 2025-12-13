 package com.elearning.classservice.controller;

 import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.TutorEarningsResponse;
import com.elearning.classservice.dto.response.TutorEarningsSummaryResponse;
import com.elearning.classservice.entity.enums.ClassType;
 import com.elearning.classservice.service.TutorEarningsService;
 import lombok.RequiredArgsConstructor;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.PageRequest;
 import org.springframework.data.domain.Pageable;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.*;

 import java.util.UUID;

 @RestController
 @RequestMapping("/api/v1/classes/tutors")
 @RequiredArgsConstructor
 public class TutorEarningsController {

     private final TutorEarningsService tutorEarningsService;
//
//     /**
//      * POST /api/v1/tutors/earnings/session/{sessionId}
//      * Tạo earnings record cho session đã hoàn thành
//      */
//     @PostMapping("/session/{sessionId}")
//     public ResponseEntity<TutorEarnings> createEarningsForSession(@PathVariable UUID sessionId) {
//         TutorEarnings earnings = tutorEarningsService.createEarningsForSession(sessionId);
//         return ResponseEntity.ok(earnings);
//     }
//
//     /**
//      * PUT /api/v1/tutors/earnings/{earningsId}/paid
//      * Đánh dấu earnings đã được thanh toán
//      */
//     @PutMapping("/{earningsId}/paid")
//     public ResponseEntity<TutorEarnings> markAsPaid(
//             @PathVariable UUID earningsId,
//             @RequestParam String paymentReference) {
//         TutorEarnings earnings = tutorEarningsService.markAsPaid(earningsId, paymentReference);
//         return ResponseEntity.ok(earnings);
//     }
//
     /**
      * GET /api/v1/classes/tutors-earnings/tutors/{tutorId}
      * Lấy tất cả earnings của tutor với phân trang và lọc theo class type
      */
     @GetMapping("/{tutorId}/earnings")
     public ResponseEntity<ApiResponse<Page<TutorEarningsResponse>>> getEarningsByTutorId(
             @PathVariable UUID tutorId,
             @RequestParam(required = false) String classType,
             @RequestParam(defaultValue = "0") int page,
             @RequestParam(defaultValue = "10") int size) {

         Pageable pageable = PageRequest.of(page, size);

         ClassType type = null;
         if (classType != null && !classType.trim().isEmpty()) {
             type = ClassType.valueOf(classType.toUpperCase());
         }

         Page<TutorEarningsResponse> earnings = tutorEarningsService.getEarningsByTutorId(tutorId, type, pageable);

         ApiResponse<Page<TutorEarningsResponse>> response = ApiResponse.success(earnings, "Tutor earnings retrieved successfully");
         return ResponseEntity.ok(response);
     }

     /**
      * GET /api/v1/classes/tutors/{tutorId}/earnings/summary
      * Lấy tổng kết thu nhập của tutor
      */
     @GetMapping("/{tutorId}/earnings/summary")
     public ResponseEntity<ApiResponse<TutorEarningsSummaryResponse>> getEarningsSummaryByTutorId(@PathVariable UUID tutorId) {
         TutorEarningsSummaryResponse summary = tutorEarningsService.getEarningsSummaryByTutorId(tutorId);
         ApiResponse<TutorEarningsSummaryResponse> response = ApiResponse.success(summary, "Tutor earnings summary retrieved successfully");
         return ResponseEntity.ok(response);
     }
//
//     /**
//      * GET /api/v1/tutors/{tutorId}/earnings/total
//      * Lấy tổng thu nhập của tutor
//      */
//     @GetMapping("/tutor/{tutorId}/total")
//     public ResponseEntity<BigDecimal> getTotalEarnings(@PathVariable UUID tutorId) {
//         BigDecimal total = tutorEarningsService.getTotalEarnings(tutorId);
//         return ResponseEntity.ok(total);
//     }
//
//     /**
//      * GET /api/v1/tutors/{tutorId}/earnings/pending
//      * Lấy thu nhập pending của tutor
//      */
//     @GetMapping("/tutor/{tutorId}/pending")
//     public ResponseEntity<BigDecimal> getPendingEarnings(@PathVariable UUID tutorId) {
//         BigDecimal pending = tutorEarningsService.getPendingEarnings(tutorId);
//         return ResponseEntity.ok(pending);
//     }
 }