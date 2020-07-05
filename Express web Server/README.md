# ✔ 익스프레스 웹 서버 만들기
### 📌 참고 문서
> - Pug 템플릿 문법 정리 : https://jeong-pro.tistory.com/65
## ✒ Express-generator
- *Express-generator*는 익스프레스 프레임워크에 필요한 *package.json*을 만들어주고 기본 폴더 구조까지 잡아주는 패키지이다.
<pre>
// 전역으로 설치
$ npm i -g express-generator
</pre>
- 원하는 폴더에 콘솔에 명령어
<pre>
$ express [프로젝트 이름] <b>--view=pug</b>   => (템플릿 엔진)
</pre> 
- 해당 프로젝트로 이동후 npm 모듈 설치
<pre>
$ cd [프로젝트 이름] && npm i
</pre>
#### 📌 폴더 구조
> - app.js 파일은 핵심적인 서버 역할을 한다.
> - bin폴더의 www파일은 서버를 실행하는 스크립트이다.
> - public 폴더는 외부에서 접근 가능한 파일들로 이미지, 자바스크립트, CSS 파일들이 들어있다.
> - routes 폴더는 주소별 라우터들을 모아둔 곳이고, views 폴드는 템플릿 파일을 모아둔 곳이다.

## ✒ 익스프레스 구조
- bin/www 폴더는 http 모듈에 express 모듈을 연결하고, 포트를 지정하는 부분이다.
- www 파일은 js 확장자가 붙지 않고, `#!/usr/bin/env node`라는 주석이 첫 줄에 달려있다.
- 콘솔 명령어로 www파일을 만들때 사용한다.
- `app.set('port', port)`로 서버가 실행될 포트를 설정한다.
<pre>
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
</pre>

#### 🔸 app.js 모듈
- `var app = express();`는 express 패키지를 호출하여 app 변수 객체를 만든다.
- `app.set`메서드로 익스프레스 앱을 설정할 수 있다.
- `app.use`로 미들웨어를 연결한다.
- `module.exports`로 app 객체를 모듈로 만듬으로써 bin/www 에서 사용된 app 모듈이다.

## ✒ 미들웨어
- 요청과 응답의 중간에 위치한다.
- 미들웨어는 주고 `app.use`와 함께 사용한다.
- 미들웨어 안에서 `next()`를 호출해야 다음 미들웨어로 넘어간다.
- 만약 `next()`를 호출안하면 다음 미들웨어로 넘어가지 않아 계속 로딩된다.
- `http-errors(createError)` 패키지로 에러를 만드는 미들웨어 생성할 수 있다.
- 에러 핸들링 미들웨어는 일반적으로 미들웨어 중에서 제일 아래에 위치하여 위에 있는 미들웨어에서 발생하는 에러를 받아서 처리한다.
- 하나의 use에 미들웨어를 여러 개 장작할 수 있다. (순서대로 실행)
<pre>
app.use('/', function(req, res, next) {
    console.log('1');
    next();
}, function(req, res, next){
    console.log('2');
    next();
},function(req, res, next){
    console.log('3');
    next();
})
</pre>

### 🔶 [morgan](https://www.npmjs.com/package/morgan)
- 콘솔에 나오는 `GET / 304 303.636 ms - -` 같은 로그는 `morgan` 미들웨어에서 나온다.
- 요청에 대한 정보를 콘솔에 기록해준다.
<pre>
var logger = require('morgan');
app.use(logger('dev')); // short, common, combined 사용가능..
</pre>

### 🔶 [body-parser](https://www.npmjs.com/package/body-parser)
- 요청의 본문을 해석해주는 미들웨어로 폼 데이터나 AJAX 요청의 데이터를 처리한다.
- express에 일부 기능이 내장되어있다.
<pre>
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // JSON 형식의 데이터 전달 방식
app.use(bodyParser.urlencoded({ extended: false })); //extended: false일 때, querystring 모듈을 사용하여 해석한다. <br> // true 이면 qs 모듈로 사용
app.use(bodyParser.raw()); // 본문이 버퍼 데이터일 때
app.use(bodyParser.text()); // 본문이 텍스트 데이터일 때
</pre>

### 🔶 [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- 요청에 동봉된 쿠키를 해석해준다.
<pre>
var cookieParser = require('cookie-parser');
app.use(cookieParser());
</pre>
- 해석된 쿠키들은 `req.cookies` 객체에 들어간다.
- 첫번째 인자에 문자열을 넣을 수 있는데 서명된 쿠키가 있는 경우, 제공한 문자열을 키로 삼아 복호화할 수 있다.

### 🔶 [static](https://www.npmjs.com/package/static)
- 정적인 파일들을 제공하는 미들웨어지만 4.16.0 버전에서는 `body-parser`의 일부분이 내장되어 있다.
- 익스프레스를 설치하면 따라오므로 따로 설치할 필요가 없다.
<pre>
app.use(express.static(path.join(__dirname, 'public')));
</pre>
- 함수의 인자로 정적 파일들이 담겨 있는 폴더를 지정하면 된다. (public/stylesheets/style.css => `http://localhost:3000/stylesheets/style.css`)
- static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당 파일을 전송한다.
- 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치하는 것이 좋다. (morgan 다음 위치)

