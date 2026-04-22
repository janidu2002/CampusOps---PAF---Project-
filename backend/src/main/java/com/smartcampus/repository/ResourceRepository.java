package com.smartcampus.repository;

import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Page<Resource> findByTypeAndStatus(ResourceType type, String status, Pageable pageable);

    Page<Resource> findByLocationContainingAndStatus(String location, String status, Pageable pageable);

    Page<Resource> findByCapacityGreaterThanEqualAndStatus(Integer capacity, String status, Pageable pageable);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:location IS NULL OR r.location LIKE %:location%) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity)")
    Page<Resource> findByFilters(
            @Param("type") ResourceType type,
            @Param("location") String location,
            @Param("status") String status,
            @Param("capacity") Integer capacity,
            Pageable pageable
    );

    List<Resource> findByStatus(String status);
}
