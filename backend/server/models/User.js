const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gold: { type: Number, default: 40000 }, // 기본 잔액 설정
  history: [{ name: String, count: Number }] // 구매 내역 연동 준비
});

module.exports = mongoose.model('User', userSchema);