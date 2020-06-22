const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
// 회원가입 (/auth/join)
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    // bcrypt 두번째 인자는 반복 횟수
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// local 로그인 (/auth/login)
// 미들웨어 안에 미들웨어 존재
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 첫번째인자가 존재하면 실패, 두번째 인자가 존재하면 성공
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    // req.login 메서드는 password.serializeUser를 호출한다.
    // req.login에 제공하는 user객체가 serializeUser로 넘어가게 된다.
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어는 (req,res,next)를 붙인다.
});

// 로그아웃 (/auth/logout)
router.get('/logout', isLoggedIn, (req, res) => {
  // req.user 객체를 제거한다.
  req.logout();
  // req.session 객체의 내용을 제거한다.
  req.session.destroy();
  res.redirect('/');
});

// 카카오 로그인 과졍 (/auth/kakao)
router.get('/kakao', passport.authenticate('kakao'));

// 카카오 로그인 전략 수행
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  },
);

module.exports = router;
