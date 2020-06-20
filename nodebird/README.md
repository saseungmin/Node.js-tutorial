# ✔️ 익스프레스로 SNS 서비스 만들기
- 프로젝트 기본 설정
<pre>
// package.json 설치
$ npm init
// 시퀄라이즈 설치
$ npm i -g sequelize-cli
$ npm i sequelize mysql2
$ sequelize init
</pre>
- 루트 폴더에 app.js파일 생성과 템플릿 파일을 넣을 views 폴더와 라우터를 넣을 routes 폴더, 정적 파일을 넣을 public 폴더를 생성한다.
- 템플릿 엔진인 pug 설치
<pre>
$ npm i express cookie-parser express-session morgan connect-flash pug
$ npm i -g nodemon
$ npm i -D nodemon
</pre>
- nodemon 모듈로 서버를 자동으로 재시작한다.(개발용으로만 권장)

- `dotenv`를 사용하여 `cookieParser`와 `express-session`의 비밀키는 직접 하드코딩하지 않는다.
- 키를 하드코딩하면 소스 코드가 유출되었을 떄 키도 같이 유출되므로 별도로 관리해야한다.
<pre>
$ npm i dotenv
</pre>
- `.env` 파일 생성
<pre>
COOKIE_SECRET=비밀키
</pre>
#### 🔸 view 단 만들기
- views 폴더

##  🌈 데이터베이스 세팅
- MySQL과 시퀄라이즈로 데이터베이스 설정
