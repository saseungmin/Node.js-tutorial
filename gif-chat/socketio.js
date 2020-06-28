const SocketIO = require('socket.io');

module.exports = (server) => {
  // 두 번째 인자로 옵션 객체에 클라이언트와 연결할 수 있는 경로를 의미하는 path 옵션 사용
  const io = SocketIO(server, { path: '/socket.io' });

  // 접속했을 때, 콜백으로 소켓 객체(socket)
  io.on('connection', (socket) => {
    // socket.request 요청 객체에 접근
    // socket.request.res 로 응답 객체에 접근 가능
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // socket.id : 소켓 고유의 아이디를 가져온다.
    console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
    // 접속 해제
    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    // 에러 시 발생 이벤트 리스너
    socket.on('error', (error) => {
      console.error(error);
    });
    // 사용자가 직접 만든 이벤트 (클라이언트에서 reply라는 이벤트명으로 데이터를 보낼 때 서버에서 받는 부분)
    socket.on('reply', (data) => {
      console.log(data);
    });
    socket.interval = setInterval(() => {
      // 3초 마다 emit 메서드로 클라이언트 한 명에게 메시지를 보낸다.
      // 첫 번째 인제는 이벤트 이름, 두 번째 인자는 데이터이다.
      socket.emit('news', 'Hello client');
    }, 3000);
  });
};
