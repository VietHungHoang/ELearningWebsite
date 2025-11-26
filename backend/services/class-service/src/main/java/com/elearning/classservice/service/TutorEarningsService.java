// package com.elearning.classservice.service;

// import com.elearning.classservice.entity.TutorEarnings;

// import java.util.List;
// import java.util.UUID;

// public interface TutorEarningsService {

//     /**
//      * Tạo earnings record cho một session đã hoàn thành
//      */
//     TutorEarnings createEarningsForSession(UUID sessionId);

//     /**
//      * Cập nhật status của earnings thành PAID
//      */
//     TutorEarnings markAsPaid(UUID earningsId, String paymentReference);

//     /**
//      * Lấy tất cả earnings của một tutor
//      */
//     List<TutorEarnings> getEarningsByTutorId(UUID tutorId);

//     /**
//      * Tính tổng thu nhập của tutor
//      */
//     java.math.BigDecimal getTotalEarnings(UUID tutorId);

//     /**
//      * Tính thu nhập pending của tutor
//      */
//     java.math.BigDecimal getPendingEarnings(UUID tutorId);
// }