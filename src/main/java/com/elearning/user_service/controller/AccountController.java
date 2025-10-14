package com.elearning.user_service.controller;

import com.elearning.user_service.dto.request.AccountCreateRequest;
import com.elearning.user_service.dto.response.AccountResponse;
import com.elearning.user_service.dto.response.ApiResponse;
import com.elearning.user_service.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * ✅ [Internal] Tạo tài khoản mới — được gọi bởi auth-service
     */
    @PostMapping("/internal")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @RequestBody AccountCreateRequest request) {
        try {
            AccountResponse response = accountService.createAccount(request);
            return ResponseEntity.ok(ApiResponse.success(response, "Tạo tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(400, e.getMessage()));
        }
    }

    /**
     * ✅ Lấy thông tin account theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(@PathVariable Long id) {
        try {
            AccountResponse response = accountService.getAccountById(id);
            return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }

    /**
     * ✅ Lấy danh sách account hoặc tìm theo email
     * - /accounts → lấy tất cả
     * - /accounts?email=john@gmail.com → tìm 1 người
     */
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAccounts(@RequestParam(required = false) String email) {
        try {
            if (email != null && !email.isEmpty()) {
                AccountResponse response = accountService.getAccountByEmail(email);
                return ResponseEntity.ok(ApiResponse.success(response, "Tìm tài khoản theo email thành công"));
            }
            List<AccountResponse> responses = accountService.getAllAccounts();
            return ResponseEntity.ok(ApiResponse.success(responses, "Lấy danh sách tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(@PathVariable Long id) {
        try {
            accountService.deactivateAccount(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Vô hiệu hóa tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateAccount(@PathVariable Long id) {
        try {
            accountService.activateAccount(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Kích hoạt lại tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(400, e.getMessage()));
        }
    }

}
