package com.elearning.cart_service.enums;

/**
 * Trạng thái của Cart
 * OPEN : Cart đang mở, user còn thao tác được (add/remove/checkout)
 * CONVERTED : Cart đã được chuyển thành Order (đã checkout)
 */
public enum CartStatus {
    OPEN,
    CONVERTED
}
