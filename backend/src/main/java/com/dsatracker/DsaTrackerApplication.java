package com.dsatracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DsaTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DsaTrackerApplication.class, args);
    }
}
