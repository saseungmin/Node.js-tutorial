# ✔ 노드의 기본 기능들
## ✒ 노드 내장 객체
### 🔶 global
- 브라우저의 window와 같은 전역 객체이다.
- global은 생략이 가능하다.
<pre>
$ node
> global
// 결과
Object [global] {
  global: [Circular],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Function]
  },
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Function]
  }
}
</pre>

### 🔶 console

- <code>console.time(레이블)</code> : <code>console.timeEnd(레이블)</code> time과 timeEnd 사이의 시간을 측정한다.
- <code>console.log()</code>
- <code>console.error()</code> : 에러 내용 콘솔에 표시
- <code>console.dir(객체, 옵션)</code> : 객체를 콘솔에 표시할 때 사용한다. colors를 true로 하면 콘솔에 색이 추가되어 보여지고, depth는 객체 안의 객체를 몇 단계까지 보여줄지를 결정한다.
<pre>
console.dir(obj,{colors:true, depth:2})
</pre>
- <code>console.trace(레이블)</code> : 에러가 어디서 발생했는지 추적할 수 있게 해준다.

### 🔶 타이머
- <code>setTimeout(콜백 함수, 밀리초)</code>
<pre>
setTimeout = setTimeout(() => {
  console.log('1.5초뒤 실행')
},1500)
</pre> 

- <code>setInterval(콜백 함수, 밀리초)</code> : 주어진 밀리초마다 콜백 함수를 반복 실행한다.
- <code>setImmediate(콜백 함수)</code> : 콜백 함수를 즉시 실행한다.
- <code>clear[Timeout,Interval,Immediate] (아이디)</code> : 취소한다.

📌 setImmediate(콜백)과 setTimeout(콜백,0)
- 파일 시스템 접근, 네트워킹 같은  I/O 작업의 콜백 함수 안에서 타이머를 호출하는 경우 <code>setImmediate</code>는  <code>setTimeout(콜백,0)</code>보다 먼저 실행된다.
- 하지만 항상 먼저 실행되지는 않는다.

### 🔶 파일 경로
<pre>
console.log(__filename); // C:\Users\seung\nodejs-study\노드의 기본 기능\filename.js
console.log(__dirname); // C:\Users\seung\nodejs-study\노드의 기본 기능
</pre>

### 🔶 process

1. process.env
- 시스템의 환경 변수
- 중요한 비밀번호를 적용할때도 사용한다
<pre>
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE;
</pre>

2. process.nextTick(콜백)
- 이벤트 루프가 다른 콜백 함수들보다 <code>nextTick</code>의 콜백 함수를 우선으로 처리하도록 만든다.
- <code>setImmediate</code>나 <code>setTimeout</code>보다 먼저 실행된다.
- <code>Promise.resolve()</code>된 것도 다른 콜백들보다 우선시 된다.
- <code>process.nextTick</code>과 <code>Promise</code>를 [마이크로태스크](https://ko.javascript.info/microtask-queue)라고 부른다.

3. process.exit()
- 실행 중인 노드 프로세스를 종료한다.
- 서버에 이 함수를 사용하면 서버가 멈추므로 서버에는 거의 사용하지 않는다.
- 서버 외 독립적인 프로그램에서는 수동으로 노드를 멈추게 하기 위해 사용한다.

## ✒ 노드 내장 모듈
- 📌 공식 문서 : https://nodejs.org/dist/latest-v12.x/docs/api/
- [os 모듈](https://nodejs.org/dist/latest-v12.x/docs/api/os.html)
- [path](https://nodejs.org/dist/latest-v12.x/docs/api/path.html)
  - 폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈
- [url](https://nodejs.org/dist/latest-v12.x/docs/api/url.html)
  - WHATWG방식의 url과 노드에서 사용하던 방식의 url이 존재한다.
- [querystring](https://nodejs.org/dist/latest-v12.x/docs/api/querystring.html)
  - WHATWG 방식의 url 대신 기존 노드의 url을 사용할 때 search 부분을 사용하기 쉽게 객체로 만드는 모듈이다.
- [crypto](https://nodejs.org/dist/latest-v12.x/docs/api/crypto.html)
  - 다양한 방식의 암호화를 도와주는 모듈이다.
  - 🎈 단방향 암호화(해시) hash.js 주석 참고
  - 🎈 양방향 암호화 cipher.js 주석 참고
- [util](https://nodejs.org/dist/latest-v12.x/docs/api/util.html)
  - `util.deprecate` : 함수가 deprecate 처리되었음을 알려준다. 첫 번째 인자로 넣은 함수를 사용했을 때 경고 메시지가 출력되고 두 번째 인자에는 경고 메시지 내용을 넣어준다.
  <pre>
  const dontUse = util.deprecate((x,y) => {
    console.log(x+y);
  }, '쓰지마세요.');
  dontUse(1,2);
  </pre>
  - `util.promisify` : 콜백 패턴을 프로미스 패턴으로 바꿔준다. `async/await` 패턴까지 사용할 수 있다.   <br>
  <br>
  <pre>
  const randonBytesPromise = util.promisify(crypto.randomBytes);
  randonBytesPromise(64)
    .then((buf) => {
      console.log(buf.toString('base64'));
    })
    .catch((error) => {
      console.log(error);
    })
  </pre>