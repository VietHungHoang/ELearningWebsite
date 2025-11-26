// package com.elearning.classservice.service.impl;

// import com.elearning.classservice.entity.Session;
// import com.elearning.classservice.entity.Tutor;
// import com.elearning.classservice.entity.TutorEarnings;
// import com.elearning.classservice.repository.SessionRepository;
// import com.elearning.classservice.repository.TutorEarningsRepository;
// import com.elearning.classservice.repository.TutorRepository;
// import com.elearning.classservice.service.TutorEarningsService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.UUID;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class TutorEarningsServiceImpl implements TutorEarningsService {

//     private final TutorEarningsRepository tutorEarningsRepository;
//     private final SessionRepository sessionRepository;
//     private final TutorRepository tutorRepository;

//     @Override
//     @Transactional
//     public TutorEarnings createEarningsForSession(UUID sessionId) {
//         log.info("Creating earnings for session: {}", sessionId);

//         // Lấy thông tin session
//         Session session = sessionRepository.findById(sessionId)
//             .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

//         // Lấy thông tin tutor
//         Tutor tutor = tutorRepository.findById(session.getTutorId())
//             .orElseThrow(() -> new RuntimeException("Tutor not found: " + session.getTutorId()));

//         // Tính toán số tiền dựa trên hourly rate và thời gian session
//         BigDecimal hourlyRate = tutor.getHourlyRate();
//         if (hourlyRate == null || hourlyRate.compareTo(BigDecimal.ZERO) <= 0) {
//             throw new RuntimeException("Tutor hourly rate not set or invalid");
//         }

//         // Tính số giờ (giả sử session có startTime và endTime)
//         long hours = java.time.Duration.between(session.getStartTime(), session.getEndTime()).toHours();
//         if (hours <= 0) hours = 1; // Minimum 1 hour

//         BigDecimal amount = hourlyRate.multiply(BigDecimal.valueOf(hours));

//         // Tạo earnings record
//         TutorEarnings earnings = TutorEarnings.builder()
//             .tutor(tutor)
//             .session(session)
//             .studentId(getStudentIdFromSession(session)) // Logic để lấy student ID
//             .amount(amount)
//             .status(TutorEarnings.EarningsStatus.PENDING)
//             .build();

//         return tutorEarningsRepository.save(earnings);
//     }

//     @Override
//     @Transactional
//     public TutorEarnings markAsPaid(UUID earningsId, String paymentReference) {
//         log.info("Marking earnings as paid: {}", earningsId);

//         TutorEarnings earnings = tutorEarningsRepository.findById(earningsId)
//             .orElseThrow(() -> new RuntimeException("Earnings not found: " + earningsId));

//         earnings.setStatus(TutorEarnings.EarningsStatus.PAID);
//         earnings.setPaidAt(LocalDateTime.now());
//         earnings.setPaymentReference(paymentReference);

//         return tutorEarningsRepository.save(earnings);
//     }

//     @Override
//     @Transactional(readOnly = true)
//     public List<TutorEarnings> getEarningsByTutorId(UUID tutorId) {
//         return tutorEarningsRepository.findByTutorIdOrderByCreatedAtDesc(tutorId);
//     }

//     @Override
//     @Transactional(readOnly = true)
//     public BigDecimal getTotalEarnings(UUID tutorId) {
//         LocalDateTime startDate = LocalDateTime.of(2020, 1, 1, 0, 0);
//         LocalDateTime endDate = LocalDateTime.now();
//         return tutorEarningsRepository.getTotalEarningsByTutorAndDateRange(tutorId, startDate, endDate);
//     }

//     @Override
//     @Transactional(readOnly = true)
//     public BigDecimal getPendingEarnings(UUID tutorId) {
//         return tutorEarningsRepository.getPendingEarningsByTutor(tutorId);
//     }

//     /**
//      * Helper method để lấy student ID từ session
//      * Logic này cần được implement dựa trên business rules
//      */
//     private UUID getStudentIdFromSession(Session session) {
//         // TODO: Implement logic để lấy student ID
//         // Có thể từ SessionParticipant hoặc ClassEnrollment
//         // Hiện tại return null, cần update sau
//         return null;
//     }
// }