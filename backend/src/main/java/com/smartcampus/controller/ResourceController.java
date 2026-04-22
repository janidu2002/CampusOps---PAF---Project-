package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.ResourceDTO;
import com.smartcampus.model.dto.request.ResourceRequestDTO;
import com.smartcampus.model.enums.ResourceType;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ApiResponse<Page<ResourceDTO>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer capacity,
            Pageable pageable) {
        return ApiResponse.success(resourceService.getAllResources(type, location, status, capacity, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<ResourceDTO> getResourceById(@PathVariable Long id) {
        return ApiResponse.success(resourceService.getResourceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ResourceDTO> createResource(@Valid @RequestBody ResourceRequestDTO dto) {
        return ApiResponse.success(resourceService.createResource(dto), "Resource created successfully");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ResourceDTO> updateResource(@PathVariable Long id, @Valid @RequestBody ResourceRequestDTO dto) {
        return ApiResponse.success(resourceService.updateResource(id, dto), "Resource updated successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ApiResponse.success(null, "Resource deleted successfully");
    }
}
