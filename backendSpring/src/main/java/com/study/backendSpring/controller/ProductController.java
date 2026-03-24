package com.study.backendSpring.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.backendSpring.entity.Product;
import com.study.backendSpring.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    

    @GetMapping("")
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    @PatchMapping("/{name}")
    public ResponseEntity<?> updateProduct(
            @PathVariable("name") String name,
            @RequestBody Map<String, Object> body,
            Principal principal) {
        
        // 1. 데이터 추출 (안전하게)
        int stockChange = Integer.parseInt(body.getOrDefault("stockChange", 0).toString());
        int price = body.get("price") != null ? Integer.parseInt(body.get("price").toString()) : 0;
        String userId = principal.getName(); // JwtFilter에서 넣어준 유저 ID

        // 2. 서비스 호출 (트랜잭션 처리를 위해 서비스에서 로직 수행)
        Product updatedProduct = productService.processPurchase(name, userId, stockChange, price);
        
        return ResponseEntity.ok(updatedProduct);
    }
}