package com.study.backendSpring.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.study.backendSpring.entity.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
	// 기본적인 저장, 조회 기능은 이미 들어있습니다.
	Product findByName(String name);
}
