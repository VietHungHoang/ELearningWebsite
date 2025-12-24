package com.elearning.paymentservice.service;

import com.elearning.paymentservice.dto.sepay.SepayIpnRequest;

public interface SepayService {
    
    /**
     * Process IPN notification from SePay
     */
    void processIpn(String secretKey, SepayIpnRequest request);
}
