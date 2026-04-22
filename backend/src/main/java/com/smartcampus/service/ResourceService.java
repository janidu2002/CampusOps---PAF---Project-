package com.smartcampus.service;

import com.smartcampus.model.dto.request.ResourceRequestDTO;
import com.smartcampus.model.dto.ResourceDTO;
import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.enums.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Page<ResourceDTO> getAllResources(ResourceType type, String location, String status, Integer capacity, Pageable pageable) {
        return resourceRepository.findByFilters(type, location, status, capacity, pageable)
                .map(this::toDTO);
    }

    public ResourceDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return toDTO(resource);
    }

    @Transactional
    public ResourceDTO createResource(ResourceRequestDTO dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .availabilityStart(dto.getAvailabilityStart())
                .availabilityEnd(dto.getAvailabilityEnd())
                .status(dto.getStatus())
                .description(dto.getDescription())
                .build();
        resource = resourceRepository.save(resource);
        return toDTO(resource);
    }

    @Transactional
    public ResourceDTO updateResource(Long id, ResourceRequestDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityStart(dto.getAvailabilityStart());
        resource.setAvailabilityEnd(dto.getAvailabilityEnd());
        resource.setStatus(dto.getStatus());
        resource.setDescription(dto.getDescription());
        
        resource = resourceRepository.save(resource);
        return toDTO(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        resourceRepository.delete(resource);
    }

    public List<ResourceDTO> getAvailableResources() {
        return resourceRepository.findByStatus("ACTIVE").stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ResourceDTO toDTO(Resource resource) {
        return ResourceDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityStart(resource.getAvailabilityStart())
                .availabilityEnd(resource.getAvailabilityEnd())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
