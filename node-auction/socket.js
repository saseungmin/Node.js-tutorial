const SocketIO = require('socket.io');

// 입찰 정보를 올리기 위해 사용
module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });

  app.set('io', io);

  io.on('connection', (socket) => {
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer.split('/')[referer.split('/').length - 1];
    // 해당 경매방에 입장
    socket.join(roomId);
    socket.on('disconnect', () => {
      socket.leave(roomId);
    });
  });
};
