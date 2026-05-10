package com.dsatracker.repository;

import com.dsatracker.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Integer> {

    Optional<Progress> findByUserIdAndQuestionId(Integer userId, Integer questionId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.status = 'solved'")
    List<Progress> findAllSolved(@org.springframework.data.repository.query.Param("userId") Integer userId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.needsRevision = true")
    List<Progress> findNeedsRevision(@org.springframework.data.repository.query.Param("userId") Integer userId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.question.pattern.id = :patternId")
    List<Progress> findByPatternId(@org.springframework.data.repository.query.Param("userId") Integer userId, @org.springframework.data.repository.query.Param("patternId") Integer patternId);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.user.id = :userId AND p.status = 'solved'")
    long countSolved(@org.springframework.data.repository.query.Param("userId") Integer userId);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.user.id = :userId AND p.status = 'attempted'")
    long countAttempted(@org.springframework.data.repository.query.Param("userId") Integer userId);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.user.id = :userId AND p.question.importance = 'must' AND p.status = 'solved'")
    long countMustSolved(@org.springframework.data.repository.query.Param("userId") Integer userId);
}
