const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { User, Domain, Post, Hashtag } = require('../models');

const router = express.Router();

// 토큰 발급 라우터
router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    // 전달받은 클라이언트 비밀키로 도메인이 등록된 것인지를 확인한다.
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    // 등록되지 않은 경우 오류
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
      });
    }
    // 토큰 발급
    const token = jwt.sign(
      {
        id: domain.user.id, // 사용자 아이디
        nick: domain.user.nick, // 닉네임
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1m', // 1분 (유효기간)
        issuer: 'seungmin', // 발급자
      },
    );
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

// 토큰 테스트
router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
