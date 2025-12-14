 package com.elearning.classservice.service;

 import com.elearning.classservice.dto.response.TutorEarningsResponse;
 import com.elearning.classservice.dto.response.TutorEarningsSummaryResponse;
 import com.elearning.classservice.entity.enums.ClassType;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.Pageable;

 import java.util.List;
 import java.util.UUID;

 public interface TutorEarningsService {

//     /**
//      * Tạo earnings record cho một session đã hoàn thành
//      */
//     TutorEarnings createEarningsForSession(UUID sessionId);
//
//     /**
//      * Cập nhật status của earnings thành PAID
//      */
//     TutorEarnings markAsPaid(UUID earningsId, String paymentReference);

     /**
      * Lấy tất cả earnings của một tutor
      */
     List<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId);

     /**
      * Lấy tất cả earnings của một tutor với phân trang và lọc theo class type (optional)
      */
     Page<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId, ClassType classType, Pageable pageable);

     /**
      * Lấy tổng kết thu nhập của tutor
      */
     TutorEarningsSummaryResponse getEarningsSummaryByTutorId(UUID tutorId);
//
//     /**
//      * Tính tổng thu nhập của tutor
//      */
//     java.math.BigDecimal getTotalEarnings(UUID tutorId);
//
//     /**
//      * Tính thu nhập pending của tutor
//      */
//     java.math.BigDecimal getPendingEarnings(UUID tutorId);
 }