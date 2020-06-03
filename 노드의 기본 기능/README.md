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