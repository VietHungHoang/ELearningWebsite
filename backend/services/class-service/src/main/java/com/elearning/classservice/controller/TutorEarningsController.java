// package com.elearning.classservice.controller;

// import com.elearning.classservice.entity.TutorEarnings;
// import com.elearning.classservice.service.TutorEarningsService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.math.BigDecimal;
// import java.util.List;
// import java.util.UUID;

// @RestController
// @RequestMapping("/api/v1/tutors/earnings")
// @RequiredArgsConstructor
// public class TutorEarningsController {

//     private final TutorEarningsService tutorEarningsService;

//     /**
//      * POST /api/v1/tutors/earnings/session/{sessionId}
//      * Tạo earnings record cho session đã hoàn thành
//      */
//     @PostMapping("/session/{sessionId}")
//     public ResponseEntity<TutorEarnings> createEarningsForSession(@PathVariable UUID sessionId) {
//         TutorEarnings earnings = tutorEarningsService.createEarningsForSession(sessionId);
//         return ResponseEntity.ok(earnings);
//     }

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

//     /**
//      * GET /api/v1/tutors/{tutorId}/earnings
//      * Lấy tất cả earnings của tutor
//      */
//     @GetMapping("/tutor/{tutorId}")
//     public ResponseEntity<List<TutorEarnings>> getEarningsByTutorId(@PathVariable UUID tutorId) {
//         List<TutorEarnings> earnings = tutorEarningsService.getEarningsByTutorId(tutorId);
//         return ResponseEntity.ok(earnings);
//     }

//     /**
//      * GET /api/v1/tutors/{tutorId}/earnings/total
//      * Lấy tổng thu nhập của tutor
//      */
//     @GetMapping("/tutor/{tutorId}/total")
//     public ResponseEntity<BigDecimal> getTotalEarnings(@PathVariable UUID tutorId) {
//         BigDecimal total = tutorEarningsService.getTotalEarnings(tutorId);
//         return ResponseEntity.ok(total);
//     }

//     /**
//      * GET /api/v1/tutors/{tutorId}/earnings/pending
//      * Lấy thu nhập pending của tutor
//      */
//     @GetMapping("/tutor/{tutorId}/pending")
//     public ResponseEntity<BigDecimal> getPendingEarnings(@PathVariable UUID tutorId) {
//         BigDecimal pending = tutorEarningsService.getPendingEarnings(tutorId);
//         return ResponseEntity.ok(pending);
//     }
// }