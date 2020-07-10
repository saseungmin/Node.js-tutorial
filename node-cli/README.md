# ✔ CLI(Command Line Interface) 프로그램 만들기
- *npm*, *nodemon*이나 *express-generator*와 같이 커맨드라인 인터페이스(*Command Line Interface*) 기반으로 동작하는 노드 프로그램들
- CLI는 콘솔 창에 통해서 프로그램을 수행하는 환경을 뜻한다. (반대 GUI)
- ex) 리눅스의 셸이나 브라우저의 콘솔, 명령 프롬프트
## 🌈 간단한 콘솔 명령어 만들기
- `$ npm init`으로 *package.json* 생성하기
- index.js의 첫번째 주석은 리눅스나 맥 같은 유닉스 기반 운영체제에서는 `/usr/bin/env`에 등록된 `node`명령어로 이 파일을 실행하라는 뜻이다.
- 윈도우에서는 단순한 주석으로 취급한다.
<pre>
#! /usr/bin/env node
console.log('Hello CLI');
</pre>
#### index.js를 CLI 프로그램으로 만들기
- *package.json*에 추가
- bin 속성이 콘솔 명령어와 해당 명령어 호출 시 실행 파일을 설정하는 객체이다.
- 콘솔 명령어는 cli, 실행파일은 index.js로 지정
<pre>
  "bin": {
    "cli": "./index.js"
  }
</pre>
- 콘솔에서 현재 패키지를 전역으로 설치
<pre>
$ npm i -g
</pre>
- 콘솔에 `cli`를 입력하면 index.js가 실행된다.
<pre>
$ cli
Hello CLI
</pre>