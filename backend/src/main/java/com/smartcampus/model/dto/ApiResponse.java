package com.smartcampus.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private Boolean success;
    private T data;
    private String message;
    private String error;
    private Map<String, String> details;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation successful");
    }

    public static <T> ApiResponse<T> error(String error, Map<String, String> details) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(error)
                .details(details)
                .build();
    }

    public static <T> ApiResponse<T> error(String error) {
        return error(error, null);
    }
}
