var express = require("express");
var { User, Comment } = require("../models");

var router = express.Router();
// 댓글 조회
router.get("/:id", function (req, res, next) {
    // include 옵션은 hasMany나 belongsTo로 연결해두어야 사용할 수 있다.
  Comment.findAll({
    include: {
      // 사용자를 찾는데 파람의 아이디값에 해당하는 user를 찾는다.
      model: User,
      where: { id: req.params.id },
    },
  })
    .then((comments) => {
      console.log(comments);
      // 찾은 user데이터를 json으로 보내준다.
      res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// 댓글 생성
router.post("/", function (req, res, next) {
  Comment.create({
    commenter: req.body.id,
    comment: req.body.comment,
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});


// 댓글 수정으로 첫번째 인자는 수정할 컬럼과 값이 들어있는 객체를 제공하고 두번쨰 인자는 어떤 로우를 수정할 것인지에 대한 조건을 제시한다.
router.patch("/:id", function (req, res, next) {
  Comment.update({ comment: req.body.comment }, { where: { id: req.params.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// 댓글 삭제
router.delete("/:id", function (req, res, next) {
  Comment.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;