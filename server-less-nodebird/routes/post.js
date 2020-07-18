const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const { Hashtag, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
// uploads 폴더가 없을 때 폴더 생성
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});
// AWS에 관한 설정
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
})


// 파일 업로드
// 미들웨어를 만드는 객체가 된다.
const upload = multer({
  // multerS3 옵션으로 s3 객체, 버킷명, 파일명을 입력
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'seungminnode',
    key(req, file, cb){
      // original 폴더 아래에 생성
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
    }
  }),
  // 최대 이미지 파일 용량 허용치(바이트 단위) 10MB
  limits: { fileSize: 5 * 1024 * 1024 },
});
// upload 변수는 single, array, fields, none 등의 메서드를 가지고 있다.
// single 하나의 이미지를 업로드할 때 사용한다.
// array, fields는 여러 개의 이미지를 업로드할 때 사용한다.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  // S3 버킷 이미지 주소가 담겨있다. 이 주소를 클라이언트로 보낸다.
  res.json({ url: req.file.location });
});

const upload2 = multer();
// none은 이미지를 올리지 않고 데이터만 multipart 형식으로 전송했을 때 사용한다.
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    // 게시글 내용에서 해시태그를 정규표현식으로 추출한다.
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          //특정 요소를 검색하거나, 존재하지 않으면 새로 생성
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          }),
        ),
      );
      // 게시글과 해시태그의 관계를 PostHashtag 테이블에 넣는다.
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 해시태그 조회
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    // 일치하는 해시태그 찾기
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
