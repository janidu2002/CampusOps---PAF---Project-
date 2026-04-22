package com.smartcampus.model.dto.request;

import com.smartcampus.model.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestDTO {
    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private LocalTime availabilityStart;

    private LocalTime availabilityEnd;

    @NotBlank(message = "Status is required")
    private String status;

    private String description;
}
