const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const fs = require('fs');

const { Hashtag, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

// 파일 업로드
// 미들웨어를 만드는 객체가 된다.
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: process.env.MULTER_GOOGLE_STORAGE_BUCKET,
    projectId: process.env.MULTER_GOOGLE_STORAGE_PROJECTID,
    keyFilename: process.env.MULTER_GOOGLE_STORAGE_KEYFILENAME,
  }),
  // 최대 이미지 파일 용량 허용치(바이트 단위) 10MB
  limits: { fileSize: 5 * 1024 * 1024 },
});
// upload 변수는 single, array, fields, none 등의 메서드를 가지고 있다.
// single 하나의 이미지를 업로드할 때 사용한다.
// array, fields는 여러 개의 이미지를 업로드할 때 사용한다.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: req.file.path });
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
