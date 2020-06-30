const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // 라우터에서 io 객체를 쓸 수 있게 저장해둔다. req.app.get('io')으로 접근 가능
  app.set('io', io);
  // Socket.IO에 네임스페이스를 부여하는 메서드
  // Socket.IO는 기본적으로 / 네임스페이스에 접속하지만, of 메서드를 사용하면 다른 네임스페이스를 만들어 접속할 수 있다.
  // 같은 네임스페이스끼리만 데이터를 전달한다.
  const room = io.of('/room');
  const chat = io.of('/chat');

  // io.use 메서드에 미들웨어 장착
  // 모든 웹 소켓 연결 시마다 실행된다. 세션 미들웨어에 요청 객체, 응답 객체, next함수
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  // /room 네임스페이스에 이벤트 리스너 생성
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  // /chat 네임스페이스에 이벤트 리스너 생성
  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    console.log(req.session);
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?.+/, '');
    // 방에 들어올때
    socket.join(roomId);
    // 특정 방의 클라이언트 단으로 넘겨주기 (join 부분)
    console.log(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });
    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      // 방에서 나갈때
      socket.leave(roomId);
      // socket.adapter.rooms[roomId]에 참여중인 소켓정보가 들어있다.
      const currentRoom = socket.adapter.rooms[roomId];
      // 현재 채팅방에 사람이 있으면 currentRoom.length
      const userCount = currentRoom ? currentRoom.length : 0;
      // 사람이 없으면 채팅룸 제거
      if (userCount === 0) {
        axios
          .delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // 사람이 존재하면 클라이언트 단으로 넘겨주기 (exit 부분)
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};
