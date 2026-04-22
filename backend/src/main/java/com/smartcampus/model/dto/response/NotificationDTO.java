package com.smartcampus.model.dto.response;

import com.smartcampus.model.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private Long referenceId;
    private String referenceType;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
