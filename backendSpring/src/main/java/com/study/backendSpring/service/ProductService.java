package com.study.backendSpring.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.backendSpring.entity.Order;
import com.study.backendSpring.entity.Product;
import com.study.backendSpring.entity.User;
import com.study.backendSpring.repository.OrderRepository;
import com.study.backendSpring.repository.ProductRepository;
import com.study.backendSpring.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // 생성자 주입을 자동으로 해줍니다 (Lombok)
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final MongoTemplate mongoTemplate;
    
    public List<Product> findAll() {
        return productRepository.findAll(); // 리포지토리가 제공하는 기본 메서드 사용
    }

    @Transactional // 여러 DB 작업을 하나로 묶음
    public Product processPurchase(String productName, String userId, int stockChange, int price) {
        
        // 1. 재고 수정 (findOneAndUpdate 역할)
        Product product = productRepository.findByName(productName);
        product.setStock(product.getStock() + stockChange);
        productRepository.save(product);

        // 2. 구매인 경우 (stockChange < 0)
        if (stockChange < 0) {
            // 유저 잔액 차감
            User user = userRepository.findById(userId).orElseThrow();
            user.setGold(user.getGold() - price);
            userRepository.save(user);

            // 3. ⭐ 구매 목록(Order) 처리 (Upsert 로직)
            Query query = new Query(Criteria.where("userId").is(userId)
                                            .and("productName").is(productName));
            
            Update update = new Update()
                    .inc("count", 1) // 있으면 count 1 증가
                    .set("orderedAt", LocalDateTime.now()); // 시간 업데이트

            // findAndModify + Upsert 옵션 (데이터 없으면 생성)
            mongoTemplate.findAndModify(
                query, 
                update, 
                new FindAndModifyOptions().upsert(true).returnNew(true), 
                Order.class
            );
        }

        return product;
    }
    

}