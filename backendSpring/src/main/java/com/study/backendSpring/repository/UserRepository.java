package com.study.backendSpring.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.study.backendSpring.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
	// 💡 Node.js의 User.findOne({ userId }) 와 같은 역할
    Optional<User> findByUserId(String userId);
}
