package com.dsatracker.controller;

import com.dsatracker.dto.DashboardResponse;
import com.dsatracker.entity.DailyLog;
import com.dsatracker.repository.DailyLogRepository;
import com.dsatracker.service.DashboardService;
import com.dsatracker.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final DailyLogRepository dailyLogRepository;
    private final StreakService streakService;

    @GetMapping("/api/dashboard")
    public DashboardResponse getDashboard(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return dashboardService.getDashboard(user.getId());
    }

    @GetMapping("/api/streak")
    public Map<String, Integer> getStreak(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return Map.of(
                "currentStreak", streakService.getCurrentStreak(user.getId()),
                "longestStreak", streakService.getLongestStreak(user.getId()),
                "todaySolved", streakService.getTodaySolved(user.getId())
        );
    }

    @PostMapping("/api/daily-log")
    public ResponseEntity<DailyLog> logToday(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user, @RequestBody(required = false) Map<String, Object> body) {
        DailyLog log = dailyLogRepository.findByUserIdAndLogDate(user.getId(), LocalDate.now())
                .orElseGet(() -> dailyLogRepository.save(
                        DailyLog.builder().user(user).logDate(LocalDate.now()).qsSolved(0).qsAttempted(0).minutesSpent(0).build()
                ));
        if (body != null) {
            if (body.containsKey("note")) log.setNote((String) body.get("note"));
        }
        return ResponseEntity.ok(dailyLogRepository.save(log));
    }

    @GetMapping("/api/daily-log")
    public List<DailyLog> getDailyLog(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user, @RequestParam(defaultValue = "30") int days) {
        LocalDate from = LocalDate.now().minusDays(days - 1);
        return dailyLogRepository.findLastNDays(user.getId(), from);
    }
}
