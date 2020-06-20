const express = require('express');
const router = express.Router();

// 내정보 페이지
router.get('/profile', (req, res) => {
    res.render('profile', {title: '내 정보 - NodeBird', user:null});
})

// 회원가입 페이지
router.get('/join', (req, res) => {
    res.render('join', {
        title : '회원가입 - NodeBird',
        user:null,
        // error 메시지를 보여주기 위해서 flash 사용
        joinError : req.flash('joinError')
    })
})

// 메인 페이지
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits : [],
        user:null,
        loginError : req.flash('loginError')
    })
})

module.exports = router;