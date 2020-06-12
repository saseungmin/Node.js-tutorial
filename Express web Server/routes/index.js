var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 익스프레스가 res 객체에 추가한 템플릿 렌더링을 위한 메서드이다.
  res.render('index', { title: 'Express' });
});

module.exports = router;
