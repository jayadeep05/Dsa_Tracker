package com.dsatracker.controller;

import com.dsatracker.dto.QuestionDto;
import com.dsatracker.service.SpecialListService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/special-lists")
@RequiredArgsConstructor
public class SpecialListController {

    private final SpecialListService specialListService;

    @GetMapping("/{listName}")
    public List<QuestionDto> getList(@PathVariable String listName, @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return specialListService.getList(listName, user != null ? user.getId() : null);
    }
}
