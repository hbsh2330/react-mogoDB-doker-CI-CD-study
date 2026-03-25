package com.study.backendSpring.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.study.backendSpring.config.JwtUtil;
import com.study.backendSpring.entity.User;
import com.study.backendSpring.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users") // 👈 여기서 http://43.201.50.100:5000/api/users 가 결정됩니다.
@CrossOrigin(origins = "http://43.201.50.100:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        User user = userService.login(body.get("userId"), body.get("password"));
        
        // 💡 진짜 JWT 토큰 생성 (영문/숫자 조합으로 생성됨)
        String token = jwtUtil.createToken(user.getId()); 
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of("userId", user.getUserId(), "gold", user.getGold())
        ));
    }

 // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String token) {
        // 1. "Bearer " 제거 (리액트 axiosConfig에서 붙여서 보냄)
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        
        // 2. 토큰에서 유저 고유 ID 추출 (아까 만든 extractUserId 사용)
        String id = jwtUtil.extractUserId(jwtToken);
        
        if (id == null) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }

        // 3. 서비스에서 유저 정보(비밀번호 제외) 가져오기
        return ResponseEntity.ok(userService.getMyInfo(id));
    }

    // PUT /api/users/add-gold
    @PutMapping("/add-gold")
    public ResponseEntity<?> addGold(
            @RequestHeader("Authorization") String token, 
            @RequestBody Map<String, Object> body) {
        
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String id = jwtUtil.extractUserId(jwtToken);
        
        if (id == null) {
            return ResponseEntity.status(401).body("권한이 없습니다.");
        }

        // 리액트에서 { amount: 10000 } 만 보내도 작동함
        int amount = Integer.parseInt(body.get("amount").toString());
        int updatedGold = userService.addGold(id, amount);
        
        return ResponseEntity.ok(Map.of("gold", updatedGold));
    }
    
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String token) {
        // 1. "Bearer " 문자열 제거
        String jwtToken = token.substring(7);
        
        // 2. 위에서 만든 메서드로 ID 추출
        String userId = jwtUtil.extractUserId(jwtToken);
        
        if (userId == null) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }

        // 3. 서비스 호출
        return ResponseEntity.ok(userService.getOrders(userId));
    }
}