package com.dsatracker.config;
import com.dsatracker.entity.*;
import com.dsatracker.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.io.InputStream;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.*;
@Component @RequiredArgsConstructor @Slf4j
public class DataLoader implements ApplicationRunner {
    private final PatternRepository patternRepository;
    private final QuestionRepository questionRepository;
    // NOTE: The Full Sheet tab in the HTML lists patterns in a different order.
    // prep_order here reflects the CORRECT study sequence from the Preparation Path tab.
    // Always display and navigate questions in prep_order, not the raw DB insert order.
    @Override @Transactional
    public void run(ApplicationArguments args) {
        if (patternRepository.countBy() < 20 || questionRepository.count() < 245) {
            log.info("Database empty or missing questions/patterns. Re-seeding database with all patterns and questions...");
            questionRepository.deleteAll();
            patternRepository.deleteAll();
            seedAll();
            log.info("Seeding complete.");
        }
        log.info("Enriching questions with full dataset from HTML sheet...");
        enrichQuestionsFromJSON();
        log.info("Enrichment complete.");
    }

    private void enrichQuestionsFromJSON() {
        try {
            log.info("Loading enriched questions data from JSON...");
            InputStream is = getClass().getResourceAsStream("/questions_enriched.json");
            if (is == null) {
                log.warn("Enriched questions JSON file not found in classpath!");
                return;
            }
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> list = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
            log.info("Loaded {} questions from JSON. Enriching database questions...", list.size());
            int count = 0;
            for (Map<String, Object> qMap : list) {
                String name = (String) qMap.get("name");
                String lcUrl = (String) qMap.get("lcUrl");
                String insight = (String) qMap.get("insight");

                // Find by LeetCode URL first
                List<Question> qList = new ArrayList<>();
                if (lcUrl != null && !lcUrl.isBlank()) {
                    qList = questionRepository.findAllByLcUrl(lcUrl);
                }
                // Fallback to name
                if (qList.isEmpty() && name != null && !name.isBlank()) {
                    qList = questionRepository.findAllByName(name);
                }

                for (Question q : qList) {
                    q.setInsight(insight);
                    questionRepository.save(q);
                    count++;
                }
            }
            log.info("Enriched {} question records with rich problem statements and metadata.", count);
        } catch (Exception e) {
            log.error("Failed to enrich questions from JSON file", e);
        }
    }

    private void updateRichInsights() {
        updateQInsight("Valid Palindrome",
            "### Description\n" +
            "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\n" +
            "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n" +
            "### Example 1\n" +
            "Input: s = \"A man, a plan, a canal: Panama\"\n" +
            "Output: true\n" +
            "Explanation: \"amanaplanacanalpanama\" is a palindrome.\n\n" +
            "### Example 2\n" +
            "Input: s = \"race a car\"\n" +
            "Output: false\n" +
            "Explanation: \"raceacar\" is not a palindrome.\n\n" +
            "### Constraints\n" +
            "- `1 <= s.length <= 2 * 10^5`\n" +
            "- `s` consists only of printable ASCII characters.");

        updateQInsight("Two Sum II - Input Array Sorted",
            "### Description\n" +
            "Given a **1-indexed** array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific `target` number. Let these two numbers be `numbers[index1]` and `numbers[index2]` where `1 <= index1 < index2 <= numbers.length`.\n\n" +
            "Return the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\n" +
            "The tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.\n\n" +
            "Your solution must use only constant extra space.\n\n" +
            "### Example 1\n" +
            "Input: numbers = [2,7,11,15], target = 9\n" +
            "Output: [1,2]\n" +
            "Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].\n\n" +
            "### Constraints\n" +
            "- `2 <= numbers.length <= 3 * 10^4`\n" +
            "- `-1000 <= numbers[i] <= 1000`\n" +
            "- `numbers` is sorted in non-decreasing order.\n" +
            "- `-1000 <= target <= 1000`\n" +
            "- The tests are generated such that there is exactly one solution.");

        updateQInsight("3Sum",
            "### Description\n" +
            "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\n" +
            "Notice that the solution set must not contain duplicate triplets.\n\n" +
            "### Example 1\n" +
            "Input: nums = [-1,0,1,2,-1,-4]\n" +
            "Output: [[-1,-1,2],[-1,0,1]]\n" +
            "Explanation:\n" +
            "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\n" +
            "nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\n" +
            "nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\n" +
            "The distinct triplets are [-1,-1,2] and [-1,0,1].\n\n" +
            "### Constraints\n" +
            "- `3 <= nums.length <= 3000`\n" +
            "- `-10^5 <= nums[i] <= 10^5`");

        updateQInsight("Container With Most Water",
            "### Description\n" +
            "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\n" +
            "Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\n" +
            "Return *the maximum amount of water a container can store*.\n\n" +
            "Notice that you may not slant the container.\n\n" +
            "### Example 1\n" +
            "Input: height = [1,8,6,2,5,4,8,3,7]\n" +
            "Output: 49\n" +
            "Explanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.\n\n" +
            "### Constraints\n" +
            "- `n == height.length`\n" +
            "- `2 <= n <= 10^5`\n" +
            "- `0 <= height[i] <= 10^4`");

        updateQInsight("Trapping Rain Water",
            "### Description\n" +
            "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n" +
            "### Example 1\n" +
            "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\n" +
            "Output: 6\n" +
            "Explanation: The elevation map is represented by [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.\n\n" +
            "### Constraints\n" +
            "- `n == height.length`\n" +
            "- `1 <= n <= 2 * 10^4`\n" +
            "- `0 <= height[i] <= 10^5`");

        updateQInsight("Reverse Linked List",
            "### Description\n" +
            "Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.\n\n" +
            "### Example 1\n" +
            "Input: head = [1,2,3,4,5]\n" +
            "Output: [5,4,3,2,1]\n\n" +
            "### Constraints\n" +
            "- The number of nodes in the list is the range `[0, 5000]`.\n" +
            "- `-5000 <= Node.val <= 5000`");

        updateQInsight("LRU Cache",
            "### Description\n" +
            "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\n" +
            "Implement the `LRUCache` class:\n" +
            "- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n" +
            "- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n" +
            "- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\n\n" +
            "The functions `get` and `put` must each run in `O(1)` average time complexity.\n\n" +
            "### Example 1\n" +
            "Input: [\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n" +
            "[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\n" +
            "Output: [null, null, null, 1, null, -1, null, -1, 3, 4]\n" +
            "Explanation:\n" +
            "LRUCache lRUCache = new LRUCache(2);\n" +
            "lRUCache.put(1, 1); // cache is {1=1}\n" +
            "lRUCache.put(2, 2); // cache is {1=1, 2=2}\n" +
            "lRUCache.get(1);    // return 1\n" +
            "lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\n" +
            "lRUCache.get(2);    // returns -1 (not found)\n\n" +
            "### Constraints\n" +
            "- `1 <= capacity <= 3000`\n" +
            "- `0 <= key <= 10^4`\n" +
            "- `0 <= value <= 10^5`\n" +
            "- At most `2 * 10^5` calls will be made to `get` and `put`.");

        updateQInsight("Best Time to Buy and Sell Stock",
            "### Description\n" +
            "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\n" +
            "You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\n" +
            "Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.\n\n" +
            "### Example 1\n" +
            "Input: prices = [7,1,5,3,6,4]\n" +
            "Output: 5\n" +
            "Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\n" +
            "### Constraints\n" +
            "- `1 <= prices.length <= 10^5`\n" +
            "- `0 <= prices[i] <= 10^4`");

        updateQInsight("Longest Substring Without Repeating Characters",
            "### Description\n" +
            "Given a string `s`, find the length of the **longest substring** without repeating characters.\n\n" +
            "### Example 1\n" +
            "Input: s = \"abcabcbb\"\n" +
            "Output: 3\n" +
            "Explanation: The answer is \"abc\", with the length of 3.\n\n" +
            "### Constraints\n" +
            "- `0 <= s.length <= 5 * 10^4`\n" +
            "- `s` consists of English letters, digits, symbols and spaces.");

        updateQInsight("Minimum Window Substring",
            "### Description\n" +
            "Given two strings `s` and `t` of lengths `m` and `n` respectively, return *the minimum window substring* of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\n" +
            "The testcases will be generated such that the answer is **unique**.\n\n" +
            "### Example 1\n" +
            "Input: s = \"ADOBECODEBANC\", t = \"ABC\"\n" +
            "Output: \"BANC\"\n" +
            "Explanation: The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.\n\n" +
            "### Constraints\n" +
            "- `m == s.length`\n" +
            "- `n == t.length`\n" +
            "- `1 <= m, n <= 10^5`\n" +
            "- `s` and `t` consist of uppercase and lowercase English letters.");

        updateQInsight("Search in Rotated Sorted Array",
            "### Description\n" +
            "There is an integer array `nums` sorted in ascending order (with **distinct** values).\n\n" +
            "Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed).\n\n" +
            "Given the array `nums` after the possible rotation and an integer `target`, return *the index of target if it is in nums, or -1 if it is not in nums*.\n\n" +
            "You must write an algorithm with `O(log n)` runtime complexity.\n\n" +
            "### Example 1\n" +
            "Input: nums = [4,5,6,7,0,1,2], target = 0\n" +
            "Output: 4\n\n" +
            "### Constraints\n" +
            "- `1 <= nums.length <= 5000`\n" +
            "- `-10^4 <= nums[i] <= 10^4`\n" +
            "- All values of `nums` are unique.\n" +
            "- `-10^4 <= target <= 10^4`");

        updateQInsight("Koko Eating Bananas",
            "### Description\n" +
            "Koko loves to eat bananas. There are `n` piles of bananas, the `i-th` pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\n" +
            "Koko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\n" +
            "Return *the minimum integer k such that she can eat all the bananas within h hours*.\n\n" +
            "### Example 1\n" +
            "Input: piles = [3,6,7,11], h = 8\n" +
            "Output: 4\n\n" +
            "### Constraints\n" +
            "- `1 <= piles.length <= 10^4`\n" +
            "- `piles.length <= h <= 10^9`\n" +
            "- `1 <= piles[i] <= 10^9`");

        updateQInsight("Subarray Sum Equals K",
            "### Description\n" +
            "Given an array of integers `nums` and an integer `k`, return *the total number of subarrays whose sum equals to k*.\n\n" +
            "A subarray is a contiguous **non-empty** sequence of elements within an array.\n\n" +
            "### Example 1\n" +
            "Input: nums = [1,1,1], k = 2\n" +
            "Output: 2\n\n" +
            "### Constraints\n" +
            "- `1 <= nums.length <= 2 * 10^4`\n" +
            "- `-1000 <= nums[i] <= 1000`\n" +
            "- `-10^7 <= k <= 10^7`");

        updateQInsight("Kth Largest Element in an Array",
            "### Description\n" +
            "Given an integer array `nums` and an integer `k`, return *the k-th largest element in the array*.\n\n" +
            "Note that it is the `k-th` largest element in the sorted order, not the `k-th` distinct element.\n\n" +
            "Can you solve it without sorting in `O(n)` time complexity?\n\n" +
            "### Example 1\n" +
            "Input: nums = [3,2,1,5,6,4], k = 2\n" +
            "Output: 5\n\n" +
            "### Constraints\n" +
            "- `1 <= k <= nums.length <= 10^5`\n" +
            "- `-10^4 <= nums[i] <= 10^4`");

        updateQInsight("Find Median from Data Stream",
            "### Description\n" +
            "The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\n" +
            "Implement the `MedianFinder` class:\n" +
            "- `MedianFinder()` initializes the `MedianFinder` object.\n" +
            "- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n" +
            "- `double findMedian()` returns the median of all elements so far.\n\n" +
            "### Example 1\n" +
            "Input: [\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"]\n" +
            "[[], [1], [2], [], [3], []]\n" +
            "Output: [null, null, null, 1.5, null, 2.0]\n\n" +
            "### Constraints\n" +
            "- `-10^5 <= num <= 10^5`\n" +
            "- At most `5 * 10^4` calls will be made to `addNum` and `findMedian`.");

