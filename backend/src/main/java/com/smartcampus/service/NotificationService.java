package com.smartcampus.service;

import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.entity.Comment;
import com.smartcampus.model.entity.Notification;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public void notifyBookingApproved(Booking booking) {
        Notification notification = Notification.builder()
                .user(booking.getUser())
                .title("Booking Approved")
                .message("Your booking for " + booking.getResource().getName() + " has been approved.")
                .type(NotificationType.BOOKING_APPROVED)
                .referenceId(booking.getId())
                .referenceType("BOOKING")
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyBookingRejected(Booking booking) {
        Notification notification = Notification.builder()
                .user(booking.getUser())
                .title("Booking Rejected")
                .message("Your booking for " + booking.getResource().getName() + " has been rejected. Reason: " + booking.getAdminNote())
                .type(NotificationType.BOOKING_REJECTED)
                .referenceId(booking.getId())
                .referenceType("BOOKING")
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyBookingCancelled(Booking booking) {
        Notification notification = Notification.builder()
                .user(booking.getUser())
                .title("Booking Cancelled")
                .message("Your booking for " + booking.getResource().getName() + " has been cancelled.")
                .type(NotificationType.BOOKING_CANCELLED)
                .referenceId(booking.getId())
                .referenceType("BOOKING")
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyTicketStatusChanged(Ticket ticket) {
        Notification notification = Notification.builder()
                .user(ticket.getReportedBy())
                .title("Ticket Status Updated")
                .message("Your ticket \"" + ticket.getTitle() + "\" status is now " + ticket.getStatus())
                .type(NotificationType.TICKET_STATUS_CHANGED)
                .referenceId(ticket.getId())
                .referenceType("TICKET")
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyNewComment(Comment comment) {
        if (!comment.getUser().getId().equals(comment.getTicket().getReportedBy().getId())) {
            Notification notification = Notification.builder()
                    .user(comment.getTicket().getReportedBy())
                    .title("New Comment on Ticket")
                    .message("A new comment has been added to your ticket \"" + comment.getTicket().getTitle() + "\"")
                    .type(NotificationType.TICKET_COMMENT)
                    .referenceId(comment.getTicket().getId())
                    .referenceType("TICKET")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyTicketAssigned(Ticket ticket) {
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().getId().equals(ticket.getReportedBy().getId())) {
            Notification notification = Notification.builder()
                    .user(ticket.getAssignedTo())
                    .title("New Ticket Assigned")
                    .message("A new ticket \"" + ticket.getTitle() + "\" has been assigned to you.")
                    .type(NotificationType.TICKET_ASSIGNED)
                    .referenceId(ticket.getId())
                    .referenceType("TICKET")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
