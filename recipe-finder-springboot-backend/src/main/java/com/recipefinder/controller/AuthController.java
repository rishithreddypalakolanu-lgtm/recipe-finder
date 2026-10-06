package com.recipefinder.controller;

import com.recipefinder.dto.AuthRequest;
import com.recipefinder.model.User;
import com.recipefinder.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req, HttpSession session) {
        if (users.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        User user = users.save(new User(req.username(), encoder.encode(req.password())));
        session.setAttribute("username", user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Registration successful", "username", user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req, HttpSession session) {
        User user = users.findByUsername(req.username()).orElse(null);
        if (user == null || !encoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        session.setAttribute("username", user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Login successful", "username", user.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object username = session.getAttribute("username");
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        return ResponseEntity.ok(Map.of("username", username));
    }
}
