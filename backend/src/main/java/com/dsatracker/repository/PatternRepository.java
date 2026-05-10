package com.dsatracker.repository;

import com.dsatracker.entity.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatternRepository extends JpaRepository<Pattern, Integer> {
    List<Pattern> findAllByOrderByPrepOrderAsc();
    long countBy();
}
