package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.request.CommentRequestDTO;
import com.smartcampus.model.entity.Comment;
import com.smartcampus.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ApiResponse<List<Comment>> getTicketComments(@PathVariable Long ticketId) {
        return ApiResponse.success(commentService.getTicketComments(ticketId));
    }

    @PostMapping
    public ApiResponse<Comment> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(commentService.addComment(ticketId, dto, userDetails.getUsername()), "Comment added successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<Comment> updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(commentService.updateComment(ticketId, id, dto, userDetails.getUsername()), "Comment updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(ticketId, id, userDetails.getUsername());
        return ApiResponse.success(null, "Comment deleted successfully");
    }
}