### 🔶 [express-session](https://www.npmjs.com/package/express-session)
- 세션 관리용 미들웨어로 로그인 등을 세션을 구현할 때 유용하다.
- *express-generator*로는 설치되지 않아 직접 설치해야 한다.
<pre>
$ npm i express-session
</pre>
- 인자로 세션에 대한 설정을 받는다.
- `resave`는 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정이다.
- `saveUninitialized`는 세션에 저장할 내역이 없더라도 세션에 저장할지에 대한 설정이다. (보통 방문자 추적)
- `secret`은 필수 항목으로 `cookie-parser`의 비밀키와 같은 역할을 한다.
<pre>
app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitialized:false,
  secret:'secret code',
  cookie:{
    httpOnly:true, // 클라이언트에서 쿠키를 확인하지 못한다.
    secure:false, // https가 아닌 환경에서도 사용할 수 있다.
  }
}))
</pre>
- *express-session*은 세션 관리 시 클라이언트에 쿠키를 보낸다.
- 안전하게 쿠키를 전송할려면 쿠키에 서명을 추가하고 쿠키를 서명하는 데 secret의 값이 필요하고 cookie-parser의 secret과 같게 설정해야 한다.
- 쿠키의 `store` 옵션은 데이터베이스를 연결하여 세션을 유지하게 한다. (Redis)
- *express-session*은 req.session 객체를 만들고 세션을 삭제할려면 req.session.destroy() 메서드를 호출한다.

### 🔶 [connect-flash](https://www.npmjs.com/package/connect-flash)
- 일회성 메시지들을 웹 브라우저에서 나타낼때 사용한다.
<pre>
$ npm i connect-flash
</pre>
- `cookie-parser`와 `express-session`을 사용하므로 뒤에 위치해야 한다.
<pre>
var flash = require("connect-flash");
app.use(flash());
</pre>
- routers/users.js 참고
- 처음 리다이렉트하면 flash 메시지는 보이지만 다시 새로고침하면 flash 메시지가 안보인다. (일회성)

## ✒ Router 객체로 라우팅 분리
- use 대신 get, post, put, patch, delete 같은 HTTP 메서드를 사용할 수 있다.
- `app.use('/', function(req, res, next){});`
- router 객체는 `express.Router()`로 만들어졌고 마지막에는 `module.exports = router`로 모듈을 만든다.
- 라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 한다.
- next 함수에는 라우터에서만 동작하는 특수 기능인 `next('route')`로 라우터에 연결된 나머지 미들웨어들을 건너뛰고 싶을 때 사용한다.
- 주소에 `:id`는 다른 값을 넣어서 사용할 수 있다. (`/users/1` , `/users/123`)
<pre>
// :id 면 req.params.id로 조회한다.
router.get('/users/:id', function(req, res){
  console.log(req.params, req.query);
}
</pre>
- `/users/123?limit=5&skip=10` 이면 `req.params`와 `req.query`객체는 `{id : '123'} {limit : '5', skip : '10'}`
- 단 주의할 점은 일반 라우터보다 뒤에 위치해야한다.
- 에러가 발생하지 않으면 라우터는 요청을 보낸 클라이언트에게 응답을 보내주어야 한다.
  - `send`는 버퍼 데이터나 문자열을 전송하거나, HTML 코드를 전송하고, JSON 데이터도 전송할 수 있다.
  - `sendFile`은 파일을 응답으로 보내주는 메서드이다.
  - `json`은  JSON 데이터를 보내준다.
  - `redirect`는 응답을 다른 라우터로 보낸다.
  - 기본적으로 200 HTTP 상태 코드와 res.redirect는 302 이지만 직접 바꿀 수 있다. 
  - `render` 메서드는 템플린 엔진을 렌더링할 때 사용한다.
- 요청을 처리할 수 있는 라우터가 없다면 다음 미들웨어로 넘어간다. (404 HTTP 상태 코드를 만들고 에러 처리 미들웨어로 넘긴다.)
<pre>
// 404 처리 미들웨어
app.use(function (req, res, next) {
  next(createError(404));
});
</pre>

## ✒ 템플릿 엔진
- 자바스크립트를 사용해서 HTML을 렌더링할 수 있게 해준다.
- 대표적으로 [*Pug(Jade)*](https://pugjs.org/api/getting-started.html) 와  [*EJS*](https://ejs.co/)가 있다.
<pre>
// app.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
</pre>
- routes/index.js
- `layout.pug`와 `index.pug`의 title 부분이 모드 `Express`로 치환된다.
<pre>
router.get('/', function(req, res, next) {
  // 익스프레스가 res 객체에 추가한 템플릿 렌더링을 위한 메서드이다.
  res.render('index', { title: 'Express' });
});
</pre>
- *EJS*는 *Pug*의 HTML 문법 변화에 적응하기 힘들때 사용하는 템플릿 엔진으로 HTML 문법을 그대로 사용하되 추가로 자바스크립트 문법을 사용할 수 있다.
- 자바의 JSP와 문법이 상당히 유사하다.
<pre>
// app.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
</pre>
- `$ npm i ejs` *ejs* 패키지 설치
- *EJS*는 *Pug*의 layout과 block은 지원하지 않는데 사용할려면 `express-ejs-layouts` 패키지를 설치해야한다.
- 이외의 템플릿으로 *Nunjucks*, *Hogan*, *Dust*, *Twig*, *Vash* 등이 있다.
