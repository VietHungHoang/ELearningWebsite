package com.elearning.learner_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Learner {

    @Id
    // Liên kết tới Account ở user-service
    private Long accountId;

    // Thông tin học viên riêng
    private String studentCode; // ví dụ: mã học viên
    private String major;
    private Integer points;

    // Thời gian tạo / cập nhật
    private Long createdAt;
    private Long updatedAt;
}
