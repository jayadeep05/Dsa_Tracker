package com.dsatracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in request headers");
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(7);
        log.debug("JWT found: {}", jwt.substring(0, Math.min(jwt.length(), 10)) + "...");
        try {
            username = jwtService.extractUsername(jwt);
            log.debug("Username extracted from JWT: {}", username);
        } catch (Exception e) {
            log.debug("Invalid JWT token extraction failed: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                log.debug("UserDetails loaded for: {}", username);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.debug("JWT is valid for user: {}", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("SecurityContext updated with authentication for user: {}", username);
                } else {
                    log.debug("JWT is INVALID for user: {}", username);
                }
            } catch (Exception e) {
                log.debug("Could not set user authentication for {}: {}", username, e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
