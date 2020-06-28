# ✔ Web Socket 으로 실시간 데이터 전송
### 📌 참고 문서
> - 웹 소켓 설명 : https://ko.wikipedia.org/wiki/%EC%9B%B9%EC%86%8C%EC%BC%93
> - WS 공식 문서 : https://www.npmjs.com/package/ws
> - Socket.IO 공식 문서 : https://socket.io/

## 🌈 웹 소켓이란?
- HTML5에서 새로 추가된 스펙으로 실시간 양방향 데이터 전송을 위한 기술
- WS라는 프로토콜을 사용하여 브라우저와 서버가 WS 프로토콜을 지원하면 사용할 수 있다.
- 웹 소켓이 나오기 이전에는 HTTP 기술을 사용하여 실시간 데이터 전송을 구현하였다. (**폴링(polling)** 방식)
- 폴링 방식은 HTTP가 클라이언트에서 서버로 향하는 단방향 통신이므로 주기적으로 서버에 새로운 업데이트가 없는지 확인하는 요청을 보내, 있다면 새로운 내용을 가져오는 단순 무식한 방법이다.
- 웹 소켓 연결이 이루어지고 나면 그 다음부터는 계속 연결된 상태로 있어 따로 업데이트가 있는지 요청을 보낸 필요가 없다.
- 또한 HTTP 프로토콜과 포트를 공유할 수 있으므로 다른 포트에 연결할 필요도 없다.
> - 참고로 **서버센트 이벤트(Server Sent Events, 이하 SSE)** 라는 기술도 등장.
> - `EventSource`라는 객체를 사용하여 처음에 한 번만 연결하면 서버가 클라이언트에 지속적으로 데이터를 보내준다.
> - 웹 소켓과 다른 점은 클라이언트에서 서버로는 데이터를 보낼 수 없다는 점으로 서버에서 클라이언트로 데이터를 보내는 단방향 통신이다.
> - 하지만 예를 들어 주식 차트 업데이트나 SNS에서 새로운 게시물 가져오기 등 굳이 양방향 통신을 할 필요가 없는 경우에 서버에서 일방적으로 데이터를 내려줄 때 사용한다.
- `Socket.io`는 웹 소켓을 편리하게 사용할 수 있게 도와주는 라이브러리이다.

## 🌈 ws 모듈로 웹 소켓 사용
1. `npm init` 후 `npm i`
<pre>
  "dependencies": {
    "connect-flash": "^0.1.1",
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "morgan": "^1.10.0",
    "pug": "^3.0.0",
    "socket.io": "^2.3.0",
    "ws": "^7.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
</pre>
2. `.env`에 `COOKIE_SECRET=[쿠키 비밀키]` 작성
3. `app.js`작성 ([주석 참고](https://github.com/saseungmin/Node.js-tutorial/blob/master/gif-chat/app.js))
4. `routes/index.js` 작성
5. `ws` 모듈을 설치하여 노드에 웹 소켓 구현
<pre>
$ npm i ws
</pre>
6. `app.js`에 웹 소켓을 익스프레스 서버에 연결하는 부분 작성
7. 웹 소켓 로직이 들어있은 `socket.js` 작성 ([주석 참고](https://github.com/saseungmin/Node.js-tutorial/blob/master/gif-chat/socket.js))
8. 양방향 통신이기 때문에 script 부분에 웹소켓 `views/index.pug` 작성 (클라이언트 부분, [주석 참고](https://github.com/saseungmin/Node.js-tutorial/tree/master/gif-chat/views))

## 🌈 Socket.IO 사용
- 구현하고자 하는 서비스가 복잡해지면 Socket.IO를 사용하는 것이 편하다.
<pre>
$ npm i socket.io
</pre>
1. `socketio.js` 작성([주석 확인](https://github.com/saseungmin/Node.js-tutorial/blob/master/gif-chat/socketio.js))
2. `index.pug` 수정([주석 확인](https://github.com/saseungmin/Node.js-tutorial/tree/master/gif-chat/views))
- Socket.IO는 기본적으로 먼저 **폴링 방식으로 서버와 연결**한다.
- 그렇기 때문에 코드에서 HTTP 프로토콜을 사용한 것이다.

![polling](./img/1.PNG)
- 폴링 연결 후, 웹 소켓을 사용할 수 있다면 웹 소켓으로 업그레이드 한다.
- 웹 소켓을 지원하지 않는 브라우저는 폴링 방식으로, 웹 소켓을 지원하는 브라우저는 웹 소켓 방식으로 사용 가능한 것이다.
- 처음부터 웹 소켓만을 사용하고 싶을 땐, 클라이언트에서 옵션을 수정해준다.
<pre>
var socket = io.connect('http://localhost:8005',{
    // 서버의 path 옵션과 동일해야 한다.
    path:'/socket.io',
    <b>transports:['websocket']</b>
});
</pre>

![websocket](./img/2.PNG)