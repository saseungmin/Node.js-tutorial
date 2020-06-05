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

## ✒ 파일 시스템 접근하기

### 🔶 비동기 
- <code>readFile</code>은 Buffer 형식으로 출력되서 `toString()` 을 붙여서 사용한다.
<pre>
const fs = require('fs');
fs.readFile('./readme.txt',(err,data) => {
  if(err){
    throw err;
  }
  console.log(data.toString());
})
</pre>
- `writeFile()` 메서드에 생성될 파일의 경로와 내용을 입력해준다.
<pre>
fs.writeFile('./writeme.txt','글이 입력된다.',(err) => {
  if(err){
    throw err;
  }
})
</pre>

### 🔶 동기
- `readFileSync('./readme.txt');` 메서드를 사용한다.
- `writeFileSync()` 메서드를 사용한다.
- 비동기 파일입출력 메서드를 순서대로(동기) 사용할려면 `readFile()`의 콜백에 다음 `readFile()`을 넣어준다.
- 하지만 콜백 지옥이 나올수 있기 때문에 `Promise`나 `async/await`를 사용한다.

### 🔶 버퍼와 스트림
- 📌 버퍼 참고 문서 : https://nodejs.org/dist/latest-v12.x/docs/api/buffer.html
- `const buffer = Buffer.from('버퍼 변경');` : 문자열을 버퍼로 바꿀 수 있다. length 속성은 버퍼의 크기를 나타낸다.
- `buffer.toString()` : 버퍼를 문자열로 변경한다. 이때 base64나 hex를 인자로 넣으면 해당 인코딩으로 변환 가능하다.
- `Buffer.concat(array)` : 배열 안에 든 버퍼들을 하나로 합친다.
- `const buffer = Buffer.alloc(5)` : 빈 버퍼를 생성한다. 바이트를 인자로 지정해주면 해당 크기의 버퍼가 생성된다.
> 버퍼는 100MB인 파일이 있으면 메모리에 100MB의 버퍼를 만들어야 한다. <br>때문에 버퍼의 크기를 작게 만들어서 여러 번에 나눠서 보내는 방식인 스트림이다.

- 파일을 읽는 스트림 메서드로는 `createReadStream`이 있다.
<pre>
// 읽기 스트림 생성(첫 번째 인자: 파일 경로 / 두 번째 인자 : 옵션 객체로 highWaterMark는 버퍼의 크기를 정할 수 있는 옵션)
const readStream = fs.createReadStream('./readme.txt',{highWaterMark : 16});
const data = [];
//읽기 시작
readStream.on('data',(chunk) => {
  data.push(chunk);
  console.log('data : ',chunk, chunk.length);
});
// 종료
readStream.on('end', () => {
  console.log('end : ',Buffer.concat(data).toString());
});
// 에러
readStream.on('error', (err) => {
  console.log('error : ',err);
})
</pre>

- 파일을 쓰는 스트림 메서드로는 `writeStream`이 있다.
<pre>
// 쓰기 스트림 생성 (첫번째 인자 : 출력 파일명)
const writeStream = fs.createWriteStream('./writeme.txt');
// 파일 쓰기가 종료되면 콜백 함수 호출
writeStream.on('finish', () => {
  console.log('파일 쓰기 완료');
});

writeStream.write('글쓰기');
writeSrteam.write('글쓰기1');
writeStream.end();
</pre>

- 스트림끼리 연결하는 `pipe` 메서드
<pre>
// pipe 시 자동으로 연결되어 데이터가 이동한다.
const readStream = fs.createReadStream('readme.txt');
const writeStream = fs.createWriteStream('write.txt');
readStream.pipe(writeStream);
</pre>

#### 🌈 기타 fs 메서드
- `fs.access(경로, 옵션, 콜백)` : 폴더나 파일에 접근할 수 있는지를 체크한다.
<pre>
// F_OK : 파일 존재 여부, R_OK : 읽기 권한 여부, W_OK : 쓰기 권한 여부
// 파일/ 폴더가 없을 경우 에러 코드는 ENOENT
fs.access('./folder', fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if(err){
    if(err.code === 'ENOENT'){
      console.log('폴더 없음');
    }
  }
})
</pre>

- `fs.mkdir('./folder',(err) => {})` : 폴더를 만드는 메서드
- `fs.open('./folder/file.js','w',(err, fd) => {})` : 파일의 아이디(fd)를 가져오는 메서드로 두번째 인자는 w일때 쓰기, r일 경우 읽기, 기존 파일에 추가하려면 a 이다.
- `fs.rename('./folder/file.js', './folder/new.js', (err) => {})` : 이름을 바꾸는 메서드
- `fs.readdir('./folder',(err,dir) => {})` : 폴더 안의 내용물을 확인할 수 있다.
- `fs.unlink('./folder/new.js',(err) => {})` : 파일을 지울 수 있다.
- `fs.rmdir('./folder',(err) => {})` : 폴더를 삭제할 수 있다.
- `fs.copy('readme1.txt','writeme1.txt', (error) => {})` : `pipe`를 사용하지 않고 파일을 복사할 수 있다.


## ✒ 이벤트
📌 이벤트 참고 문서 : https://nodejs.org/dist/latest-v12.x/docs/api/events.html
<pre>
const EventEmitter = require('events');
const myEvent = new EventEmitter();
</pre>

- `myEvent.on('event', () => {})` : 이벤트 이름과 이벤트 발생 시 콜백을 연결(리스닝)해주고 하나의 이벤트에 여러 개를 달아줄 수 있다.
- `myEvent.addListener('event', () => {})` : on과 같다.
- `myEvent.emit('event')` : 이벤트를 호출하는 메서드이다.
- `myEvent.once('event', () => {})` : 한 번만 실행되는 이벤트로 두번 on(호출)해도 콜백이 한 번만 실행된다.
- `myEvent.removeAllListeners('event')` : 이벤트에 연결된 모든 이벤트 리스너를 제거한다.
- `myEvent.removeListener('event',리스너)` : 이벤트에 연결된 리스너를 하나씩 제거한다.
- `myEvent.off('event',콜백)` : 노드 10버전에 추가되고 `removeListener`와 기능이 같다.
- `myEvent.listenerCount('event')` : 현재 리스너가 몇 개 연결되어 있는지 확인한다.

## 참고 문서 
- fs 프로미스 : https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fspromises_access_path_mode
- [uncaughtException](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_event_uncaughtexception) : 노드 공식문서에서는 최후의 수단으로 사용하라고 한다. `uncaughtException` 이벤트 발생 후 다음 동작이 제대로 동작하는지를 보증하지 않는다.