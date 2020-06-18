var express = require('express');
var User = require('../schemas/users');

var router = express.Router();

// 모든 사용자 찾기
// promise 방식
// router.get('/', function (req, res, next) {
//   User.find({})
//     .then((users) => {
//       // 몽구스로 사용한다, 찾은 user 정보
//       res.render('mongoose', { users });
//     })
//     .catch((err) => {
//       console.error(err);
//       next(err);
//     });
// });

// async/await 방식
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('mongoose', { users });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
