package com.smartcampus.repository;

import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.enums.Priority;
import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByReportedBy_Id(Long userId, Pageable pageable);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByPriority(Priority priority, Pageable pageable);

    Page<Ticket> findByCategory(TicketCategory category, Pageable pageable);

    Page<Ticket> findByAssignedTo_Id(Long technicianId, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:userId IS NULL OR t.reportedBy.id = :userId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR t.category = :category)")
    Page<Ticket> findByFilters(
            @Param("userId") Long userId,
            @Param("status") TicketStatus status,
            @Param("priority") Priority priority,
            @Param("category") TicketCategory category,
            Pageable pageable
    );

    List<Ticket> findByStatusIn(List<TicketStatus> statuses);
}

