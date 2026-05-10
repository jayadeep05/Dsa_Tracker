package com.dsatracker.controller;

import com.dsatracker.dto.AuthRequest;
import com.dsatracker.dto.AuthResponse;
import com.dsatracker.dto.RegisterRequest;
import com.dsatracker.entity.User;
import com.dsatracker.repository.UserRepository;
import com.dsatracker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank() ||
            request.getEmail() == null || request.getEmail().isBlank() ||
            request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "All fields are required"));
        }
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Username already taken"));
        }
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email already registered"));
        }
        
        var user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
                
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .userId(user.getId())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Invalid username or password"));
        }
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .userId(user.getId())
                .build());
    }
}