        updateQInsight("Number of Islands",
            "### Description\n" +
            "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.\n\n" +
            "An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n" +
            "### Example 1\n" +
            "Input: grid = [\n" +
            "  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n" +
            "  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n" +
            "  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n" +
            "  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n" +
            "]\n" +
            "Output: 1\n\n" +
            "### Constraints\n" +
            "- `m == grid.length`\n" +
            "- `n == grid[i].length`\n" +
            "- `1 <= m, n <= 300`\n" +
            "- `grid[i][j]` is '0' or '1'.");

        updateQInsight("Climbing Stairs",
            "### Description\n" +
            "You are climbing a staircase. It takes `n` steps to reach the top.\n\n" +
            "Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n" +
            "### Example 1\n" +
            "Input: n = 2\n" +
            "Output: 2\n\n" +
            "### Constraints\n" +
            "- `1 <= n <= 45`");
    }

    private void updateQInsight(String name, String richInsight) {
        List<Question> list = questionRepository.findAllByName(name);
        for (Question q : list) {
            q.setInsight(richInsight);
            questionRepository.save(q);
        }
    }
    private Pattern savePattern(String name,String slug,int order,int week,String phase,String sub,int total,int must) {
        return patternRepository.save(Pattern.builder().name(name).slug(slug).prepOrder(order).weekStart(week).phaseLabel(phase).subHeading(sub).totalQs(total).mustCount(must).build());
    }
    private void addQ(Pattern p,int ord,String name,String lc,String d,String imp,String co,String tags,String insight) {
        questionRepository.save(Question.builder().pattern(p).displayOrder(ord).name(name).lcUrl(lc).difficulty(Question.Difficulty.valueOf(d)).importance(Question.Importance.valueOf(imp)).companies(co).tags(tags).insight(insight).build());
    }
    private void seedAll() {
        Pattern p1=savePattern("Two Pointers","two-ptr",1,1,"Phase 1 · Weeks 1-4 · Core Patterns","Opposite and same-direction pointer techniques",16,11);
        addQ(p1,1,"Valid Palindrome","https://leetcode.com/problems/valid-palindrome/","E","must","Amazon,Microsoft,Meta","OA,intuition-builder","Foundation: same-direction pointer, character skip");
        addQ(p1,2,"Two Sum II - Input Array Sorted","https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/","M","must","Amazon,Bloomberg","pattern-defining,OA","Core opposite-pointer template on sorted array");
        addQ(p1,3,"3Sum","https://leetcode.com/problems/3sum/","M","must","Amazon,Microsoft,Adobe,Google","pattern-defining,interview-heavy","Fix one, two-pointer the rest - universal pattern");
        addQ(p1,4,"3Sum Closest","https://leetcode.com/problems/3sum-closest/","M","strong","Bloomberg,Adobe","variation","Same template, track closest delta");
        addQ(p1,5,"Container With Most Water","https://leetcode.com/problems/container-with-most-water/","M","must","Amazon,Microsoft,Google","pattern-defining,interview-heavy","Greedy argument for pointer movement - must internalize");
        addQ(p1,6,"Trapping Rain Water","https://leetcode.com/problems/trapping-rain-water/","H","must","Amazon,Google,Meta,Goldman Sachs","interview-heavy,thinking-ability","Two-pointer with running max - also solvable with mono stack");
        addQ(p1,7,"Move Zeroes","https://leetcode.com/problems/move-zeroes/","E","must","Flipkart,Amazon","OA,fast/slow pointer","In-place fast/slow pointer partition");
        addQ(p1,8,"Remove Duplicates from Sorted Array II","https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/","M","must","Amazon,Google","OA","Allow k duplicates - generalizes remove-dup pattern");
        addQ(p1,9,"Sort Colors (Dutch National Flag)","https://leetcode.com/problems/sort-colors/","M","must","Amazon,Microsoft,Adobe","OA,pattern-defining","Three-pointer partition - builds intuition for quickselect");
        addQ(p1,10,"Linked List Cycle II","https://leetcode.com/problems/linked-list-cycle-ii/","M","must","Amazon,Microsoft","fast/slow,interview-heavy","Floyd cycle detection - math proof is the insight");
        addQ(p1,11,"Find the Duplicate Number","https://leetcode.com/problems/find-the-duplicate-number/","M","must","Amazon,Google,Meta","thinking-ability","Array as linked list - Floyd cycle - elegant and surprising");
        addQ(p1,12,"Minimum Size Subarray Sum","https://leetcode.com/problems/minimum-size-subarray-sum/","M","must","Amazon,LinkedIn","OA,bridges-to-sliding-window","Transition question: two pointers to sliding window");
        addQ(p1,13,"Boats to Save People","https://leetcode.com/problems/boats-to-save-people/","M","strong","Amazon,Uber","greedy+two-ptr","Sort + greedy two-pointer - common OA pattern");
        addQ(p1,14,"Palindrome Linked List","https://leetcode.com/problems/palindrome-linked-list/","E","strong","Amazon,Adobe","OA","Find middle + reverse second half");
        addQ(p1,15,"Squares of a Sorted Array","https://leetcode.com/problems/squares-of-a-sorted-array/","E","strong","Google,Amazon","OA","Two pointers from ends, fill result from back");
        addQ(p1,16,"4Sum","https://leetcode.com/problems/4sum/","M","optional","Adobe","variation","Generalize 3Sum - shows recursion of the pattern");
        Pattern p2=savePattern("Linked List","linkedlist",2,1,"Phase 1 · Weeks 1-4 · Core Patterns","Pointer re-wiring, fast/slow, reversal",11,8);
        addQ(p2,1,"Reverse Linked List","https://leetcode.com/problems/reverse-linked-list/","E","must","Amazon,Microsoft,Meta,Google","pattern-defining,OA,intuition-builder","Iterative with prev/curr/next - must be muscle memory");
        addQ(p2,2,"Merge Two Sorted Lists","https://leetcode.com/problems/merge-two-sorted-lists/","E","must","Amazon,Microsoft,Google,Adobe","pattern-defining,OA","Dummy head + advance smaller pointer - foundation for merge K");
        addQ(p2,3,"Middle of the Linked List","https://leetcode.com/problems/middle-of-the-linked-list/","E","must","Amazon,Microsoft,Flipkart","OA,fast/slow","Fast/slow pointer - slow at middle when fast reaches end");
        addQ(p2,4,"Reorder List","https://leetcode.com/problems/reorder-list/","M","must","Amazon,Microsoft","interview-heavy","Find middle + reverse second half + merge alternating");
        addQ(p2,5,"Remove Nth Node From End","https://leetcode.com/problems/remove-nth-node-from-end-of-list/","M","must","Amazon,Microsoft,Adobe","OA,two-pass vs one-pass","Two pointers n apart - delete in one pass");
        addQ(p2,6,"Merge K Sorted Lists","https://leetcode.com/problems/merge-k-sorted-lists/","H","must","Amazon,Microsoft,Google,Meta","interview-heavy,thinking-ability","Min-heap of (val,list_idx) - use merge two lists iteratively");
        addQ(p2,7,"LRU Cache","https://leetcode.com/problems/lru-cache/","M","must","Amazon,Google,Microsoft,Meta,Uber","interview-heavy,design","Doubly linked list + hashmap - O(1) get and put");
        addQ(p2,8,"Copy List with Random Pointer","https://leetcode.com/problems/copy-list-with-random-pointer/","M","must","Amazon,Microsoft,Meta","interview-heavy","Hashmap old-to-new node, or weave approach");
        addQ(p2,9,"Add Two Numbers","https://leetcode.com/problems/add-two-numbers/","M","strong","Amazon,Microsoft,Google","OA","Carry-aware digit addition on list - handle length mismatch");
        addQ(p2,10,"Swap Nodes in Pairs","https://leetcode.com/problems/swap-nodes-in-pairs/","M","strong","Amazon,Microsoft","OA","Pointer re-wiring - use dummy head");
        addQ(p2,11,"Reverse Nodes in k-Group","https://leetcode.com/problems/reverse-nodes-in-k-group/","H","strong","Amazon,Microsoft,Google","interview-heavy","Reverse in chunks - check remaining length >= k first");
            Pattern p3=savePattern("Sliding Window","sliding-win",3,2,"Phase 1 Weeks 1-4 Core Patterns","Variable and fixed window with hashmap",13,10);
        addQ(p3,1,"Best Time to Buy and Sell Stock","https://leetcode.com/problems/best-time-to-buy-and-sell-stock/","E","must","Amazon,Google,Meta,Microsoft","OA,pattern-defining","Simplest sliding window - track running min");
        addQ(p3,2,"Longest Substring Without Repeating Characters","https://leetcode.com/problems/longest-substring-without-repeating-characters/","M","must","Amazon,Microsoft,Adobe,Uber","pattern-defining,OA,interview-heavy","Variable window + hashmap - the canonical sliding window");
        addQ(p3,3,"Longest Repeating Character Replacement","https://leetcode.com/problems/longest-repeating-character-replacement/","M","must","Google,Amazon","pattern-defining,thinking-ability","(r-l+1) - maxFreq > k shrink. Key insight question.");
        addQ(p3,4,"Permutation in String","https://leetcode.com/problems/permutation-in-string/","M","must","Amazon,Microsoft","OA,fixed-window","Fixed window anagram check - character frequency match");
        addQ(p3,5,"Minimum Window Substring","https://leetcode.com/problems/minimum-window-substring/","H","must","Amazon,Google,Meta,Uber","pattern-defining,interview-heavy,thinking-ability","Most complete sliding window - need + have counters");
        addQ(p3,6,"Sliding Window Maximum","https://leetcode.com/problems/sliding-window-maximum/","H","must","Amazon,Google,Goldman Sachs","interview-heavy,mono-queue","Deque as monotonic queue - bridges sliding window + mono stack");
        addQ(p3,7,"Max Consecutive Ones III","https://leetcode.com/problems/max-consecutive-ones-iii/","M","must","Amazon,Flipkart","OA,pattern-defining","At most k zeros in window - very common OA template");
        addQ(p3,8,"Fruit Into Baskets","https://leetcode.com/problems/fruit-into-baskets/","M","must","Amazon,Google","OA","At most 2 distinct - standard variable window + hashmap");
        addQ(p3,9,"Find All Anagrams in a String","https://leetcode.com/problems/find-all-anagrams-in-a-string/","M","must","Amazon,Microsoft,Spotify","OA,fixed-window","Fixed window, character freq match - anagram pattern");
        addQ(p3,10,"Longest Subarray of 1s After Deleting One Element","https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/","M","must","Amazon,Google","OA","Allow k=1 zeros - generalizes binary array window");
        addQ(p3,11,"Subarrays with K Different Integers","https://leetcode.com/problems/subarrays-with-k-different-integers/","H","strong","Google","thinking-ability","atMost(k) - atMost(k-1) - elegant trick for exact count");
        addQ(p3,12,"Substrings of Size Three with Distinct Characters","https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/","E","strong","Google","OA,fixed-window","Fixed window with set - builds fixed window intuition");
        addQ(p3,13,"Longest Nice Subarray","https://leetcode.com/problems/longest-nice-subarray/","M","optional","Amazon","bit-mask-window","Sliding window with bitmask constraint - uncommon");
        Pattern p4=savePattern("Binary Search on Answer","bsearch",4,2,"Phase 1 Weeks 1-4 Core Patterns","Binary search on monotone feasibility function",17,13);
        addQ(p4,1,"Binary Search","https://leetcode.com/problems/binary-search/","E","must","All","OA,pattern-defining","Template foundation - lo/hi/mid, while lo<=hi");
        addQ(p4,2,"Find Minimum in Rotated Sorted Array","https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/","M","must","Amazon,Microsoft,Google,Meta","pattern-defining,interview-heavy","Binary search on rotated array - pivot detection");
        addQ(p4,3,"Search in Rotated Sorted Array","https://leetcode.com/problems/search-in-rotated-sorted-array/","M","must","Amazon,Microsoft,LinkedIn,Adobe","interview-heavy,OA","Which half is sorted? - key decision tree");
        addQ(p4,4,"Search a 2D Matrix","https://leetcode.com/problems/search-a-2d-matrix/","M","must","Amazon,Microsoft","OA","Treat matrix as flat sorted array - index mapping trick");
        addQ(p4,5,"Koko Eating Bananas","https://leetcode.com/problems/koko-eating-bananas/","M","must","Amazon,Google","pattern-defining,thinking-ability","Binary search on answer space - feasibility check");
        addQ(p4,6,"Capacity to Ship Packages Within D Days","https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/","M","must","Amazon,Flipkart","OA,pattern-defining","Same template as Koko - builds answer-space BS intuition");
        addQ(p4,7,"Minimum Number of Days to Make m Bouquets","https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/","M","must","Amazon","OA","Binary search on days, feasibility greedy");
        addQ(p4,8,"Find Peak Element","https://leetcode.com/problems/find-peak-element/","M","must","Google,Amazon,Microsoft","interview-heavy","Binary search on non-sorted array - intuition stretch");
        addQ(p4,9,"Kth Smallest Element in Sorted Matrix","https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/","M","must","Google,Amazon,DE Shaw","interview-heavy,thinking-ability","BS on value range + count feasibility");
        addQ(p4,10,"Aggressive Cows (GFG)","https://practice.geeksforgeeks.org/problems/aggressive-cows/","M","must","Amazon,Flipkart,Cred","pattern-defining,OA","Classic maximize minimum distance - canonical template");
        addQ(p4,11,"Allocate Minimum Pages / Painters Partition","https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/","M","must","Flipkart,Amazon,DE Shaw","OA,interview-heavy","Minimize maximum - another canonical BS-on-answer");
        addQ(p4,12,"Split Array Largest Sum","https://leetcode.com/problems/split-array-largest-sum/","H","must","Google,Amazon,Cred","interview-heavy,thinking-ability","Same as Allocate Pages - notice the isomorphism");
        addQ(p4,13,"Median of Two Sorted Arrays","https://leetcode.com/problems/median-of-two-sorted-arrays/","H","must","Amazon,Google,Meta","interview-heavy,thinking-ability","Binary search on partition - one of hardest BS questions");
        addQ(p4,14,"First Bad Version","https://leetcode.com/problems/first-bad-version/","E","strong","Amazon,Snapchat","OA","BS template - leftmost valid");
        addQ(p4,15,"Find K Closest Elements","https://leetcode.com/problems/find-k-closest-elements/","M","strong","Google,LinkedIn","variation","BS to find start of window");
        addQ(p4,16,"Sqrt(x)","https://leetcode.com/problems/sqrtx/","E","strong","Amazon,Google","OA","Binary search on answer space - simple version");
        addQ(p4,17,"Minimize Max Distance to Gas Station","https://leetcode.com/problems/minimize-max-distance-to-gas-station/","H","optional","Google","elite,thinking-ability","Fractional BS - extend to floating point lo/hi");
            Pattern p5=savePattern("Prefix Sum","prefix-sum",5,3,"Phase 1 Weeks 1-4 Core Patterns","Prefix sum + hashmap for subarray queries",13,10);
        addQ(p5,1,"Running Sum of 1d Array","https://leetcode.com/problems/running-sum-of-1d-array/","E","must","Amazon","OA,intuition-builder","Prefix array construction - absolute foundation");
        addQ(p5,2,"Product of Array Except Self","https://leetcode.com/problems/product-of-array-except-self/","M","must","Amazon,Google,Meta,Microsoft","pattern-defining,interview-heavy","Prefix product + suffix product - no division trick");
        addQ(p5,3,"Subarray Sum Equals K","https://leetcode.com/problems/subarray-sum-equals-k/","M","must","Amazon,Microsoft,Uber,Facebook","pattern-defining,interview-heavy,OA","Prefix sum + hashmap: if prefix[i]-k exists subarray found");
        addQ(p5,4,"Range Sum Query Immutable","https://leetcode.com/problems/range-sum-query-immutable/","E","must","Amazon","OA","Classic prefix array query - range sum in O(1)");
        addQ(p5,5,"Range Sum Query 2D Immutable","https://leetcode.com/problems/range-sum-query-2d-immutable/","M","must","Amazon,Google","interview-heavy","2D prefix sum - inclusion-exclusion formula");
        addQ(p5,6,"Continuous Subarray Sum","https://leetcode.com/problems/continuous-subarray-sum/","M","must","Amazon,Google","interview-heavy,OA","Prefix sum modulo - prefix[i]%k in hashmap");
        addQ(p5,7,"Subarray Sums Divisible by K","https://leetcode.com/problems/subarray-sums-divisible-by-k/","M","must","Amazon,Google","OA","Mod prefix sum - count pairs with same mod");
        addQ(p5,8,"Find Pivot Index","https://leetcode.com/problems/find-pivot-index/","E","must","Amazon","OA","Left sum = total - left sum - arr[i]");
        addQ(p5,9,"Maximum Size Subarray Sum Equals k","https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/","M","must","Amazon,Facebook","OA,interview-heavy","Prefix + hashmap, store earliest index");
        addQ(p5,10,"Contiguous Array","https://leetcode.com/problems/contiguous-array/","M","must","Facebook,Amazon","interview-heavy","Replace 0 with -1, find subarray sum = 0 via prefix");
        addQ(p5,11,"Count Number of Nice Subarrays","https://leetcode.com/problems/count-number-of-nice-subarrays/","M","strong","Amazon,Google","OA","Map odd counts - same as subarray sum equals k");
        addQ(p5,12,"Number of Ways to Split Array","https://leetcode.com/problems/number-of-ways-to-split-array/","M","strong","Amazon","OA","Prefix total for fast left/right sum");
        addQ(p5,13,"Longest Well-Performing Interval","https://leetcode.com/problems/longest-well-performing-interval/","M","optional","Google","thinking-ability","Prefix sum + mono stack hybrid - elite insight question");
        Pattern p6=savePattern("Heap / Priority Queue","heap",6,3,"Phase 1 Weeks 1-4 Core Patterns","Min/max heap for top-K and streaming median",13,8);
        addQ(p6,1,"Kth Largest Element in an Array","https://leetcode.com/problems/kth-largest-element-in-an-array/","M","must","Amazon,Microsoft,Facebook,Google","pattern-defining,interview-heavy,OA","Min-heap of size k - O(n log k) vs QuickSelect O(n) avg");
        addQ(p6,2,"Top K Frequent Elements","https://leetcode.com/problems/top-k-frequent-elements/","M","must","Amazon,Microsoft,Uber,Facebook","pattern-defining,interview-heavy,OA","Count + min-heap of size k - canonical top-K");
        addQ(p6,3,"K Closest Points to Origin","https://leetcode.com/problems/k-closest-points-to-origin/","M","must","Amazon,Google,Facebook,Uber","OA,interview-heavy","Max-heap of size k, negate dist for Python");
        addQ(p6,4,"Merge K Sorted Lists","https://leetcode.com/problems/merge-k-sorted-lists/","H","must","Amazon,Microsoft,Google,Meta","pattern-defining,interview-heavy,thinking-ability","Min-heap of (val,list_idx) - sentinel values matter");
        addQ(p6,5,"Find Median from Data Stream","https://leetcode.com/problems/find-median-from-data-stream/","H","must","Amazon,Google,Microsoft,Goldman Sachs","pattern-defining,interview-heavy,thinking-ability","Two heaps: max-heap(left) + min-heap(right). Balance on insert.");
        addQ(p6,6,"Task Scheduler","https://leetcode.com/problems/task-scheduler/","M","must","Amazon,Microsoft,Uber","interview-heavy,greedy+heap","Greedy with max-heap - most frequent task drives idle time");
        addQ(p6,7,"Reorganize String","https://leetcode.com/problems/reorganize-string/","M","must","Amazon,Google","interview-heavy,greedy+heap","Place most frequent char, interleave using heap");
        addQ(p6,8,"Kth Smallest Element in Sorted Matrix","https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/","M","must","Google,Amazon,DE Shaw","interview-heavy","Min-heap traverse sorted matrix - or BS on value");
        addQ(p6,9,"Top K Frequent Words","https://leetcode.com/problems/top-k-frequent-words/","M","strong","Amazon,Microsoft","OA","Custom comparator in heap - lexicographic tiebreak");
        addQ(p6,10,"Furthest Building You Can Reach","https://leetcode.com/problems/furthest-building-you-can-reach/","M","strong","Amazon","greedy+heap","Min-heap to track when to swap ladder for bricks");
        addQ(p6,11,"Last Stone Weight","https://leetcode.com/problems/last-stone-weight/","E","strong","Amazon","OA","Max-heap simulation - good warm-up");
        addQ(p6,12,"Smallest Range Covering K Lists","https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/","H","optional","Google","thinking-ability","Heap + sliding max - hardest heap question");
        addQ(p6,13,"IPO","https://leetcode.com/problems/ipo/","H","optional","Google","thinking-ability,greedy+heap","Two heaps: locked/available projects - elite greedy+heap");
        Pattern p7=savePattern("Greedy","greedy",7,4,"Phase 1 Weeks 1-4 Core Patterns","Local optimal choice with global correctness proof",13,10);
        addQ(p7,1,"Jump Game","https://leetcode.com/problems/jump-game/","M","must","Amazon,Microsoft,Google","pattern-defining,interview-heavy,OA","Track max reachable index - classic greedy feasibility");
        addQ(p7,2,"Jump Game II","https://leetcode.com/problems/jump-game-ii/","M","must","Amazon,Google","interview-heavy,thinking-ability","Track current and next boundary - BFS-like greedy");
        addQ(p7,3,"Gas Station","https://leetcode.com/problems/gas-station/","M","must","Amazon,Uber,Goldman Sachs","pattern-defining,interview-heavy","If total >= 0 solution exists; greedy tracks candidate start");
        addQ(p7,4,"Non-overlapping Intervals","https://leetcode.com/problems/non-overlapping-intervals/","M","must","Amazon,Google","pattern-defining,interview-heavy","Sort by end time - keep earliest ending interval");
        addQ(p7,5,"Minimum Number of Arrows to Burst Balloons","https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/","M","must","Amazon,Google","interview-heavy,OA","Same as non-overlapping intervals - sort by end");
        addQ(p7,6,"Candy","https://leetcode.com/problems/candy/","H","must","Amazon,Google","interview-heavy,thinking-ability","Two-pass greedy: left to right then right to left");
        addQ(p7,7,"Partition Labels","https://leetcode.com/problems/partition-labels/","M","must","Amazon,Google,Microsoft","pattern-defining,interview-heavy","Last occurrence of each char - greedy partition");
        addQ(p7,8,"Hand of Straights","https://leetcode.com/problems/hand-of-straights/","M","must","Google,Amazon","OA,greedy+sorted-map","Sorted order greedy with freq map");
        addQ(p7,9,"Boats to Save People","https://leetcode.com/problems/boats-to-save-people/","M","must","Amazon,Uber","OA","Sort + two pointer greedy");
        addQ(p7,10,"Minimum Platforms (GFG)","https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/","M","must","Flipkart,Amazon,Microsoft","OA,interview-heavy","Sort arrivals/departures separately - two pointer merge");
        addQ(p7,11,"Queue Reconstruction by Height","https://leetcode.com/problems/queue-reconstruction-by-height/","M","strong","Google,Amazon","thinking-ability","Sort tall-first, insert by k-index - counterintuitive greedy");
        addQ(p7,12,"Minimum Cost to Connect Sticks","https://leetcode.com/problems/minimum-cost-to-connect-sticks/","M","strong","Amazon","greedy+heap","Huffman coding - min-heap merge greedy");
        addQ(p7,13,"Maximum Profit in Job Scheduling","https://leetcode.com/problems/maximum-profit-in-job-scheduling/","H","strong","Amazon,Google","thinking-ability,greedy+BS+DP","Interval DP + binary search for non-overlapping jobs");
            Pattern p8=savePattern("Intervals","intervals",8,4,"Phase 1 Weeks 1-4 Core Patterns","Sort by start/end, merge and sweep",8,5);
        addQ(p8,1,"Merge Intervals","https://leetcode.com/problems/merge-intervals/","M","must","Amazon,Google,Microsoft,Facebook","pattern-defining,interview-heavy,OA","Sort by start, merge when overlap - foundation pattern");
        addQ(p8,2,"Insert Interval","https://leetcode.com/problems/insert-interval/","M","must","Amazon,Google,Facebook,LinkedIn","interview-heavy","3-pass: before, merge, after - handle overlap boundary cleanly");
        addQ(p8,3,"Non-overlapping Intervals","https://leetcode.com/problems/non-overlapping-intervals/","M","must","Amazon,Google","interview-heavy","Sort by end - greedy erase: min intervals to remove");
        addQ(p8,4,"Meeting Rooms","https://leetcode.com/problems/meeting-rooms/","E","must","Amazon,Facebook,Airbnb","OA","Sort, check no overlap - simplest interval check");
        addQ(p8,5,"Meeting Rooms II","https://leetcode.com/problems/meeting-rooms-ii/","M","must","Amazon,Google,Facebook,Airbnb","pattern-defining,interview-heavy","Min-heap of end times - number of simultaneous meetings");
        addQ(p8,6,"Interval List Intersections","https://leetcode.com/problems/interval-list-intersections/","M","strong","Facebook,Amazon","OA","Two-pointer on sorted interval lists - max(l1,l2) min(r1,r2)");
        addQ(p8,7,"Employee Free Time","https://leetcode.com/problems/employee-free-time/","H","strong","Airbnb,Google,Uber","thinking-ability","Merge all intervals, find gaps - heap or sort");
        addQ(p8,8,"Minimum Interval to Include Each Query","https://leetcode.com/problems/minimum-interval-to-include-each-query/","H","optional","Google","elite,thinking-ability","Sort queries + intervals, heap for active intervals");
        Pattern p9=savePattern("Stacks","stacks",9,5,"Phase 2 Weeks 5-8 Data Structures","LIFO matching, expression evaluation",6,4);
        addQ(p9,1,"Valid Parentheses","https://leetcode.com/problems/valid-parentheses/","E","must","Amazon,Microsoft,Google,Meta","OA,pattern-defining,intuition-builder","Stack LIFO for matching brackets - foundation stack question");
        addQ(p9,2,"Min Stack","https://leetcode.com/problems/min-stack/","M","must","Amazon,Microsoft,Google","OA,design","Track running min with aux stack - O(1) getMin");
        addQ(p9,3,"Evaluate Reverse Polish Notation","https://leetcode.com/problems/evaluate-reverse-polish-notation/","M","must","Amazon,LinkedIn","OA","Operand push, operator pop-two-push-result pattern");
        addQ(p9,4,"Decode String","https://leetcode.com/problems/decode-string/","M","must","Amazon,Google,Microsoft","OA,interview-heavy","Two stacks (count + string) for nested brackets");
        addQ(p9,5,"Basic Calculator II","https://leetcode.com/problems/basic-calculator-ii/","M","strong","Amazon,Google,Airbnb","OA,interview-heavy","Handle * and / with stack - +/- push, *// modify top");
        addQ(p9,6,"Asteroid Collision","https://leetcode.com/problems/asteroid-collision/","M","strong","Amazon,Google","OA","Stack collision simulation - direction + magnitude");
        Pattern p10=savePattern("Monotonic Stack","mono-stack",10,5,"Phase 2 Weeks 5-8 Data Structures","Next greater/smaller in O(n) via decreasing stack",11,7);
        addQ(p10,1,"Daily Temperatures","https://leetcode.com/problems/daily-temperatures/","M","must","Amazon,Microsoft,Google","pattern-defining,OA,interview-heavy","Decreasing stack - pop when hotter day found");
        addQ(p10,2,"Next Greater Element I","https://leetcode.com/problems/next-greater-element-i/","E","must","Amazon,Google","OA,intuition-builder","Simplest mono stack - next greater to the right");
        addQ(p10,3,"Next Greater Element II","https://leetcode.com/problems/next-greater-element-ii/","M","must","Amazon,Google","OA","Circular array - iterate 2n, index mod n");
        addQ(p10,4,"Largest Rectangle in Histogram","https://leetcode.com/problems/largest-rectangle-in-histogram/","H","must","Amazon,Google,Microsoft,Goldman Sachs","pattern-defining,interview-heavy,thinking-ability","Maintain increasing stack, pop = compute rect with height[top]");
        addQ(p10,5,"Trapping Rain Water (Mono Stack)","https://leetcode.com/problems/trapping-rain-water/","H","must","Amazon,Google,Meta","interview-heavy,thinking-ability","Three approaches: DP, two-ptr, mono-stack - know all three");
        addQ(p10,6,"Car Fleet","https://leetcode.com/problems/car-fleet/","M","must","Amazon,Google","interview-heavy,OA","Sort by position desc, stack of arrival times");
        addQ(p10,7,"Sum of Subarray Minimums","https://leetcode.com/problems/sum-of-subarray-minimums/","M","must","Amazon,Google,DE Shaw","interview-heavy,thinking-ability","Previous smaller + next smaller via two mono stacks - count contribution");
        addQ(p10,8,"Remove K Digits","https://leetcode.com/problems/remove-k-digits/","M","strong","Amazon,Google","interview-heavy","Greedy with increasing mono stack - remove larger digits first");
        addQ(p10,9,"132 Pattern","https://leetcode.com/problems/132-pattern/","M","strong","Google,Amazon","thinking-ability","Decreasing stack from right, track second largest (k)");
        addQ(p10,10,"Maximal Rectangle","https://leetcode.com/problems/maximal-rectangle/","H","strong","Amazon,Google,Microsoft","thinking-ability","Largest rect in histogram per row - 2D extension");
        addQ(p10,11,"Online Stock Span","https://leetcode.com/problems/online-stock-span/","M","strong","Amazon,Bloomberg","OA,streaming","Stack of (price,span) - accumulate spans on pop");
            Pattern p11=savePattern("Tree DFS / BFS","trees",11,6,"Phase 2 Weeks 5-8 Data Structures","Return-value pattern, level order, BST properties",22,17);
        addQ(p11,1,"Maximum Depth of Binary Tree","https://leetcode.com/problems/maximum-depth-of-binary-tree/","E","must","Amazon,Microsoft,Google","OA,intuition-builder","DFS return value - foundation recursive tree pattern");
        addQ(p11,2,"Invert Binary Tree","https://leetcode.com/problems/invert-binary-tree/","E","must","Amazon,Microsoft,Google,Meta","OA,interview-heavy","Swap children, recurse - pure recursive clarity");
        addQ(p11,3,"Diameter of Binary Tree","https://leetcode.com/problems/diameter-of-binary-tree/","E","must","Amazon,Facebook,Google","interview-heavy,OA","Max(left+right) at each node - answer != always through root");
        addQ(p11,4,"Balanced Binary Tree","https://leetcode.com/problems/balanced-binary-tree/","E","must","Amazon,Microsoft","OA","Return height or -1 for unbalanced - single pass");
        addQ(p11,5,"Same Tree","https://leetcode.com/problems/same-tree/","E","must","Amazon","OA","Structural + value equality - recursive base cases");
        addQ(p11,6,"Subtree of Another Tree","https://leetcode.com/problems/subtree-of-another-tree/","E","must","Amazon,Microsoft","OA","isSameTree at every node - O(n*m)");
        addQ(p11,7,"Lowest Common Ancestor of BST","https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/","M","must","Amazon,Microsoft,Meta","interview-heavy,OA","BST property: both > root go right; both < go left");
        addQ(p11,8,"Lowest Common Ancestor of Binary Tree","https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/","M","must","Amazon,Google,Meta","interview-heavy,thinking-ability","Return node if found, propagate up - key recursion insight");
        addQ(p11,9,"Binary Tree Level Order Traversal","https://leetcode.com/problems/binary-tree-level-order-traversal/","M","must","Amazon,Microsoft,Google","OA,pattern-defining","BFS with level separation - queue size trick");
        addQ(p11,10,"Binary Tree Right Side View","https://leetcode.com/problems/binary-tree-right-side-view/","M","must","Amazon,Facebook,Uber","interview-heavy,OA","BFS level order, take last node - or DFS with depth");
        addQ(p11,11,"Count Good Nodes in Binary Tree","https://leetcode.com/problems/count-good-nodes-in-binary-tree/","M","must","Amazon,Microsoft","OA","Pass max-so-far down - DFS with extra parameter");
        addQ(p11,12,"Validate Binary Search Tree","https://leetcode.com/problems/validate-binary-search-tree/","M","must","Amazon,Microsoft,Google,Meta","pattern-defining,interview-heavy","Pass min/max bounds - not just check parent");
        addQ(p11,13,"Kth Smallest Element in BST","https://leetcode.com/problems/kth-smallest-element-in-a-bst/","M","must","Amazon,Microsoft,Bloomberg","interview-heavy","Inorder traversal = sorted order - count k");
        addQ(p11,14,"Construct Tree from Preorder and Inorder","https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/","M","must","Amazon,Google,Microsoft","interview-heavy,thinking-ability","Preorder[0] = root, find in inorder to split subtrees");
        addQ(p11,15,"Binary Tree Maximum Path Sum","https://leetcode.com/problems/binary-tree-maximum-path-sum/","H","must","Amazon,Google,Meta,Microsoft","interview-heavy,thinking-ability","Return max single branch, update global with both branches");
        addQ(p11,16,"Serialize and Deserialize Binary Tree","https://leetcode.com/problems/serialize-and-deserialize-binary-tree/","H","must","Amazon,Google,Meta,Uber","interview-heavy,thinking-ability","BFS/DFS serialization - null markers are key");
        addQ(p11,17,"Path Sum II","https://leetcode.com/problems/path-sum-ii/","M","must","Amazon,Microsoft","OA","DFS + backtracking on tree - collect all root-to-leaf paths");
        addQ(p11,18,"Flatten Binary Tree to Linked List","https://leetcode.com/problems/flatten-binary-tree-to-linked-list/","M","strong","Amazon,Microsoft","interview-heavy","Right-heavy preorder - Morris traversal optional");
        addQ(p11,19,"Binary Tree Cameras","https://leetcode.com/problems/binary-tree-cameras/","H","optional","Google","thinking-ability,greedy-on-tree","Greedy DFS 3-state - place camera at parent of leaf");
        addQ(p11,20,"Binary Search Tree Iterator","https://leetcode.com/problems/binary-search-tree-iterator/","M","must","Amazon,Microsoft,Google","interview-heavy","Controlled inorder with stack - O(1) avg next()");
        addQ(p11,21,"Populating Next Right Pointers","https://leetcode.com/problems/populating-next-right-pointers-in-each-node/","M","must","Amazon,Microsoft","OA","Level-order link using next pointers");
        addQ(p11,22,"Vertical Order Traversal","https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/","H","strong","Amazon,Google","interview-heavy","BFS with (col,row) coordinates, sort per col");
            Pattern p12=savePattern("Graph BFS / DFS","graphs",12,7,"Phase 2 Weeks 5-8 Data Structures","Matrix DFS, multi-source BFS, topological sort",17,13);
        addQ(p12,1,"Number of Islands","https://leetcode.com/problems/number-of-islands/","M","must","Amazon,Microsoft,Google,Meta,Adobe","pattern-defining,interview-heavy,OA","Matrix DFS/BFS - most asked graph question globally");
        addQ(p12,2,"Clone Graph","https://leetcode.com/problems/clone-graph/","M","must","Amazon,Microsoft,Meta","interview-heavy","DFS + hashmap for visited nodes - pointer aliasing insight");
        addQ(p12,3,"Flood Fill","https://leetcode.com/problems/flood-fill/","E","must","Amazon,Microsoft","OA","BFS on matrix - foundation for island variants");
        addQ(p12,4,"Rotting Oranges","https://leetcode.com/problems/rotting-oranges/","M","must","Amazon,Microsoft,Flipkart","pattern-defining,OA,interview-heavy","Multi-source BFS - all rotten oranges start simultaneously");
        addQ(p12,5,"Pacific Atlantic Water Flow","https://leetcode.com/problems/pacific-atlantic-water-flow/","M","must","Google,Amazon","interview-heavy,thinking-ability","Reverse flow from borders - reverse thinking key");
        addQ(p12,6,"Surrounded Regions","https://leetcode.com/problems/surrounded-regions/","M","must","Amazon,Google","interview-heavy","BFS from borders - mark safe cells first");
        addQ(p12,7,"Word Ladder","https://leetcode.com/problems/word-ladder/","H","must","Amazon,Google,Microsoft,Uber","pattern-defining,interview-heavy,thinking-ability","BFS on implicit graph - each word is a node, 1-char diff = edge");
        addQ(p12,8,"Course Schedule","https://leetcode.com/problems/course-schedule/","M","must","Amazon,Microsoft,Google,Uber","pattern-defining,interview-heavy","Cycle detection in directed graph - DFS 3-color or Kahns BFS");
        addQ(p12,9,"Course Schedule II","https://leetcode.com/problems/course-schedule-ii/","M","must","Amazon,Microsoft,Google","interview-heavy","Topological sort - return order if no cycle");
        addQ(p12,10,"Graph Valid Tree","https://leetcode.com/problems/graph-valid-tree/","M","must","LinkedIn,Google","interview-heavy","n-1 edges + connected + no cycle = tree");
        addQ(p12,11,"Number of Connected Components","https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/","M","must","LinkedIn,Amazon","OA","DFS/BFS/DSU all work - compare approaches");
        addQ(p12,12,"Max Area of Island","https://leetcode.com/problems/max-area-of-island/","M","must","Amazon,Google","OA","DFS that returns area - accumulate in recursion");
        addQ(p12,13,"Walls and Gates","https://leetcode.com/problems/walls-and-gates/","M","must","Facebook,Amazon","OA,multi-source-BFS","Multi-source BFS from all gates simultaneously");
        addQ(p12,14,"Alien Dictionary","https://leetcode.com/problems/alien-dictionary/","H","must","Google,Amazon,Meta,Airbnb","interview-heavy,thinking-ability","Build graph from word pairs - topological sort with cycle check");
        addQ(p12,15,"Find Eventual Safe States","https://leetcode.com/problems/find-eventual-safe-states/","M","strong","Google,Amazon","interview-heavy","Reverse graph + BFS from terminal nodes");
        addQ(p12,16,"Open the Lock","https://leetcode.com/problems/open-the-lock/","M","strong","Amazon,Google","BFS-implicit-graph","BFS on state space - 4-digit lock states as nodes");
        addQ(p12,17,"Making a Large Island","https://leetcode.com/problems/making-a-large-island/","H","optional","Google","thinking-ability","Label islands by ID, try flipping each 0 - island size lookup");
        Pattern p13=savePattern("Backtracking","backtracking",13,8,"Phase 2 Weeks 5-8 Data Structures","Choose/skip template, pruning, permutations",13,10);
        addQ(p13,1,"Subsets","https://leetcode.com/problems/subsets/","M","must","Amazon,Microsoft,Google","pattern-defining,OA","Choose/skip at each element - foundation template");
        addQ(p13,2,"Subsets II","https://leetcode.com/problems/subsets-ii/","M","must","Amazon,Google","OA","Sort + skip duplicates - universal dup-handling trick");
        addQ(p13,3,"Permutations","https://leetcode.com/problems/permutations/","M","must","Amazon,Microsoft,Adobe","pattern-defining,OA,interview-heavy","Swap or used[] array - full permutation DFS");
        addQ(p13,4,"Permutations II","https://leetcode.com/problems/permutations-ii/","M","must","Amazon,Microsoft","OA","Skip duplicate perms - sort + used[] with dup check");
        addQ(p13,5,"Combination Sum","https://leetcode.com/problems/combination-sum/","M","must","Amazon,Google,Meta","pattern-defining,interview-heavy,OA","Reuse same element - start index stays fixed");
        addQ(p13,6,"Combination Sum II","https://leetcode.com/problems/combination-sum-ii/","M","must","Amazon,Microsoft","OA","Each element used once - skip i>start && arr[i]==arr[i-1]");
        addQ(p13,7,"Letter Combinations of Phone Number","https://leetcode.com/problems/letter-combinations-of-a-phone-number/","M","must","Amazon,Microsoft,Google","OA,interview-heavy","Multi-digit expansion - backtracking on digit mapping");
        addQ(p13,8,"Word Search","https://leetcode.com/problems/word-search/","M","must","Amazon,Microsoft,Google,Meta","pattern-defining,interview-heavy","DFS+backtrack on grid - visited marking and unmark");
        addQ(p13,9,"Palindrome Partitioning","https://leetcode.com/problems/palindrome-partitioning/","M","must","Amazon,Google","interview-heavy,thinking-ability","Backtrack + palindrome check - combine with DP for O(n^2)");
        addQ(p13,10,"N-Queens","https://leetcode.com/problems/n-queens/","H","must","Amazon,Google,Microsoft","pattern-defining,interview-heavy,thinking-ability","Row/col/diag attacked sets - pruning is the insight");
        addQ(p13,11,"Generate Parentheses","https://leetcode.com/problems/generate-parentheses/","M","must","Amazon,Google,Meta","OA,interview-heavy","open < n add open; close < open add close");
        addQ(p13,12,"Restore IP Addresses","https://leetcode.com/problems/restore-ip-addresses/","M","strong","Amazon,Airbnb","OA","4-segment partition with validity check - practical backtrack");
        addQ(p13,13,"Word Break II","https://leetcode.com/problems/word-break-ii/","H","strong","Amazon,Google,Meta","thinking-ability","Backtracking + memoization - bridges DFS and DP");
            Pattern p14=savePattern("Dynamic Programming","dp",14,9,"Phase 3 Weeks 9-12 Hard Patterns","Define dp state in plain English before coding",26,21);
        addQ(p14,1,"Climbing Stairs","https://leetcode.com/problems/climbing-stairs/","E","must","Amazon,Google,Microsoft","OA,intuition-builder","Fibonacci DP - see the subproblem structure");
        addQ(p14,2,"House Robber","https://leetcode.com/problems/house-robber/","M","must","Amazon,Microsoft,Airbnb","pattern-defining,OA","dp[i] = max(dp[i-2]+arr[i], dp[i-1]) - 1D DP foundation");
        addQ(p14,3,"House Robber II","https://leetcode.com/problems/house-robber-ii/","M","must","Amazon,Microsoft","OA","Run HouseRobber on [0..n-2] and [1..n-1] - circular DP trick");
        addQ(p14,4,"Coin Change","https://leetcode.com/problems/coin-change/","M","must","Amazon,Google,Microsoft,Uber","pattern-defining,interview-heavy,OA","dp[i] = min coins for amount i - unbounded knapsack variant");
        addQ(p14,5,"Coin Change II","https://leetcode.com/problems/coin-change-ii/","M","must","Amazon,Google","interview-heavy","Count combinations - inner loop order matters (combos vs perms)");
        addQ(p14,6,"Longest Common Subsequence","https://leetcode.com/problems/longest-common-subsequence/","M","must","Amazon,Google,Microsoft,DE Shaw","pattern-defining,interview-heavy","dp[i][j] = match or skip - 2D subsequence template");
        addQ(p14,7,"Longest Increasing Subsequence","https://leetcode.com/problems/longest-increasing-subsequence/","M","must","Amazon,Google,Microsoft,Goldman Sachs","pattern-defining,interview-heavy","O(n log n) with patience sort - or O(n^2) DP");
        addQ(p14,8,"0/1 Knapsack (GFG)","https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem/","M","must","Amazon,Flipkart,DE Shaw","pattern-defining,OA,interview-heavy","Include/exclude each item - 2D dp, optimize to 1D");
        addQ(p14,9,"Partition Equal Subset Sum","https://leetcode.com/problems/partition-equal-subset-sum/","M","must","Amazon,Google,Meta","pattern-defining,interview-heavy","0/1 knapsack for boolean target - can we reach sum/2?");
        addQ(p14,10,"Target Sum","https://leetcode.com/problems/target-sum/","M","must","Amazon,Google","OA,DP+DFS","Assign + or - - count subsets with sum = (target+total)/2");
        addQ(p14,11,"Word Break","https://leetcode.com/problems/word-break/","M","must","Amazon,Microsoft,Google,Meta","pattern-defining,interview-heavy","dp[i] = can we form word[0..i] - prefix + dictionary check");
        addQ(p14,12,"Unique Paths","https://leetcode.com/problems/unique-paths/","M","must","Amazon,Microsoft,Google","OA","2D grid DP - dp[i][j] = dp[i-1][j] + dp[i][j-1]");
        addQ(p14,13,"Minimum Path Sum","https://leetcode.com/problems/minimum-path-sum/","M","must","Amazon,Google","OA","Grid DP with min - foundation 2D DP");
        addQ(p14,14,"Edit Distance","https://leetcode.com/problems/edit-distance/","H","must","Amazon,Google,Microsoft,Goldman Sachs","pattern-defining,interview-heavy,thinking-ability","dp[i][j]: insert/delete/replace - classic 2D string DP");
        addQ(p14,15,"Longest Palindromic Subsequence","https://leetcode.com/problems/longest-palindromic-subsequence/","M","must","Amazon,Google","interview-heavy","LCS(s, reverse(s)) - elegant reuse of LCS");
        addQ(p14,16,"Palindromic Substrings","https://leetcode.com/problems/palindromic-substrings/","M","must","Amazon,Google,Facebook","interview-heavy","Expand around center - or DP dp[i][j] is palindrome");
        addQ(p14,17,"Longest Palindromic Substring","https://leetcode.com/problems/longest-palindromic-substring/","M","must","Amazon,Microsoft,Google,Adobe","OA,interview-heavy","Expand around center O(n^2) - Manacher for O(n) optional");
        addQ(p14,18,"Maximum Product Subarray","https://leetcode.com/problems/maximum-product-subarray/","M","must","Amazon,Microsoft,Flipkart","OA,interview-heavy","Track both max and min product - negatives flip sign");
        addQ(p14,19,"Decode Ways","https://leetcode.com/problems/decode-ways/","M","must","Amazon,Facebook,Microsoft","OA,interview-heavy","dp[i] = ways to decode s[0..i] - leading zero kills paths");
        addQ(p14,20,"Burst Balloons","https://leetcode.com/problems/burst-balloons/","H","must","Google,Amazon,DE Shaw","pattern-defining,interview-heavy,thinking-ability","Interval DP - think of last balloon burst, not first");
        addQ(p14,21,"Largest Rectangle in Histogram","https://leetcode.com/problems/largest-rectangle-in-histogram/","H","must","Amazon,Google,Microsoft","thinking-ability,mono-stack-bridge","Tallest rectangle including bar i - mono stack is optimal");
        addQ(p14,22,"Distinct Subsequences","https://leetcode.com/problems/distinct-subsequences/","H","strong","Amazon,Google","thinking-ability","Count how many times t appears as subsequence of s - 2D DP");
        addQ(p14,23,"Regular Expression Matching","https://leetcode.com/problems/regular-expression-matching/","H","strong","Google,Amazon,Facebook","thinking-ability,interview-heavy","* matches 0 or more of prev - 2D DP with careful cases");
        addQ(p14,24,"Maximum Profit in Job Scheduling","https://leetcode.com/problems/maximum-profit-in-job-scheduling/","H","strong","Amazon,Google","thinking-ability,greedy+BS+DP","Interval DP + binary search for non-overlapping jobs");
        addQ(p14,25,"Interleaving String","https://leetcode.com/problems/interleaving-string/","H","strong","Amazon,Google","thinking-ability","2D DP - dp[i][j]: can s1[0..i]+s2[0..j] form s3[0..i+j]");
        addQ(p14,26,"Egg Drop Problem","https://leetcode.com/problems/super-egg-drop/","H","optional","Amazon,Google","elite,thinking-ability","Classic interval DP / binary search on answer hybrid");
            Pattern p15=savePattern("Union Find (DSU)","dsu",15,11,"Phase 3 Weeks 9-12 Hard Patterns","Path compression + rank, dynamic connectivity",8,6);
        addQ(p15,1,"Number of Connected Components","https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/","M","must","LinkedIn,Amazon","pattern-defining,OA","DSU foundation - union edges, count distinct roots");
        addQ(p15,2,"Graph Valid Tree","https://leetcode.com/problems/graph-valid-tree/","M","must","LinkedIn,Google","interview-heavy","n-1 edges and no cycle via DSU - clean combination");
        addQ(p15,3,"Redundant Connection","https://leetcode.com/problems/redundant-connection/","M","must","Amazon,Google","interview-heavy","Add edges, first cycle edge = redundant");
        addQ(p15,4,"Accounts Merge","https://leetcode.com/problems/accounts-merge/","M","must","Amazon,Google,Facebook","pattern-defining,interview-heavy","Union emails by account - DSU on string keys");
        addQ(p15,5,"Longest Consecutive Sequence","https://leetcode.com/problems/longest-consecutive-sequence/","M","must","Amazon,Google,Meta,Microsoft","interview-heavy,OA","HashSet approach O(n) - or DSU on num+1 edges");
        addQ(p15,6,"Minimum Spanning Tree (Kruskals)","https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/","M","must","Google,Amazon,DE Shaw","interview-heavy","Sort edges + DSU until n-1 edges - canonical MST");
        addQ(p15,7,"Making a Large Island","https://leetcode.com/problems/making-a-large-island/","H","strong","Google","thinking-ability","Label islands by ID, try flipping each 0 - island size lookup");
        addQ(p15,8,"Number of Islands II","https://leetcode.com/problems/number-of-islands-ii/","H","optional","Google,Amazon","elite","Dynamic DSU - add land cells one by one");
        Pattern p16=savePattern("Trie","trie",16,11,"Phase 3 Weeks 9-12 Hard Patterns","TrieNode with children dict + is_end flag",8,4);
        addQ(p16,1,"Implement Trie","https://leetcode.com/problems/implement-trie-prefix-tree/","M","must","Amazon,Google,Microsoft","pattern-defining,interview-heavy","TrieNode with children dict + is_end - absolute foundation");
        addQ(p16,2,"Add and Search Word","https://leetcode.com/problems/design-add-and-search-words-data-structure/","M","must","Facebook,Amazon","interview-heavy","DFS with . wildcard - trie + backtracking");
        addQ(p16,3,"Word Search II","https://leetcode.com/problems/word-search-ii/","H","must","Amazon,Google,Microsoft,Airbnb","pattern-defining,interview-heavy,thinking-ability","Build trie from dictionary, DFS on board - prune at every step");
        addQ(p16,4,"Maximum XOR of Two Numbers","https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/","M","must","Google,Amazon,DE Shaw","interview-heavy,thinking-ability","Binary trie - insert bit by bit, query opposite bit");
        addQ(p16,5,"Replace Words","https://leetcode.com/problems/replace-words/","M","strong","Amazon","OA","Build root trie, replace words with shortest prefix");
        addQ(p16,6,"Map Sum Pairs","https://leetcode.com/problems/map-sum-pairs/","M","strong","Amazon","variation","Trie node stores sum - prefix sum query on trie");
        addQ(p16,7,"Word Break (Trie variant)","https://leetcode.com/problems/word-break/","M","strong","Amazon,Google","trie+DP","Trie for prefix match + DP - faster than set lookup");
        addQ(p16,8,"Palindrome Pairs","https://leetcode.com/problems/palindrome-pairs/","H","optional","Google,Airbnb","elite","Reverse word trie with palindrome suffix check - very complex");
        Pattern p17=savePattern("Bit Manipulation","bit-manip",17,12,"Phase 3 Weeks 9-12 Hard Patterns","XOR properties, bit tricks, mask enumeration",10,7);
        addQ(p17,1,"Single Number","https://leetcode.com/problems/single-number/","E","must","Amazon,Google,Microsoft","OA,pattern-defining","XOR all - a^a=0, a^0=a. Pairs cancel.");
        addQ(p17,2,"Number of 1 Bits","https://leetcode.com/problems/number-of-1-bits/","E","must","Amazon,Microsoft","OA","n & (n-1) clears lowest set bit - count in O(k) where k=#bits");
        addQ(p17,3,"Reverse Bits","https://leetcode.com/problems/reverse-bits/","E","must","Amazon,Microsoft,Apple","OA","Shift and OR - 32 iterations");
        addQ(p17,4,"Missing Number","https://leetcode.com/problems/missing-number/","E","must","Amazon,Microsoft,Google","OA","XOR 0..n with array - missing pops out");
        addQ(p17,5,"Counting Bits","https://leetcode.com/problems/counting-bits/","E","must","Amazon,Microsoft","OA","dp[i] = dp[i>>1] + (i&1) - elegant DP+bits");
        addQ(p17,6,"Sum of Two Integers","https://leetcode.com/problems/sum-of-two-integers/","M","must","Amazon,Microsoft,Google","interview-heavy","a^b = sum without carry; (a&b)<<1 = carry - repeat until no carry");
        addQ(p17,7,"Power of Two","https://leetcode.com/problems/power-of-two/","E","must","Amazon","OA","n & (n-1) == 0 - exactly one bit set");
        addQ(p17,8,"Single Number III","https://leetcode.com/problems/single-number-iii/","M","strong","Amazon,Google","thinking-ability","XOR all -> x^y; isolate a bit; separate into two groups");
        addQ(p17,9,"Subsets via Bitmask","https://leetcode.com/problems/subsets/","M","strong","Amazon,Google","OA","1<<n masks, check each bit - iterative subset enumeration");
        addQ(p17,10,"Bitwise AND of Numbers Range","https://leetcode.com/problems/bitwise-and-of-numbers-range/","M","optional","Amazon","thinking-ability","Common prefix of m and n - right shift until equal");
        Pattern p18=savePattern("Advanced Graph","adv-graph",18,12,"Phase 3 Weeks 9-12 Hard Patterns","Dijkstra, Bellman-Ford, MST, Eulerian path",12,9);
        addQ(p18,1,"Network Delay Time","https://leetcode.com/problems/network-delay-time/","M","must","Amazon,Google,Uber","pattern-defining,interview-heavy","Dijkstra from source - min-heap, relax neighbors");
        addQ(p18,2,"Cheapest Flights Within K Stops","https://leetcode.com/problems/cheapest-flights-within-k-stops/","M","must","Amazon,Google,Uber,Airbnb","interview-heavy,thinking-ability","Bellman-Ford with k iterations - or modified Dijkstra");
        addQ(p18,3,"Path With Maximum Probability","https://leetcode.com/problems/path-with-maximum-probability/","M","must","Amazon,Google","OA","Dijkstra with max-heap on probability - product instead of sum");
        addQ(p18,4,"Minimum Cost to Connect All Points","https://leetcode.com/problems/min-cost-to-connect-all-points/","M","must","Amazon,Google","interview-heavy","Prims MST with min-heap on Manhattan distance");
        addQ(p18,5,"Alien Dictionary","https://leetcode.com/problems/alien-dictionary/","H","must","Google,Amazon,Meta,Airbnb","interview-heavy,thinking-ability","Build directed graph from word diffs, topo sort, detect cycle");
        addQ(p18,6,"Find Eventual Safe States","https://leetcode.com/problems/find-eventual-safe-states/","M","must","Google,Amazon","interview-heavy","Terminal nodes = safe; reverse edges + in-degree BFS");
        addQ(p18,7,"Reconstruct Itinerary","https://leetcode.com/problems/reconstruct-itinerary/","H","must","Amazon,Google,Airbnb","interview-heavy,thinking-ability","Hierholzers algorithm - Eulerian path via DFS postorder");
        addQ(p18,8,"Minimum Spanning Tree Kruskal","https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/","M","must","Google,Amazon,DE Shaw","pattern-defining","Sort edges + DSU - canonical MST algorithm");
        addQ(p18,9,"Floyd-Warshall All-Pairs Shortest Path","https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall/","M","must","Google,DE Shaw","interview-heavy","dp[i][j][k] = min dist via node k - O(V^3)");
        addQ(p18,10,"Number of Ways to Arrive at Destination","https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/","M","strong","Amazon,Google","interview-heavy","Dijkstra + count paths - ways[] alongside dist[]");
        addQ(p18,11,"Critical Connections in a Network","https://leetcode.com/problems/critical-connections-in-a-network/","H","strong","Amazon,Google","thinking-ability","Tarjans bridge-finding - disc and low arrays");
        addQ(p18,12,"Swim in Rising Water","https://leetcode.com/problems/swim-in-rising-water/","H","strong","Google","thinking-ability","Dijkstra on grid with min-max bottleneck - min of max elevation");
        Pattern p19=savePattern("Segment Tree / BIT","seg-tree",19,15,"Phase 4 Weeks 13-16 Elite","Range queries with point/range updates in O(log n)",5,2);
        addQ(p19,1,"Range Sum Query Mutable","https://leetcode.com/problems/range-sum-query-mutable/","M","must","Amazon,Google","pattern-defining","BIT/Fenwick tree - point update + prefix sum in O(log n)");
        addQ(p19,2,"Count of Smaller Numbers After Self","https://leetcode.com/problems/count-of-smaller-numbers-after-self/","H","must","Google,Amazon,DE Shaw","interview-heavy,thinking-ability","BIT on coordinate-compressed values - or merge sort");
        addQ(p19,3,"Reverse Pairs","https://leetcode.com/problems/reverse-pairs/","H","strong","Google,Amazon","thinking-ability","Modified merge sort - count cross-boundary pairs");
        addQ(p19,4,"Count of Range Sum","https://leetcode.com/problems/count-of-range-sum/","H","optional","Google","elite","Merge sort + prefix sum - count pairs in range");
        addQ(p19,5,"Falling Squares","https://leetcode.com/problems/falling-squares/","H","optional","Google","elite","Segment tree with lazy propagation - interval max update");
        Pattern p20=savePattern("String Algorithms","strings",20,15,"Phase 4 Weeks 13-16 Elite","KMP, sliding window on strings, anagram grouping",7,5);
        addQ(p20,1,"Minimum Window Substring","https://leetcode.com/problems/minimum-window-substring/","H","must","Amazon,Google,Meta","OA,string-window","Already in sliding window - cross-pattern question");
        addQ(p20,2,"Find the Index of the First Occurrence","https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/","E","must","Amazon,Microsoft","OA,KMP","Naive or KMP - interviewers usually accept O(n*m)");
        addQ(p20,3,"Longest Common Prefix","https://leetcode.com/problems/longest-common-prefix/","E","must","Amazon,Microsoft,Google","OA","Vertical scanning or sort + compare first/last");
        addQ(p20,4,"Group Anagrams","https://leetcode.com/problems/group-anagrams/","M","must","Amazon,Microsoft,Google,Meta","OA,interview-heavy","Sorted string or frequency tuple as key - hashmap grouping");
        addQ(p20,5,"Valid Anagram","https://leetcode.com/problems/valid-anagram/","E","must","Amazon,Microsoft","OA","Sort or frequency count - warm-up string question");
        addQ(p20,6,"Repeated Substring Pattern","https://leetcode.com/problems/repeated-substring-pattern/","E","strong","Amazon,Google","OA,KMP","(s+s)[1..2n-2].contains(s) - KMP failure function trick");
        addQ(p20,7,"Shortest Palindrome","https://leetcode.com/problems/shortest-palindrome/","H","optional","Google","KMP,elite","KMP failure function on s+#+reverse(s)");
    }
}







