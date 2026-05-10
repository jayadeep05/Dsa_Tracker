package com.dsatracker.repository;

import com.dsatracker.entity.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Integer> {

    Optional<DailyLog> findByUserIdAndLogDate(Integer userId, LocalDate logDate);

    @Query("SELECT d FROM DailyLog d WHERE d.user.id = :userId AND d.logDate >= :from ORDER BY d.logDate ASC")
    List<DailyLog> findLastNDays(@Param("userId") Integer userId, @Param("from") LocalDate from);

    @Query("SELECT d FROM DailyLog d WHERE d.user.id = :userId AND d.qsSolved > 0 ORDER BY d.logDate DESC")
    List<DailyLog> findLogsWithActivity(@Param("userId") Integer userId);
}
