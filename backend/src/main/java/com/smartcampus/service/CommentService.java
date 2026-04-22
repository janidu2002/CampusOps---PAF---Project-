package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.UnauthorizedException;
import com.smartcampus.model.dto.request.CommentRequestDTO;
import com.smartcampus.model.dto.response.TicketResponseDTO;
import com.smartcampus.model.entity.Comment;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.User;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public List<Comment> getTicketComments(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    @Transactional
    public Comment addComment(Long ticketId, CommentRequestDTO dto, String userEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));

        User user = userService.getUserEntityByEmail(userEmail);

        Comment comment = Comment.builder()
                .ticket(ticket)
                .user(user)
                .content(dto.getContent())
                .build();

        comment = commentRepository.save(comment);
        notificationService.notifyNewComment(comment);

        return comment;
    }

    @Transactional
    public Comment updateComment(Long ticketId, Long commentId, CommentRequestDTO dto, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        User user = userService.getUserEntityByEmail(userEmail);

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(dto.getContent());
        comment = commentRepository.save(comment);

        return comment;
    }

    @Transactional
    public void deleteComment(Long ticketId, Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        User user = userService.getUserEntityByEmail(userEmail);

        if (!comment.getUser().getId().equals(user.getId()) && 
            !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }
}
