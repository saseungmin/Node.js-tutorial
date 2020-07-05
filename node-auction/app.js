const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
// .env 가져오기
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
// 서버와 sse, socket.io 모듈 연결
const sse = require('./sse');
const webSocket = require('./socket');

const app = express();
sequelize.sync();
passportConfig(passport);

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
app.set('port', process.env.PORT || 8010);

// 개발 시 사용(dev, short)
// 배포 시 common이나 combined
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
// BodyParser HTTPpost put 요청시 request body 에 들어오는 데이터값을 읽을 수 있는 구문으로 파싱함과
// 동시에 req.body 로 입력해주어 응답 과정에서 요청에 body 프로퍼티를 새로이 쓸 수 있게 해주는 미들웨어
// https://velog.io/@yejinh/express-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4-bodyParser-%EB%AA%A8%EB%93%88#urlencoded-extended-false- 참고
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// dotenv를 사용해서 쿠키 비밀키 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
// https://dalkomit.tistory.com/72 session 참고
app.use(sessionMiddleware);
// 이작업을 안하면 passport.initialize() middleware not in use 에러가 뜬다
// 이유는 https://velog.io/@cyranocoding/PASSPORT.js-%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0#sessions-optional
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', authRouter);

// 404 미들웨어
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
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

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// webSocket과 연결
webSocket(server, app);
// 서버센트 이벤트와 서버 연결
sse(server);