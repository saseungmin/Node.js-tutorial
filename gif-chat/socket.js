const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  // connection 이벤트는 클라이언트가 서버와 웹 소켓 연결을 맺을 때 발생한다.
  wss.on('connection', (ws, req) => {
    // 클라이언트의 IP를 알아내는 유명한 방법 중 하나
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip);
    // 클라이언트로부터 메시지가 왔을 때 발생
    ws.on('message', (message) => {
      console.log(message);
    });
    // 에러가 생겼을 때 발생
    ws.on('error', (error) => {
      console.error(error);
    });
    // 클라이언트와 연결이 끊겼을 때 발생
    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);
      // 메모리 누수가 발생하지 않도록 clearInterval로 정리 
      clearInterval(ws.interval);
    });
    // 3초 마다 연결된 모든 클라이언트에게 메시지를 보낸다.
    const interval = setInterval(() => {
      // readyState가 OPEN 상태인지 확인 (CONNECTING, OPEN, CLOSING, CLOSED)
      // OPEN 상태일 때만 에러 없이 메시지를 전송할 수 있다.
      if (ws.readyState === ws.OPEN) {
        // ws.send 메서드로 하나의 클라이언트에게 메시지를 전송한다.
        ws.send('서버에서 클라이언트로 메시지를 보낸다.');
      }
    }, 3000);
    ws.interval = interval;
  });
};
