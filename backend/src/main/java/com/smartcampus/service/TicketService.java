package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.request.TicketRequestDTO;
import com.smartcampus.model.dto.response.TicketResponseDTO;
import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.TicketAttachment;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.Priority;
import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;
    private final UserService userService;
    private final CommentService commentService;
    private final NotificationService notificationService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Page<TicketResponseDTO> getAllTickets(Long userId, TicketStatus status, Priority priority, TicketCategory category, Pageable pageable) {
        return ticketRepository.findByFilters(userId, status, priority, category, pageable)
                .map(this::toDTO);
    }

    public TicketResponseDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
        return toDTO(ticket);
    }

    @Transactional
    public TicketResponseDTO createTicket(TicketRequestDTO dto, List<MultipartFile> files, String userEmail) throws IOException {
        User user = userService.getUserEntityByEmail(userEmail);

        Resource resource = null;
        if (dto.getResourceId() != null) {
            resource = resourceRepository.findById(dto.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource", dto.getResourceId()));
        }

        Ticket ticket = Ticket.builder()
                .resource(resource)
                .reportedBy(user)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .contactDetails(dto.getContactDetails())
                .status(TicketStatus.OPEN)
                .attachments(new ArrayList<>())
                .comments(new ArrayList<>())
                .build();

        ticket = ticketRepository.save(ticket);

        if (files != null && !files.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path ticketDir = uploadPath.resolve(String.valueOf(ticket.getId()));
            Files.createDirectories(ticketDir);

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = ticketDir.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath);

                    // Store relative path from upload directory
                    String relativePath = String.valueOf(ticket.getId()) + "/" + fileName;

                    TicketAttachment attachment = TicketAttachment.builder()
                            .ticket(ticket)
                            .fileName(file.getOriginalFilename())
                            .filePath(relativePath)
                            .fileType(file.getContentType())
                            .build();

                    ticket.getAttachments().add(attachment);
                }
            }

            ticket = ticketRepository.save(ticket);
        }

        return toDTO(ticket);
    }

    @Transactional
    public TicketResponseDTO updateTicketStatus(Long id, TicketStatus status, String notes, String userEmail) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));

        User user = userService.getUserEntityByEmail(userEmail);

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (notes != null && !notes.isEmpty()) {
            ticket.setResolutionNotes(notes);
        }

        if (status == TicketStatus.RESOLVED) {
            ticket.setAssignedTo(user);
        }

        ticket = ticketRepository.save(ticket);
        notificationService.notifyTicketStatusChanged(ticket);

        return toDTO(ticket);
    }

    @Transactional
    public TicketResponseDTO assignTicket(Long id, Long technicianId, String userEmail) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));

        User technician = userService.getUserById(technicianId);

        ticket.setAssignedTo(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticket = ticketRepository.save(ticket);
        notificationService.notifyTicketAssigned(ticket);

        return toDTO(ticket);
    }

    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
        ticketRepository.delete(ticket);
    }

    private TicketResponseDTO toDTO(Ticket ticket) {
        List<TicketResponseDTO.TicketAttachmentDTO> attachmentDTOs = ticket.getAttachments().stream()
                .map(att -> TicketResponseDTO.TicketAttachmentDTO.builder()
                        .id(att.getId())
                        .fileName(att.getFileName())
                        .filePath(att.getFilePath())
                        .fileType(att.getFileType())
                        .uploadedAt(att.getUploadedAt())
                        .build())
                .collect(Collectors.toList());

        List<TicketResponseDTO.CommentDTO> commentDTOs = ticket.getComments().stream()
                .map(comment -> TicketResponseDTO.CommentDTO.builder()
                        .id(comment.getId())
                        .userId(comment.getUser().getId())
                        .userName(comment.getUser().getName())
                        .userAvatarUrl(comment.getUser().getAvatarUrl())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResource() != null ? ticket.getResource().getId() : null)
                .resourceName(ticket.getResource() != null ? ticket.getResource().getName() : null)
                .reportedBy(ticket.getReportedBy().getId())
                .reportedByName(ticket.getReportedBy().getName())
                .reportedByEmail(ticket.getReportedBy().getEmail())
                .assignedTo(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null)
                .assignedToEmail(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getEmail() : null)
                .title(ticket.getTitle())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .contactDetails(ticket.getContactDetails())
                .status(ticket.getStatus())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .attachments(attachmentDTOs)
                .comments(commentDTOs)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
