package com.study.backendSpring.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "orders")
@Data
@NoArgsConstructor
public class Order {
    @Id
    private String id;
    private String userId;
    private String productName;
    private int count;
    private LocalDateTime orderedAt;

    public Order(String userId, String productName, int count) {
        this.userId = userId;
        this.productName = productName;
        this.count = count;
        this.orderedAt = LocalDateTime.now();
    }
}