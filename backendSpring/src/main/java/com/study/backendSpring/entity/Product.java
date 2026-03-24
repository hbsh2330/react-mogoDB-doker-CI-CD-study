package com.study.backendSpring.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "products") // MongoDB의 컬렉션 이름과 연결
@Data
public class Product {
    @Id
    @JsonProperty("_id")
    private String id;          // MongoDB의 _id 필드
    private String category;    // 과일, 야채 등
    private String name;        // 상품명
    private int price;          // 가격
    private int stock;          // 재고
}