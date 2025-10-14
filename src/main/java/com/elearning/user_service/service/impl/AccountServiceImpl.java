package com.elearning.user_service.service.impl;

import com.elearning.user_service.dto.request.AccountCreateRequest;
import com.elearning.user_service.dto.response.AccountResponse;
import com.elearning.user_service.model.Account;
import com.elearning.user_service.repository.AccountRepository;
import com.elearning.user_service.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Override
    public AccountResponse createAccount(AccountCreateRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        Account account = Account.builder()
                .email(request.getEmail())
                .role(request.getRole())
                .active(true)
                .build();

        accountRepository.save(account);

        return mapToResponse(account);
    }

    @Override
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy account với ID: " + id));

        return mapToResponse(account);
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (!account.isActive()) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        account.setActive(false);
        accountRepository.save(account);
    }

    @Override
    public AccountResponse getAccountByEmail(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));
        return mapToResponse(account);
    }

    @Override
    public void activateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (account.isActive()) {
            throw new RuntimeException("Tài khoản đang hoạt động");
        }

        account.setActive(true);
        accountRepository.save(account);
    }

    // ---- Helper ----
    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())

                .email(account.getEmail())
                .role(account.getRole())
                .build();
    }
}
