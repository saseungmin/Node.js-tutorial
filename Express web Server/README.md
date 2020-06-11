# ✔ 익스프레스 웹 서버 만들기

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