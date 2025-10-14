package com.elearning.user_service.service;

import com.elearning.user_service.dto.request.AccountCreateRequest;
import com.elearning.user_service.dto.response.AccountResponse;

import java.util.List;

public interface AccountService {

    // (1) Nhận dữ liệu khi user mới đăng ký (từ auth-service)
    AccountResponse createAccount(AccountCreateRequest request);

    // (2) Lấy thông tin tài khoản (cho các service khác hoặc admin)
    AccountResponse getAccountById(Long id);

    AccountResponse getAccountByEmail(String email);

    // (4) Quản trị - xem danh sách hoặc xóa tài khoản
    List<AccountResponse> getAllAccounts();

    // ⚡ (5) Vô hiệu hóa tài khoản (thay cho delete)
    void deactivateAccount(Long id);

    // ⚡ (6) Kích hoạt lại tài khoản (tùy chọn)
    void activateAccount(Long id);
}
