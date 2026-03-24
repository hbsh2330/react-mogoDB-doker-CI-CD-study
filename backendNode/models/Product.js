const mongoose = require('mongoose');

// 데이터 구조 정의 (Schema)
const productSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 과일, 야채 등
  price: { type: Number, default: 0 },         // 가격
  stock: { type: Number, default: 0 },         // 재고
  name: { type: String, required: true }      // 상품명
});

// 모델로 내보내기 (다른 파일에서 쓸 수 있게 함)
module.exports = mongoose.model('Product', productSchema);