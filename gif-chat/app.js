const express = require('express');
const cookieParser = require('cookie-parser');
// 로그 기록을 남긴다.
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
// 일회성 메시지를 웹 브라우저에 나타낼 떄 사용
const flash = require('connect-flash');
// 세션아이디를 HEX 형식의 색상 문자열로 바꾼다.
const ColorHash = require('color-hash');
require('dotenv').config();

// ws 모듈 사용
//const webSocket = require('./socket');
// socket.io 사용
const webSocket = require('./chatsocket');
const indexRouter = require('./routes');
// mongoose 스키마 연결
const connect = require('./schemas');

const app = express();
connect();

// socket.IO session 미들웨어
const sessionMiddleware = session({
  resave: false, // 재저장을 계속 할 것인지
  saveUninitialized: false, // 세션이 세션store에 저장되기전 Uninitialized 된 상태로 만들어서 저장을 안 시킨다.
  secret: process.env.COOKIE_SECRET, // 비밀키 저장
  // 세션과 쿠키 함께 사용
  cookie: {
    httpOnly: true,
    secure: false,
  },
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8005);

// 개발 시 사용(dev, short)
// 배포 시 common이나 combined
app.use(morgan('dev'));
// public 정적 파일 제공 미들웨어
app.use(express.static(path.join(__dirname, 'public')));
// BodyParser HTTPpost put 요청시 request body 에 들어오는 데이터값을 읽을 수 있는 구문으로 파싱함과
// 동시에 req.body 로 입력해주어 응답 과정에서 요청에 body 프로퍼티를 새로이 쓸 수 있게 해주는 미들웨어
// https://velog.io/@yejinh/express-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4-bodyParser-%EB%AA%A8%EB%93%88#urlencoded-extended-false- 참고
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// dotenv를 사용해서 쿠키 비밀키 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
// https://dalkomit.tistory.com/72 session 참고
app.use(sessionMiddleware);
app.use(flash());
// colorHash를 이용하여 session.color에 Hex값 부여
app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', indexRouter);

// 404 미들웨어
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  console.error(err);
  next(err);
});

// error handler 미들웨어
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 8005에 연결
const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// 웹 소켓을 익스프레스 서버에 연결
// express-session 공유
webSocket(server, app, sessionMiddleware);
