package com.study.backendSpring.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.study.backendSpring.entity.Order;
import com.study.backendSpring.entity.User;
import com.study.backendSpring.repository.OrderRepository;
import com.study.backendSpring.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;

    public void register(User user) {
        if (userRepository.findByUserId(user.getUserId()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setGold(40000); // Node.js 설정과 동일
        userRepository.save(user);
    }

    public User login(String userId, String password) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("아이디가 없습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return user;
    }

    public User getMyInfo(String id) {
        // 💡findById로 유저를 찾고, 보안을 위해 비밀번호는 null로 밀어서 반환하거나 
        // 필요한 필드만 담은 DTO를 반환하는 것이 좋습니다.
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        
        user.setPassword(null); // 비밀번호 제외
        return user;
    }

    public int addGold(String id, int amount) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        
        user.setGold(user.getGold() + amount);
        userRepository.save(user);
        
        return user.getGold();
    }


    public List<Order> getOrders(String userId) {
        // 💡 최신순으로 정렬해서 가져오기 (Node.js의 .sort({ orderedAt: -1 })와 동일)
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId);
    }
}
