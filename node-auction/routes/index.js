const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { Auction, Good, User, sequelize } = require('../models');
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
      const good = await Good.create({
        // 상품 등록 ownerId
        ownerId: req.user.id,
        name,
        img: req.file.filename,
        price,
      });
      const end = new Date();
      end.setDate(end.getDate() + 1); // 하루 뒤
      schedule.scheduleJob(end, async () => {
        // 입찰가가 가장높은 것 하나
        const success = await Auction.findOne({
          // 해당 상품 한개 good.id
          where: { goodId: good.id },
          order: [['bid', 'DESC']],
        });

        // 해당상품의 낙찰자를 success.userId 로 update
        await Good.update(
          { soldId: success.userId },
          { where: { id: good.id } },
        );
        // User의 돈에 낙찰가를 빼준다.
        await User.update(
          {
            money: sequelize.literal(`money - ${success.bid}`),
          },
          {
            where: { id: success.id },
          },
        );
      });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
);

// 해당 상품에 대한 렌더링
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
  try {
    const [good, auction] = await Promise.all([
      Good.findOne({
        where: { id: req.params.id },
        include: {
          // Good 모델과 User 모델은 현재 1:N 관계가 두번 연결(owner, sold)되어 있으므로
          // 이런 경우는 어떤 관계를 include 해야할지 as로 밝혀줘야 한다.
          model: User,
          as: 'owner',
        },
      }),
      Auction.findAll({
        where: { goodId: req.params.id },
        include: {
          model: User,
        },
        order: [['bid', 'ASC']],
      }),
    ]);
    res.render('auction', {
      title: `${good.name} - NodeAuction`,
      good,
      auction,
      auctionError: req.flash('auctionError'),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 사용자가 입찰가 전송
// 클라이언트로부터 받은 입찰 정보를 저장한다.
router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
  try {
    const { bid, msg } = req.body;
    const good = await Good.findOne({
      where: { id: req.params.id },
      include: { model: Auction },
      // Auction 테이블에 bid(입찰가)가 높은 순으로 정렬
      order: [[{ model: Auction }, 'bid', 'DESC']],
    });
    if (good.price > bid) {
      // 시작 가격보다 낮게 입찰하면
      return res.status(403).send('시작 가격보다 높게 입력해야 합니다.');
    }
    // 경매 종료 시간이 지났으면
    // 경매 등록 시간 + 24시간 < 현재 시간
    if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date()) {
      return res.status(403).send('경매가 이미 종료되었습니다.');
    }
    // 직전 입찰가와 현재 입찰가 비교
    if (good.auctions[0] && good.auctions[0].bid >= bid) {
      return res.status(403).send('이전 입찰가보다 높아야 합니다.');
    }
    const result = await Auction.create({
      bid,
      msg,
      userId: req.user.id,
      goodId: req.params.id,
    });
    // socket.io로 해당 입찰방에 입찰자, 입찰가격, 입찰 메시지를 전송한다.
    req.app.get('io').to(req.params.id).emit('bid', {
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send('ok');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/list', isLoggedIn, async (req, res, next) => {
  try {
    const goods = await Good.findAll({
      where:{soldId : req.user.id},
      include:{model:Auction},
      order:[[{model:Auction}, 'bid', 'DESC']]
    });
    res.render('list', {title:'낙찰 목록 - NodeAuction', goods});
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;
