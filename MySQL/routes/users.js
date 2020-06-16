var express = require("express");
var User = require("../models").User;

var router = express.Router();

// 사용자 조회
router.get("/", function (req, res, next) {
  User.findAll()
    .then((users) => {
      // JSON 형식으로 반환
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});


// 사용자 등록
router.post("/", function (req, res, next) {
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
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

module.exports = router;
