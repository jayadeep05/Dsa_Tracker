package com.dsatracker.service;

import com.dsatracker.entity.DailyLog;
import com.dsatracker.repository.DailyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final DailyLogRepository dailyLogRepository;

    public int getCurrentStreak(Integer userId) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        List<DailyLog> logs = dailyLogRepository.findLogsWithActivity(userId);
        if (logs.isEmpty()) return 0;

        int streak = 0;
        LocalDate check = today;

        boolean todaySolved = logs.stream().anyMatch(l -> l.getLogDate().equals(today));
        if (!todaySolved) {
            check = today.minusDays(1);
        }

        for (int i = 0; i < logs.size(); i++) {
            final LocalDate checkDate = check;
            boolean found = logs.stream().anyMatch(l -> l.getLogDate().equals(checkDate) && l.getQsSolved() > 0);
            if (found) {
                streak++;
                check = check.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }

    public int getLongestStreak(Integer userId) {
        List<DailyLog> logs = dailyLogRepository.findLogsWithActivity(userId);
        if (logs.isEmpty()) return 0;

        logs.sort((a, b) -> a.getLogDate().compareTo(b.getLogDate()));

        int maxStreak = 1;
        int currentStreak = 1;

        for (int i = 1; i < logs.size(); i++) {
            LocalDate prev = logs.get(i - 1).getLogDate();
            LocalDate curr = logs.get(i).getLogDate();
            if (curr.equals(prev.plusDays(1))) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        return maxStreak;
    }

    public int getTodaySolved(Integer userId) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        return dailyLogRepository.findByUserIdAndLogDate(userId, today)
                .map(DailyLog::getQsSolved)
                .orElse(0);
    }
}
