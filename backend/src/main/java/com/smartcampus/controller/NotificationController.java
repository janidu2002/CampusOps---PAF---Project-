package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.entity.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final com.smartcampus.service.UserService userService;

    @GetMapping
    public ApiResponse<Page<Notification>> getUserNotifications(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        com.smartcampus.model.entity.User user = userService.getUserEntityByEmail(userDetails.getUsername());
        return ApiResponse.success(notificationService.getUserNotifications(user.getId(), pageable));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        com.smartcampus.model.entity.User user = userService.getUserEntityByEmail(userDetails.getUsername());
        return ApiResponse.success(notificationService.getUnreadCount(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null, "Notification marked as read");
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        com.smartcampus.model.entity.User user = userService.getUserEntityByEmail(userDetails.getUsername());
        notificationService.markAllAsRead(user.getId());
        return ApiResponse.success(null, "All notifications marked as read");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ApiResponse.success(null, "Notification deleted successfully");
    }
}
