package com.dsatracker.repository;

import com.dsatracker.entity.CheckpointResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckpointResultRepository extends JpaRepository<CheckpointResult, Long> {

    List<CheckpointResult> findByUserIdAndPhaseIdOrderByAttemptedAtDesc(Integer userId, String phaseId);

    List<CheckpointResult> findByUserIdOrderByAttemptedAtDesc(Integer userId);
}
