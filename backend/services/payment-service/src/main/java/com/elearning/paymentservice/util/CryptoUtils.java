package com.elearning.paymentservice.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public final class CryptoUtils {

    private CryptoUtils() {
    }

    public static String hmacSha256Hex(String secret, String message) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] macData = sha256_HMAC.doFinal(message.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(macData.length * 2);
        for (byte b : macData) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
