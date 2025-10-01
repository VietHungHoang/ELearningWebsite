package com.elearning.cart_service.enums;

/**
 * Trạng thái của Cart
 * OPEN : Cart đang mở, user còn thao tác được (add/remove/checkout)
 * CONVERTED : Cart đã được chuyển thành Order (đã checkout)
 * EXPIRED : Cart hết hạn do user không thao tác, bị hệ thống xoá/ẩn
 */
public enum CartStatus {
    OPEN,
    CONVERTED,
    EXPIRED
}
