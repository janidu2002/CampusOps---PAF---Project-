package com.smartcampus.repository;

import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUser_Id(Long userId, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByBookingDate(LocalDate date, Pageable pageable);

    Page<Booking> findByResource_Id(Long resourceId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:userId IS NULL OR b.user.id = :userId) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:date IS NULL OR b.bookingDate = :date) AND " +
           "(:resourceId IS NULL OR b.resource.id = :resourceId)")
    Page<Booking> findByFilters(
            @Param("userId") Long userId,
            @Param("status") BookingStatus status,
            @Param("date") LocalDate date,
            @Param("resourceId") Long resourceId,
            Pageable pageable
    );

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.resource.id = :resourceId " +
           "AND b.bookingDate = :date " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND (:excludeId IS NULL OR b.id != :excludeId) " +
           "AND NOT (b.endTime <= :startTime OR b.startTime >= :endTime)")
    boolean existsConflict(
            @Param("resourceId") Long resourceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    List<Booking> findByResource_IdAndBookingDateAndStatusIn(
            Long resourceId, LocalDate date, List<BookingStatus> statuses
    );
}
