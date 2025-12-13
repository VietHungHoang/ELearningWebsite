package com.elearning.tutorservice.aop.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private final ObjectMapper objectMapper;

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restController() {}

    @Around("restController()")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

        String username = getUsername(joinPoint.getArgs());
        String api = request.getMethod() + " " + request.getRequestURI();
        String requestBody = getRequestBody(joinPoint.getArgs());

        logger.info("[REQUEST]: username: {}, api: {}, request: {}", username, api, requestBody);

        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long endTime = System.currentTimeMillis();

        String responseBody = getResponseBody(result);
        logger.info("[RESPONSE]: username: {}, api: {}, response: {}, duration: {}ms", username, api, responseBody, (endTime - startTime));

        return result;
    }

    private String getUsername(Object[] args) {
        // Try to extract username from request body if it's a login request
        for (Object arg : args) {
            if (arg != null && arg.getClass().getSimpleName().equals("LoginRequest")) {
                try {
                    // Assuming LoginRequest has getEmail method
                    return (String) arg.getClass().getMethod("getEmail").invoke(arg);
                } catch (Exception e) {
                    // Ignore
                }
            }
        }
        return "anonymous";
    }

    private String getRequestBody(Object[] args) {
        for (Object arg : args) {
            if (arg != null && !(arg instanceof HttpServletRequest)) {
                try {
                    return objectMapper.writeValueAsString(arg);
                } catch (Exception e) {
                    return arg.toString();
                }
            }
        }
        return "{}";
    }

    private String getResponseBody(Object result) {
        if (result == null) {
            return "null";
        }
        try {
            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            return result.toString();
        }
    }
}