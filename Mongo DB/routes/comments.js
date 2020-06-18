var express = require('express');
var Comment = require('../schemas/comment');

var router = express.Router();
router.get('/:id', function (req, res, next) {
  // populate 메서드로 관련 있는 컬렉션의 다큐먼트를 불러올 수 있다.
  // commenter 필드가 사용자 다큐먼트로 치환된다.
  // commenter 필드는 objectId가 아니라 그 objectId를 가진 사용자의 다큐먼트가 된다.
  Comment.find({ commenter: req.body.id })
    .populate('commenter')
    .then((comments) => {
      console.log(comments);
      res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.post('/', function (req, res, next) {
  // 댓글 등록 new 생성
  const comment = new Comment({
    commenter: req.body.id,
    comment: req.body.comment,
  });
  comment
    .save()
    .then((result) => {
      // populate 메서드로 User 스키마와 합친다.
      // path 옵션으로 어떤 필드를 합칠지 설정해준다.
      return Comment.populate(result, { path: 'commenter' });
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
// 수정
router.patch('/:id', function (req, res, next) {
  // 시퀄라이즈와 반대로 첫번째 인자에 id 두번째인자에 바꿀 내용
  Comment.update({ _id: req.body.id }, { comment: req.body.comment })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// 삭제
router.delete('/:id', function (req, res, next) {
  Comment.remove({ _id: req.body.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
