package com.study.backendSpring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.study.backendSpring.entity.Order;

public interface OrderRepository extends MongoRepository<Order, String> {

	Optional<Order> findByUserIdAndProductName(String tempUserId, String name);

	List<Order> findByUserIdOrderByOrderedAtDesc(String userId);

}
