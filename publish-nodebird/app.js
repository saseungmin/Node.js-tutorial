const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
// passport 모듈 연결
const passport = require('passport');
// 서버의 각종 취약점을 보완해주는 패키지
const helmet = require('helmet');
const hpp = require('hpp');
// connect-redis 패키지로 부터 RedisStore 객체를 require하고, 이때 session을 인자로 넣어서 호출한다.
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

// 모델을 서버와 연결
const { sequelize } = require('./models');
// passpoart 모듈 연결
const passportConfig = require('./passport');
// winston logger 파일 서버와 연결
const logger = require('./logger');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8010);

// morgan 요청에 대한 정보를 콘솔에 기록해준다.
// combined은 배포용 dev는 개발용
//process.env.NODE_ENV는 배포 환경인지 개발 환경인지 판단할 수 있는 환경 변수
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  // 서버의 취약점 보완 패키지
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
// 업로드한 이미지를 제공할 라우터
app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// dotenv를 사용해서 쿠키 비밀키 사용
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  // express-session 미들웨어에 store 옵션을 추가한다
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};
// express-session 배포용으로 설정
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  //sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(flash());
// passport 모듈 연결
// 요청(req 객체)에 passport 설정을 심는다.
app.use(passport.initialize());
// req.session 객체에 passport 정보를 저장한다.
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

// 404 미들웨어
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  // winston 로그 남기기
  logger.info('hello');
  logger.error(err.message);
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

// 8002에 연결
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
