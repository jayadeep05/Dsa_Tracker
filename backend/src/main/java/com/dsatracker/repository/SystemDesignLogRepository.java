package com.dsatracker.repository;

import com.dsatracker.entity.SystemDesignLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemDesignLogRepository extends JpaRepository<SystemDesignLog, Long> {

    List<SystemDesignLog> findByUserId(Integer userId);

    Optional<SystemDesignLog> findByUserIdAndTopicId(Integer userId, String topicId);

    long countByUserIdAndStatus(Integer userId, SystemDesignLog.SystemDesignStatus status);
}
