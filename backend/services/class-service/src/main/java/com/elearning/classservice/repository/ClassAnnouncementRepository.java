package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassAnnouncementRepository extends JpaRepository<ClassAnnouncement, UUID> {
    List<ClassAnnouncement> findByClassEntityIdOrderByDateDesc(UUID classId);
}
