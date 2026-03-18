const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization'); // 헤더에서 토큰 추출
  if (!token) return res.status(401).send('로그인이 필요합니다.');

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_TOKEN_KEY); // "Bearer 토큰" 형태 분리
    req.user = verified; // 다음 로직에서 유저 ID를 쓸 수 있게 저장
    next(); // 다음 단계(구매 로직 등)로 이동
  } catch (err) {
    res.status(400).send('유효하지 않은 토큰입니다.');
  }
};