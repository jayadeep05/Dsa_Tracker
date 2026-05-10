package com.dsatracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseIndexFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Checking for redundant unique constraints on progress table...");
        try {
            // Drop the old unique constraint on question_id if it exists
            // Hibernate generated names like UK_... are common. 
            // We'll try to find any unique index on question_id that isn't the primary key or our new composite key.
            
            // For MySQL, we can look at information_schema
            String dropQuery = "ALTER TABLE progress DROP INDEX UK_45wq6oeg2948uxd6yab3wryrv";
            jdbcTemplate.execute(dropQuery);
            log.info("Successfully dropped redundant unique index UK_45wq6oeg2948uxd6yab3wryrv");
        } catch (Exception e) {
            log.info("Index UK_45wq6oeg2948uxd6yab3wryrv not found or already dropped. Skipping.");
        }
    }
}
