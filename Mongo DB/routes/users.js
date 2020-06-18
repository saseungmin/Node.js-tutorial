var express = require('express');
var User = require('../schemas/users');

var router = express.Router();

// GET /users 사용자 조회 
router.get('/', function(req, res, next) {
  User.find({}).then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })
});

// 사용자 등록
router.post('/', function(req, res, next) {
  const user = new User({
    name : req.body.name,
    age : req.body.age,
    married : req.body.married,
  });
  user.save()
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    })
})

module.exports = router;
