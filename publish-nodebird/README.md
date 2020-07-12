# ✔️ AWS와 GCP로 배포하기
- nodebird 배포하기
## 🌈 서비스 운영을 위한 패키지
- 서비스를 출시한 이후에 서버에 문제가 생기면 서비스 자체에 문제가 된다.
- 또한, 서비스의 취약점을 노린 공격이 들어온다.
### 🔸 morgan과 express-session
- 익스프레스 미들웨어 중 일부가 개발용으로 설정되어 있기 때문에 배포용으로 설정헤준다.
- `process.env.NODE_ENV`는 배포 환경인지 개발 환경인지 판단할 수 있는 환경 변수이다.
- 배포 환경일 때는 `morgan`을 `combined` 모드로 사용하고, 개발 환경일 때는 `dev` 모드로 사용한다.
- `combined` 모드는 `dev` 모드에 비해 더 많은 사용자 정보를 로그로 남긴다.
<pre>
if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
}else{
  app.use(morgan('dev'));
}
</pre>
- `process.env.NODE_ENV`는 `.env`에 넣을 수 없다.
- 이유는 개발 환경인지 배포 환경인지에 따라 값이 변해야 하는데, `.env` 파일은 정적 파일이기 때문이다.
- `NODE_ENV`를 `cross-env`를 사용해서 동적으로 바꿀 수 있다.
- `express-session`을 배포용으로 설정해준다.
<pre>
if(process.env.NODE_ENV === 'production'){
  sessionOption.proxy = true;
  //sessionOption.cookie.secure = true;
}
</pre>
- 배포환경일 때는 `proxy`를 `true`로, `cookie.secure`를 `true`로 바꿔준다.
- 하지만 무조건적이진 않고, https를 적용할 경우에만 사용하면 된다.
- `proxy`를 `true`로 적용할 경우에는 https 적용을 위해 노드 서버 앞에 다른 서버를 두었을 때이다.
- `cookie.secure` 또한, https 적용이나 로드밸런싱드을 위해 `true`로 바꿔준다.

### 🔸 sequelize
- 데이터베이스도 배포 환경으로 설정해준다.
- 시퀄라이즈에서 가장 큰 문제는 비밀번호가 하드코딩되어 있따는 점으로 JSON 파일이므로 변수를 사용할 수 없다.
- 하지만 시퀄라이즈는 JSON 대신 JS 파일을 설정 파일로 쓸 수 있게 지원한다.
- config 파일에서 config.json 삭제 후 config.js로 생성(js 파일이면 `dotenv`모듈 사용가능)
<pre>
  production: {
    username: 'root',
    password: <b>process.env.SEQUELIZE_PASSWORD</b>,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false,
  },
</pre>
- 쿼리를 수행할 때마다 콘솔에 SQL문이 노출이 되기 때문에, 배포 환경에서는 수행되는지를 숨겨야 한다.
<pre>
logging: false
</pre>
- `.env` 파일에 데이터베이스 비밀번호 입력한다.
<pre>
SEQUELIZE_PASSWORD:[데이터베이스 비밀번호]
</pre>
- 배포 환경에서 데이터베이스에 한글이 저장되지 않는 문제가 발생할 수도 있다.
<pre>
// model/..
    {
      timestamps: true,
      paranoid: true,
      <b>charset: 'utf8',
      collate: 'utf8_general_ci',</b>
    },
</pre>

### 🔸 cross-env
- `croos-env`를 사용하면 동적으로 `process.env`를 변경할 수 있다.
- 또한, 모든 운영체제에서 동일한 방법으로 변경할 수 있게 된다.
#### 📌 Linux, MacOS
<pre>
// package.json
  "scripts": {
    // 배포 환경 / 스크립트 실행시 process.env를 동적으로 설정하는 방법
    "start": "NODE_ENV=production PORT=80 node app",
    // 개발 환경
    "dev": "nodemon app"
  },
</pre>

#### 📌 window OS
- 위와 같은 방법이 window에서는 안되기 때문에 cross-env를 사용한다.
<pre>
// console
$ npm i -g cross-env && npm i cross-env
// package.json
  "scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 node app",
    "dev": "nodemon app"
  },
