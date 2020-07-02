const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 몽구스(schema)
const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 채팅방 전체 검색
    const rooms = await Room.find({});
    res.render('main', {
      rooms,
      title: 'GIF 채팅방',
      error: req.flash('roomError'),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

router.post('/room', async (req, res, next) => {
  try {
    // 채팅방 생성
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const newRoom = await room.save();
    // io객체 req.app.get('io')으로 접근 가능
    const io = req.app.get('io');
    // main.pug에 newRoom socket.io
    // /room 네임스페이스에 연결한 모든 클라이언트에게 데이터를 보내는 메서드이다.
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 채팅방 렌더링
router.get('/room/:id', async (req, res, next) => {
  try {
    // 해당 채팅방 찾기
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    // 존재 유무 확인
    if (!room) {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/');
    }
    // 비밀번호 일치 확인
    if (room.password && room.password !== req.query.password) {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }
    // io.of('/chat').adapter.rooms에 방 목록
    const { rooms } = io.of('/chat').adapter;
    // 룸이 존재하고, 해당 채팅방이 존재하고, 해당 룸의 수용인원이 초과 하지 않는지 확인
    if (
      rooms && // 방 목록
      rooms[req.params.id] && // 해당 방의 소켓 목록
      room.max <= rooms[req.params.id].length // 해당 방의 소켓 목록의 길이(인원 수)
    ) {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/');
    }
    // 해당 채팅방의 채팅을 날짜순으로 내림차순으로 정렬
    const chats = await Chat.find({ room: room._id }).sort('createdAt');

    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/room/:id', async (req, res, next) => {
  try {
    // 채팅룸과 채팅 삭제
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    // 채팅룸에 인원이 0명이면 2초뒤에 삭제
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    // 채팅 mongoDB에 저장
    await chat.save();
    // req.app.get('io').of('/chat').to(방 아이디).emit 으로 같은 방에 들어 있는 소켓들에게 메시지 데이터를 전송
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// uploads 폴더를 읽어서 없으면 uploads 폴더 생성
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
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
      cb(null, 'uploads/');
    },
    // 파일이름 설정
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // .png (파일 확장자명)
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // path.basename(경로, 확장자) path+현재시간+확장자
    },
  }),
  // 최대 이미지 파일 용량 허용치(바이트 단위) 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
});

// upload 변수는 single, array, fields, none 등의 메서드를 가지고 있다.
// single 하나의 이미지를 업로드할 때 사용한다.
// array, fields는 여러 개의 이미지를 업로드할 때 사용한다.
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    await chat.save();
    // io의 chat 네임스페이스에 해당 채팅룸에 'chat'으로 보낸다.
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
