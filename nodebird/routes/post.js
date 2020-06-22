const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// 파일 업로드
// 미들웨어를 만드는 객체가 된다.
const upload = multer({
  // storage 속성은 파일 저장 방식과 경로, 파일명 등을 설정한다.
  // multer.diskStorage를 사용해 이미지가 서버 디스크에 저장되도록 한다.
  storage: multer.diskStorage({
    // destination 저장경로를 nodebird 폴더 아래 uploads 폴더로 지정한다.
    destination(req, file, cb) {
      cb(null, 'upload/');
    },
    // 파일이름 설정
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // .png (파일 확장자명)
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // path.basename(경로, 확장자) path+현재시간+확장자
    },
  }),
  // 최대 이미지 파일 용량 허용치(바이트 단위) 10MB
  limits: { fileSize: 5 * 1024 * 1024 },
});
// upload 변수는 single, array, fields, none 등의 메서드를 가지고 있다.
// single 하나의 이미지를 업로드할 때 사용한다.
// array, fields는 여러 개의 이미지를 업로드할 때 사용한다.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
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

module.exports = router;
