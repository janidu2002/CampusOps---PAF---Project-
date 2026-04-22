package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.request.TicketRequestDTO;
import com.smartcampus.model.dto.response.TicketResponseDTO;
import com.smartcampus.model.enums.Priority;
import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.service.TicketService;
import com.smartcampus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    @GetMapping
    public ApiResponse<Page<TicketResponseDTO>> getAllTickets(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) TicketCategory category,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long requestUserId = userId;
        if (requestUserId == null && userDetails != null) {
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isTechnician = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIAN"));
            
            if (!isAdmin && !isTechnician) {
                requestUserId = userService.getUserEntityByEmail(userDetails.getUsername()).getId();
            }
        }

        return ApiResponse.success(ticketService.getAllTickets(requestUserId, status, priority, category, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        return ApiResponse.success(ticketService.getTicketById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<TicketResponseDTO> createTicket(
            @RequestParam("title") String title,
            @RequestParam("category") TicketCategory category,
            @RequestParam("description") String description,
            @RequestParam("priority") Priority priority,
            @RequestParam(value = "resourceId", required = false) Long resourceId,
            @RequestParam(value = "contactDetails", required = false) String contactDetails,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            TicketRequestDTO dto = TicketRequestDTO.builder()
                    .title(title)
                    .category(category)
                    .description(description)
                    .priority(priority)
                    .resourceId(resourceId)
                    .contactDetails(contactDetails)
                    .build();

            return ApiResponse.success(ticketService.createTicket(dto, files, userDetails.getUsername()), "Ticket created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to create ticket: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<TicketResponseDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status,
            @RequestParam(value = "notes", required = false) String notes,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(ticketService.updateTicketStatus(id, status, notes, userDetails.getUsername()), "Ticket status updated successfully");
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TicketResponseDTO> assignTicket(
            @PathVariable Long id,
            @RequestParam Long technicianId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(ticketService.assignTicket(id, technicianId, userDetails.getUsername()), "Ticket assigned successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ApiResponse.success(null, "Ticket deleted successfully");
    }
}
