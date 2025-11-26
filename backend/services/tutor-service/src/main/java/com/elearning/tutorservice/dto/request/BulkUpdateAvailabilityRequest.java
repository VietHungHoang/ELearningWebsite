package com.elearning.tutorservice.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO cho bulk update availability
 * Hỗ trợ 2 modes:
 * - "this_period": Chỉ ảnh hưởng trong khoảng startDate → endDate
 * - "recurring": Ảnh hưởng toàn bộ recurring pattern (vô hạn)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUpdateAvailabilityRequest {
    
    /**
     * Mode cập nhật:
     * - "this_period": Chỉ ảnh hưởng khoảng thời gian cụ thể
     * - "recurring": Ảnh hưởng toàn bộ pattern (thường dùng khi set lịch cố định)
     */
    @NotBlank(message = "Mode is required")
    private String mode;
    
    /**
     * Ngày bắt đầu của period (required nếu mode = "this_period")
     * Frontend sẽ truyền đầu tuần
     */
    private LocalDate startDate;
    
    /**
     * Ngày kết thúc của period (required nếu mode = "this_period")
     * Frontend sẽ truyền cuối tuần
     */
    private LocalDate endDate;
    
    /**
     * Danh sách IDs của availability cũ cần xóa/update
     * - Mode "this_period": Sẽ split hoặc truncate availability
     * - Mode "recurring": Sẽ set status = DELETED
     */
    private List<UUID> oldAvailabilityIds;
    
    /**
     * Danh sách availability mới cần tạo
     */
    @Valid
    @NotNull(message = "New availabilities is required")
    private List<AvailabilityInput> newAvailabilities;
}
