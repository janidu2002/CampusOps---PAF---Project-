package com.smartcampus.service;

import com.smartcampus.exception.ConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.UnauthorizedException;
import com.smartcampus.model.dto.request.BookingRequestDTO;
import com.smartcampus.model.dto.response.BookingResponseDTO;
import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public Page<BookingResponseDTO> getAllBookings(Long userId, BookingStatus status, LocalDate date, Long resourceId, Pageable pageable) {
        return bookingRepository.findByFilters(userId, status, date, resourceId, pageable)
                .map(this::toDTO);
    }

    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        return toDTO(booking);
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource", dto.getResourceId()));

        if (!"ACTIVE".equals(resource.getStatus())) {
            throw new RuntimeException("Resource is not available for booking");
        }

        boolean conflict = bookingRepository.existsConflict(
                resource.getId(),
                dto.getBookingDate(),
                dto.getStartTime(),
                dto.getEndTime(),
                null
        );

        if (conflict) {
            throw new ConflictException("Resource is already booked for the requested time slot");
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .user(user)
                .bookingDate(dto.getBookingDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        return toDTO(booking);
    }

    @Transactional
    public BookingResponseDTO approveBooking(Long id, String adminEmail, String adminNote) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        User admin = userService.getUserEntityByEmail(adminEmail);

        boolean conflict = bookingRepository.existsConflict(
                booking.getResource().getId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                id
        );

        if (conflict) {
            throw new ConflictException("Resource is already booked for the requested time slot");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminNote(adminNote);
        booking.setReviewedBy(admin);
        booking.setReviewedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);
        notificationService.notifyBookingApproved(booking);

        return toDTO(booking);
    }

    @Transactional
    public BookingResponseDTO rejectBooking(Long id, String adminEmail, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        User admin = userService.getUserEntityByEmail(adminEmail);

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminNote(rejectionReason);
        booking.setReviewedBy(admin);
        booking.setReviewedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);
        notificationService.notifyBookingRejected(booking);

        return toDTO(booking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        User user = userService.getUserEntityByEmail(userEmail);

        if (!booking.getUser().getId().equals(user.getId()) && 
            !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        notificationService.notifyBookingCancelled(booking);

        return toDTO(booking);
    }

    private BookingResponseDTO toDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .resourceType(booking.getResource().getType())
                .resourceLocation(booking.getResource().getLocation())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminNote(booking.getAdminNote())
                .reviewedBy(booking.getReviewedBy() != null ? booking.getReviewedBy().getId() : null)
                .reviewedByName(booking.getReviewedBy() != null ? booking.getReviewedBy().getName() : null)
                .reviewedAt(booking.getReviewedAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
