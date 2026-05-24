package com.dsatracker.service;

import com.dsatracker.dto.QuestionDto;
import com.dsatracker.entity.Question;
import com.dsatracker.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialListService {

    private final QuestionRepository questionRepository;
    private final ProgressService progressService;

    // Revision-20 exact names
    private static final List<String> REVISION_20 = Arrays.asList(
            "Two Sum II - Input Array Sorted", "Longest Substring Without Repeating Characters",
            "Binary Search", "Koko Eating Bananas", "Product of Array Except Self",
            "Subarray Sum Equals K", "Number of Islands", "Rotting Oranges",
            "Course Schedule", "Invert Binary Tree", "Binary Tree Level Order Traversal",
            "Validate Binary Search Tree", "House Robber", "Coin Change",
            "Longest Common Subsequence", "Daily Temperatures", "Merge Intervals",
            "Top K Frequent Elements", "Combination Sum", "Single Number"
    );

    // Skipped Gems exact names
    private static final List<String> SKIPPED_GEMS = Arrays.asList(
            "Sum of Subarray Minimums", "Continuous Subarray Sum", "Contiguous Array",
            "Maximum Profit in Job Scheduling", "Aggressive Cows (GFG)",
            "Gas Station", "Minimum Platforms (GFG)",
            "Number of Ways to Arrive at Destination", "Find Eventual Safe States",
            "Reverse Linked List", "Kth Smallest Element in Sorted Matrix",
            "Subarrays with K Different Integers", "Redundant Connection"
    );

    public List<QuestionDto> getList(String listName, Integer userId) {
        return switch (listName) {
            case "revision20" -> getRevision20(userId);
            case "top50" -> getTop50(userId);
            case "oa-prep" -> getOaPrep(userId);
            case "skipped-gems" -> getSkippedGems(userId);
            default -> throw new RuntimeException("Unknown list: " + listName);
        };
    }

    private List<QuestionDto> getRevision20(Integer userId) {
        return REVISION_20.stream()
                .map(name -> {
                    // Fuzzy match: find question whose name contains the given name
                    Optional<Question> q = questionRepository.findByName(name);
                    if (q.isEmpty()) {
                        // Try partial match
                        List<Question> all = questionRepository.findAllOrderByPrepOrderAndDisplayOrder();
                        q = all.stream()
                                .filter(question -> question.getName().toLowerCase().contains(name.toLowerCase()) ||
                                        name.toLowerCase().contains(question.getName().toLowerCase()))
                                .findFirst();
                    }
                    return q;
                })
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(q -> progressService.toQuestionDto(q, userId))
                .collect(Collectors.toList());
    }

    private List<QuestionDto> getTop50(Integer userId) {
        List<Question> mustQuestions = questionRepository.findMustQuestionsOrdered();
        // Only from patterns 1-13 (prep_order 1-13)
        return mustQuestions.stream()
                .filter(q -> q.getPattern().getPrepOrder() <= 13)
                .limit(50)
                .map(q -> progressService.toQuestionDto(q, userId))
                .collect(Collectors.toList());
    }

    private List<QuestionDto> getOaPrep(Integer userId) {
        return questionRepository.findOaPrepQuestions().stream()
                .map(q -> progressService.toQuestionDto(q, userId))
                .collect(Collectors.toList());
    }

    private List<QuestionDto> getSkippedGems(Integer userId) {
        List<Question> all = questionRepository.findAllOrderByPrepOrderAndDisplayOrder();
        return SKIPPED_GEMS.stream()
                .map(name -> all.stream()
                        .filter(q -> q.getName().toLowerCase().contains(name.toLowerCase()) ||
                                name.toLowerCase().contains(q.getName().toLowerCase()))
                        .findFirst())
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(q -> progressService.toQuestionDto(q, userId))
                .collect(Collectors.toList());
    }
}
