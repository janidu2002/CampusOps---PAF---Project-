package com.smartcampus.model.dto;

import com.smartcampus.model.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceDTO {
    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
