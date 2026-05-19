package com.dsatracker.repository;

import com.dsatracker.entity.ConceptLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConceptLogRepository extends JpaRepository<ConceptLog, Long> {

    List<ConceptLog> findByUserId(Integer userId);

    Optional<ConceptLog> findByUserIdAndTopicId(Integer userId, String topicId);

    long countByUserIdAndStatus(Integer userId, ConceptLog.ConceptStatus status);
}
