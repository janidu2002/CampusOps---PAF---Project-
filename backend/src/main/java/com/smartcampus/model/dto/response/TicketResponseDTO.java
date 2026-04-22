package com.smartcampus.model.dto.response;

import com.smartcampus.model.enums.Priority;
import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDTO {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private Long reportedBy;
    private String reportedByName;
    private String reportedByEmail;
    private Long assignedTo;
    private String assignedToName;
    private String assignedToEmail;
    private String title;
    private TicketCategory category;
    private String description;
    private Priority priority;
    private String contactDetails;
    private TicketStatus status;
    private String resolutionNotes;
    private String rejectionReason;
    private List<TicketAttachmentDTO> attachments;
    private List<CommentDTO> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TicketAttachmentDTO {
        private Long id;
        private String fileName;
        private String filePath;
        private String fileType;
        private LocalDateTime uploadedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentDTO {
        private Long id;
        private Long userId;
        private String userName;
        private String userAvatarUrl;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