</pre>

### 🔸 retire
- 패키지에서 취약점이 발견된 경우에는 패키지에 문제는 없는지 확인해 보아야 한다.
- 이를 위해 retire 패키지를 전역 설치한다.
<pre>
$ npm i -g retire
$ retire
// 문제가 있는 패키지가 있다면 콘솔에 내용이 출력된다.
</pre>

#### 📌 npm audit
- npm 5.10부터 npm audit이라는 명령어가 추가되었다.
- npm install을 할 때 자동으로 취약점을 검사하고 npm audit fix를 입력하면 npm이 수정할 수 있는 오류는 자동으로 수정해준다.
- 때문에, npm 5.10 이상이면 retire 패키리를 사용하지 않아도 된다.

### 🔸 pm2
- pm2는 원활한 서버 운영을 위한 패키지이다.
- 가장 큰 기능은 서버가 에러로 인해 꺼졌을 때 서버를 다시 켜주는 것이다.
- 또한, 멀티 쓰레딩은 아니지만 멀티 프로세싱을 지원하여 노드 프로세스 개수를 1개 이상으로 늘릴 수 있다.
- 노드는 클라이언트로부터 요청이 왔을 때 요청을 여러 노드 프로세스에 고르게 분배한다.
- 단점은 멀티 쓰레딩이 아니므로 서버의 메모리 같은 자원을 공유하지는 못한다.
- 예를 들어 로그인 후 새로고침을 반복했을 때, 세션 메모리가 있는 프로세스로 요청이 거묜 로그인 상태가 되고, 세션 메모리가 없는 프로세스로 요청이 가면 로그인이 안 된 상태가 된다.
- 이를 위해서 `Memcached`나 레디스(`Redis`) 같은 서비스를 사용한다.
- 콘솔에 pm2를 전역 설치한다.
<pre>
$ npm i -g pm2 && npm i pm2
</pre>
- nodemon 대신 pm2를 쓰도록 npm start 스크립트를 수정한다.
<pre>
  "scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 <b>pm2 start app.js</b>",
    "dev": "nodemon app"
  },
</pre>
- 그리고 `npm start`로 명령어 실행.
- pm2를 사용시 다른 node나 nodemon 명령어로 실행했을 때와 다르게 노드 프로세스가 실행되면서 콘솔에 다른 명령어를 입력할 수 있다.
- pm2가 노드 프로세스를 백그라운드로 돌린다.
- 리눅스나 맥에서 pm2 실행 시 1024번 이하의 포트를 사용할려면 관리자 권한이 필요하기 때문에 sudo 명령어를 사용해서 실행한다.
- 백그라운드로 돌고 있는 노드 프로세스를 확인할려면 `pm2 list`를 콘솔에 명령어를 치면 된다.
![pm2list](./img/1.PNG)
- pm2 프로세스를 종료할려면 콘솔에 `pm2 kill`을 입력한다.
- 서버를 재시작할려면 `pm2 reload all`을 입력한다. (다운타임(서버가 중지되어 클라이언트가 접속할 수 없는 시간)이 거의 없어서 서버가 재시작되어 좋다.)

- 노드의 `cluster`모듈처럼 클러스터링 가능하게 하는 pm2의 클러스터링 모드를 사용
- `-i`뒤에 오는 숫자는 생성하기 원하는 프로세스 개수를 기입하면 된다.
- 0은 cpu 코어 개수만큼 프로세스를 생성한다는 뜻이고, -1은 프로세스를 CPU 코어 개수보다 한개 덜 생성하겠다는 뜻이다.
<pre>
  "scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js <b>-i 0</b>",
    "dev": "nodemon app"
  },
</pre>
- 서버를 종료한 뒤 변경된 명령어 사용하기 위해 서버 실행
<pre>
$ pm2 kill && npm start
</pre>
![cluster](./img/2.PNG)

- 현재 프로세스를 모니터링하기
<pre>
$ pm2 monit
</pre>
![monit](./img/3.PNG)