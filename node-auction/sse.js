// SSE 모듈 불러오기
const SSE = require('sse');

module.exports = (server) => {
  // new SSE(익스프레스 서버)로 서버 객체 생성
  const sse = new SSE(server);
  // 라우터에서 SSE를 사용할때 app.set 메서드로 client를 등록하고 req.app.get 메서드로 가져오면 된다.
  sse.on('connection', (client) => {
    // 클라이언트와 연결시 어떤 동작을 할지 정의할 수 있다.
    // 1초마다 클라이언트에게 서버 시간 타임스탬프를 보낸다.
    setInterval(() => {
      // 단, 문자열만 보낼 수 있다.
      client.send(Date.now().toString());
    }, 1000);
  });
};
