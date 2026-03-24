package com.study.backendSpring.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "users")
@Data
public class User {
	@Id
    private String id; // 몽고DB 내부 ID
    
    private String userId;   // 로그인용 아이디
    private String password; // 암호화된 비밀번호
    private int gold = 40000; // 기본 잔액 설정
    
    // 구매 내역 (Node.js의 history 배열과 동일)
    private List<History> history = new ArrayList<>();
    
    @Data
    public static class History {
        private String name;
        private int count;
    }
}