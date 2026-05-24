package com.dsatracker.repository;

import com.dsatracker.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByPatternIdOrderByDisplayOrderAsc(Integer patternId);

    Optional<Question> findByName(String name);

    List<Question> findAllByName(String name);

    List<Question> findAllByLcUrl(String lcUrl);

    @Query("SELECT q FROM Question q WHERE " +
           "(:q IS NULL OR LOWER(q.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(q.insight) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:patternId IS NULL OR q.pattern.id = :patternId) " +
           "AND (:difficulty IS NULL OR q.difficulty = :difficulty) " +
           "AND (:importance IS NULL OR q.importance = :importance) " +
           "AND (:tag IS NULL OR LOWER(q.tags) LIKE LOWER(CONCAT('%', :tag, '%'))) " +
           "AND (:company IS NULL OR LOWER(q.companies) LIKE LOWER(CONCAT('%', :company, '%'))) " +
           "ORDER BY q.pattern.prepOrder ASC, q.displayOrder ASC")
    List<Question> searchQuestions(
            @Param("q") String q,
            @Param("patternId") Integer patternId,
            @Param("difficulty") Question.Difficulty difficulty,
            @Param("importance") Question.Importance importance,
            @Param("tag") String tag,
            @Param("company") String company
    );

    @Query("SELECT q FROM Question q JOIN q.pattern p ORDER BY p.prepOrder ASC, q.displayOrder ASC")
    List<Question> findAllOrderByPrepOrderAndDisplayOrder();

    @Query("SELECT q FROM Question q WHERE q.importance = 'must' ORDER BY q.pattern.prepOrder ASC, q.displayOrder ASC")
    List<Question> findMustQuestionsOrdered();

    @Query("SELECT q FROM Question q WHERE LOWER(q.tags) LIKE '%oa%' AND q.importance IN ('must', 'strong') ORDER BY q.pattern.prepOrder ASC, q.displayOrder ASC")
    List<Question> findOaPrepQuestions();
}
