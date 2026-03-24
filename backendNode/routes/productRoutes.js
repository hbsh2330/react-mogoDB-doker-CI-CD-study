const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User'); // 👈 이 줄을 추가하세요!
const Order = require('../models/Order'); // 주문 모델 가져오기
const auth = require('../middleware/auth');

// 1. 전체 상품 조회 (리액트가 처음에 가져갈 데이터)
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.patch('/:name', auth, async (req, res) => {
  try {
    const { stockChange, price } = req.body;

    // 1. 재고 수정 (기존과 동일)
    const updatedProduct = await Product.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { stock: stockChange } },
      { new: true }
    );

    if (stockChange < 0) {
      // 2. 유저 잔액 차감 (기존과 동일)
      await User.findByIdAndUpdate(req.user._id, { $inc: { gold: -price } });

      // 3. ⭐ 구매 목록(Order) 처리 (수정된 핵심 로직)
      // findOneAndUpdate를 사용하여 '같은 유저'가 '같은 상품'을 샀는지 확인합니다.
      await Order.findOneAndUpdate(
        { 
          userId: req.user._id, 
          productName: req.params.name 
        }, 
        { 
          $inc: { count: 1 }, // 있으면 count를 1 증가
          $set: { orderedAt: new Date() } // 마지막 구매 시간 업데이트
        },
        { 
          upsert: true, // 💡 중요: 데이터가 없으면 새로 생성(insert)해라!
          new: true 
        }
      );
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;