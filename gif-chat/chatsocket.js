const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // 라우터에서 io 객체를 쓸 수 있게 저장해둔다. req.app.get('io')으로 접근 가능
  app.set('io', io);
  // Socket.IO에 네임스페이스를 부여하는 메서드
  // Socket.IO는 기본적으로 / 네임스페이스에 접속하지만, of 메서드를 사용하면 다른 네임스페이스를 만들어 접속할 수 있다.
  // 같은 네임스페이스끼리만 데이터를 전달한다.
  const room = io.of('/room');
  const chat = io.of('/chat');
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
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?.+/, '');
    // 방에 들어올때
    socket.join(roomId);
    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      // 방에서 나갈때
      socket.leave(roomId);
    });
  });
};
