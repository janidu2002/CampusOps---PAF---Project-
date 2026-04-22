package com.smartcampus.model.dto.request;

import com.smartcampus.model.enums.Priority;
import com.smartcampus.model.enums.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketRequestDTO {
    private Long resourceId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private String contactDetails;
}
