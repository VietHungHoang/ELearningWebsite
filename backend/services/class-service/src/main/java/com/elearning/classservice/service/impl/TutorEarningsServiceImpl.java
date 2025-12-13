 package com.elearning.classservice.service.impl;

 import com.elearning.classservice.entity.TutorEarnings;
 import com.elearning.classservice.dto.response.TutorEarningsResponse;
 import com.elearning.classservice.dto.response.TutorEarningsSummaryResponse;
 import com.elearning.classservice.entity.enums.ClassType;
 import com.elearning.classservice.mapper.TutorEarningsMapper;
 import com.elearning.classservice.repository.TutorEarningsRepository;
 import com.elearning.classservice.service.TutorEarningsService;
 import lombok.RequiredArgsConstructor;
 import lombok.extern.slf4j.Slf4j;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.Pageable;
 import org.springframework.stereotype.Service;
 import org.springframework.transaction.annotation.Transactional;

 import java.util.List;
 import java.util.UUID;

 @Service
 @RequiredArgsConstructor
 @Slf4j
 public class TutorEarningsServiceImpl implements TutorEarningsService {

    private final TutorEarningsRepository tutorEarningsRepository;
    private final TutorEarningsMapper tutorEarningsMapper;//     @Override
//     @Transactional
//     public TutorEarnings createEarningsForSession(UUID sessionId) {
//         log.info("Creating earnings for session: {}", sessionId);
//
//         // Lấy thông tin session
//         Session session = sessionRepository.findById(sessionId)
//             .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
//
//         // Lấy thông tin tutor
//         Tutor tutor = tutorRepository.findById(session.getTutorId())
//             .orElseThrow(() -> new RuntimeException("Tutor not found: " + session.getTutorId()));
//
//         // Tính toán số tiền dựa trên hourly rate và thời gian session
//         BigDecimal hourlyRate = tutor.getHourlyRate();
//         if (hourlyRate == null || hourlyRate.compareTo(BigDecimal.ZERO) <= 0) {
//             throw new RuntimeException("Tutor hourly rate not set or invalid");
//         }
//
//         // Tính số giờ (giả sử session có startTime và endTime)
//         long hours = java.time.Duration.between(session.getStartTime(), session.getEndTime()).toHours();
//         if (hours <= 0) hours = 1; // Minimum 1 hour
//
//         BigDecimal amount = hourlyRate.multiply(BigDecimal.valueOf(hours));
//
//         // Tạo earnings record
//         TutorEarnings earnings = TutorEarnings.builder()
//             .tutor(tutor)
//             .session(session)
//             .studentId(getStudentIdFromSession(session)) // Logic để lấy student ID
//             .amount(amount)
//             .status(TutorEarnings.EarningsStatus.PENDING)
//             .build();
//
//         return tutorEarningsRepository.save(earnings);
//     }
//
//     @Override
//     @Transactional
//     public TutorEarnings markAsPaid(UUID earningsId, String paymentReference) {
//         log.info("Marking earnings as paid: {}", earningsId);
//
//         TutorEarnings earnings = tutorEarningsRepository.findById(earningsId)
//             .orElseThrow(() -> new RuntimeException("Earnings not found: " + earningsId));
//
//         earnings.setStatus(TutorEarnings.EarningsStatus.PAID);
//         earnings.setPaidAt(LocalDateTime.now());
//         earnings.setPaymentReference(paymentReference);
//
//         return tutorEarningsRepository.save(earnings);
//     }

     @Override
     @Transactional(readOnly = true)
     public List<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId) {
         List<TutorEarnings> earnings = tutorEarningsRepository.findByTutorId(tutorId);
         return earnings.stream()
                 .map(tutorEarningsMapper::toResponse)
                 .collect(java.util.stream.Collectors.toList());
     }

//     @Override
//     @Transactional(readOnly = true)
//     public BigDecimal getTotalEarnings(UUID tutorId) {
//         LocalDateTime startDate = LocalDateTime.of(2020, 1, 1, 0, 0);
//         LocalDateTime endDate = LocalDateTime.now();
//         return tutorEarningsRepository.getTotalEarningsByTutorAndDateRange(tutorId, startDate, endDate);
//     }
//
//     @Override
//     @Transactional(readOnly = true)
//     public BigDecimal getPendingEarnings(UUID tutorId) {
//         return tutorEarningsRepository.getPendingEarningsByTutor(tutorId);
//     }

     @Override
     @Transactional(readOnly = true)
     public Page<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId, ClassType classType, Pageable pageable) {
         Page<TutorEarnings> earningsPage;
         if (classType != null) {
             earningsPage = tutorEarningsRepository.findByTutorIdAndClassType(tutorId, classType, pageable);
         } else {
             earningsPage = tutorEarningsRepository.findByTutorId(tutorId, pageable);
         }
         return earningsPage.map(tutorEarningsMapper::toResponse);
     }

     @Override
     @Transactional(readOnly = true)
     public TutorEarningsSummaryResponse getEarningsSummaryByTutorId(UUID tutorId) {
         // Calculate start of current month
         java.time.LocalDateTime now = java.time.LocalDateTime.now();
         java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);

         java.math.BigDecimal availableBalance = tutorEarningsRepository.getAvailableBalanceByTutor(tutorId);
         java.math.BigDecimal pendingBalance = tutorEarningsRepository.getPendingBalanceByTutor(tutorId);
         java.math.BigDecimal totalEarned = tutorEarningsRepository.getTotalEarnedByTutor(tutorId);
         Long withdrawalCount = tutorEarningsRepository.getWithdrawalCountByTutorThisMonth(tutorId, startOfMonth);

         return TutorEarningsSummaryResponse.builder()
                 .availableBalance(availableBalance)
                 .pendingBalance(pendingBalance)
                 .withdrawalCount(withdrawalCount)
                 .totalEarned(totalEarned)
                 .build();
     }
}