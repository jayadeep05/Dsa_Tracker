package com.dsatracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.dsatracker.repository.QuestionRepository;
import com.dsatracker.repository.PatternRepository;

@SpringBootTest
public class CountTest {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private PatternRepository patternRepository;

    @Test
    public void printCounts() {
        System.out.println("=================================================");
        System.out.println("TOTAL_QUESTIONS_IN_DB: " + questionRepository.count());
        System.out.println("TOTAL_PATTERNS_IN_DB: " + patternRepository.countBy());
        System.out.println("=================================================");
    }
}
