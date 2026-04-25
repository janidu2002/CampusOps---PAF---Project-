package com.smartcampus.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.request.BookingRequestDTO;
import com.smartcampus.model.dto.response.BookingResponseDTO;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.service.BookingService;
import com.smartcampus.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @GetMapping
    public ApiResponse<Page<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long resourceId,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long requestUserId = userId;
        if (requestUserId == null && userDetails != null) {
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                requestUserId = userService.getUserEntityByEmail(userDetails.getUsername()).getId();
            }
        }

        return ApiResponse.success(bookingService.getAllBookings(requestUserId, status, date, resourceId, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ApiResponse.success(bookingService.getBookingById(id));
    }

    @PostMapping
    public ApiResponse<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(bookingService.createBooking(dto, userDetails.getUsername()), "Booking request submitted successfully");
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BookingResponseDTO> approveBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String adminNote,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(bookingService.approveBooking(id, userDetails.getUsername(), adminNote), "Booking approved successfully");
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @RequestParam String rejectionReason,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(bookingService.rejectBooking(id, userDetails.getUsername(), rejectionReason), "Booking rejected successfully");
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(bookingService.cancelBooking(id, userDetails.getUsername()), "Booking cancelled successfully");
    }
}

