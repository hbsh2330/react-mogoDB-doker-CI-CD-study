const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order'); // 위에서 만든 모델 불러오기
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /회원가입
router.post('/register', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    // 아이디 중복 체크 (JPA의 existsById 같은 로직)
    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).send("이미 존재하는 아이디입니다.");

    // 비밀번호 해싱 (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      userId,
      password: hashedPassword,
      gold: 40000 // 신규 가입 시 기본 지원금
    });

    await user.save();
    res.json({ message: "회원가입 성공" });
  } catch (err) {
    res.status(500).send("서버 에러" + err);
  }
});
// 로그인 (토큰 발행)
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  
  if (!user) return res.status(400).send('아이디가 없습니다.');
  
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('비밀번호가 틀렸습니다.');

  // 토큰 생성 (비밀키는 .env에 저장 권장)
  const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });
  
  // 토큰과 함께 유저 정보(잔액 등)를 보냄
  res.header('Authorization', token).json({ 
    token: token, 
    user: { userId: user.userId, gold: user.gold } 
  });
});

// 내 정보 가져오기 (로그인 유지용)
// auth 미들웨어를 거치므로, 토큰이 유효하면 req.user에 유저 정보가 담겨 옵니다.
router.get('/me', auth, async (req, res) => {
  try {
    // auth 미들웨어에서 넣어준 _id로 DB에서 유저를 찾습니다.
    const user = await User.findById(req.user._id).select('-password'); // 비밀번호는 제외하고 가져오기
    res.json(user);
  } catch (err) {
    res.status(500).send("서버 에러");
  }
});

router.get('/orders', auth, async (req, res) => {
  try {
    // 현재 로그인한 유저의 ID로 된 주문들만 다 찾아옵니다.
    const orders = await Order.find({ userId: req.user._id }).sort({ orderedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send("구매 목록 조회 실패");
  }
});

router.put('/add-gold', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    // 1. auth 미들웨어가 넘겨준 req.user._id를 사용하여 
    // 현재 로그인한 딱 그 유저만 찾아서 돈을 올려줍니다.
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { $inc: { gold: amount } }, 
      { new: true } // 업데이트된 후의 유저 데이터를 가져옴
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 2. 바뀐 잔액을 다시 리액트로 보내줍니다.
    res.json({ gold: updatedUser.gold });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "잔액 충전 중 서버 에러 발생" });
  }
});

module.exports = router;