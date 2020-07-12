const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

// 내정보 페이지
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

// 회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    // error 메시지를 보여주기 위해서 flash 사용
    joinError: req.flash('joinError'),
  });
});

// 메인 페이지
router.get('/', (req, res, next) => {
  // 데이터베이스에서 게시글을 조회한 뒤 결과를 twits에 렌더링한다.
  // 조회할 때 게시글 작성자의 아이디와 닉네임을 JOIN해서 제공하고 게시글 순서는 최신순으로 정렬한다.
  Post.findAll({
    include: {
      // User 에서 id, nick에 해당하는 것만 제공
      model: User,
      // 일부 특성만을 select
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
