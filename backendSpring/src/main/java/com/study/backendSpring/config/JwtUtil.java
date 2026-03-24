package com.study.backendSpring.config;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret}") // properties 파일의 jwt.secret 값을 가져옴
    private String secretKey;

    private Key key;

    // 객체가 생성된 후 실행되어 키를 초기화합니다.
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String createToken(String id) {
        return Jwts.builder()
                .setSubject(id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String extractUserId(String token) {
        try {
            // 1. 토큰을 파싱하고 서명을 검증합니다.
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key) // 아까 만든 서명 키 사용
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 2. 토큰 생성 시 setSubject(user.getId())로 넣었던 값을 꺼냅니다.
            return claims.getSubject(); 
            
        } catch (Exception e) {
            // 토큰이 변조되었거나 만료된 경우 null을 반환하거나 예외를 던집니다.
            System.out.println("토큰 검증 실패: " + e.getMessage());
            return null;
        }
    }
}
