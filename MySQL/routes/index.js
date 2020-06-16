var express = require("express");
var User = require("../models").User;

var router = express.Router();

// GET /로 접속했을 떄의 라우터
// findAll()로 모든 사용자를 찾은 후, sequelize.pug를 렌더링할 때 결과값인 users를 넣어준다.
// 시퀄라이즈는 프로미스를 지원하기 떄문에 then 과 catch를 사용해서 각각 조회 성공 시와 실패시의 정보를 얻을 수 있다.
router.get("/", function (req, res, next) {
  // 프로미스 방법
  User.findAll()
    .then((users) => {
      // sequelize.pug를 렌더링할 때 결과값인 users를 넣어준다.
      res.render("sequelize", { users });
    })
    .catch((err) => {
      console.error(err);
      next();
    });
  // async/await
  // try{
  //   const users = await User.findAll();
  //   res.render('sequelize', {users});
  // }catch(error){
  //   console.error(error);
  //   next(error);
  // }
});

module.exports = router;
