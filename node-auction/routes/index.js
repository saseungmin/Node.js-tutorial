const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Auction, Good, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// res.locals.user 로 모든 pug 템플릿에 사용자 정보를 변수로 집어 넣는다.
// 이렇게 하면 res.render 메서드에 user:req.user를 하지않아도 되므로 중복제거가 가능하다.
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 렌더링할때 경매가 진행 중인 상품 목록도 같이 불러온다.
// (soldId)낙찰가 아이디가 null이면 경매가 진행 중이다.
router.get('/', async (req, res, next) => {
  try {
    const goods = await Good.findAll({ where: { soldId: null } });
    res.render('main', {
      title: 'NodeAuction',
      goods,
      loginError: req.flash('loginError'),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
    joinError: req.flash('joinError'),
  });
});

router.get('/good', isLoggedIn, (req, res) => {
  res.render('good', { title: '상품 등록 - NodeAuction' });
});

fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});
// 이미지가 있어 /good post할시 multer로 정의해준다.
const upload = multer({
  // storage 속성은 파일 저장 방식과 경로, 파일명 등을 설정한다.
  // multer.diskStorage를 사용해 이미지가 서버 디스크에 저장되도록 한다.
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  '/good',
  isLoggedIn,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const { name, price } = req.body;
      await Good.create({
        // 상품 등록 ownerId
        ownerId: req.user.id,
        name,
        img: req.file.filename,
        price,
      });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
);

module.exports = router;
