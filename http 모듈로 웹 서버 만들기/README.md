# ✔️ http 모듈로 웹 서버 만들기
## ✒ 요청과 응답
- 이벤트 리스너를 가진 노드 서버 만들기
- req 객체는 요청에 관한 정보들과 res 객체는 응답에 관한 정보를 담는다.
<pre>
// 콜백 함수로 넣어준다.
const http = require('http');

http.createServer((req, res) => {
    res.write('< h1>hello< /h1>');
    res.end('< p>hello world< /p>')
}).listen(8080, () => {
    console.log('8080연결 대기');
})
</pre>
> 📌 자세한 방법은 [server1.js](https://github.com/saseungmin/Node.js-tutorial/blob/master/http%20%EB%AA%A8%EB%93%88%EB%A1%9C%20%EC%9B%B9%20%EC%84%9C%EB%B2%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0/%EC%9A%94%EC%B2%AD%EA%B3%BC%20%EC%9D%91%EB%8B%B5/server1.js)  참고
- 파일을 읽어와서 html 파일을 전송하는 방법은 `fs.readFile()`을 사용해서 처리한다.
> 📌 자세한 방법은 [server2.js](https://github.com/saseungmin/Node.js-tutorial/blob/master/http%20%EB%AA%A8%EB%93%88%EB%A1%9C%20%EC%9B%B9%20%EC%84%9C%EB%B2%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0/%EC%9A%94%EC%B2%AD%EA%B3%BC%20%EC%9D%91%EB%8B%B5/server2.js)와 [server2.html](https://github.com/saseungmin/Node.js-tutorial/blob/master/http%20%EB%AA%A8%EB%93%88%EB%A1%9C%20%EC%9B%B9%20%EC%84%9C%EB%B2%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0/%EC%9A%94%EC%B2%AD%EA%B3%BC%20%EC%9D%91%EB%8B%B5/server2.html) 참고
<pre>
    fs.readFile('./server2.html', (err, data) => {
        if(err){
            throw err;
        }
        res.end(data);
    });
</pre>

## ✒ 쿠키와 세션
- 쿠키는 name=seung;year=2010 처럼 문자열 형식으로 오므로 이를  {name : 'seung', year:'2020'}와 같이 객체로 바꾸는 함수가 필요하다.
- server3.js `parseCookies`참조
- 쿠키는 `req.headers.cookie`에 담겨있다.
- 응답의 헤더에 쿠키를 기록해야 하므로 `res.writeHead` 메서드를 사용한다
- `res.writeHead`의 첫 번째 인자는 상태 코드를 넣어주고 두 번째 인자에 헤더의 내용을 입력한다.(`"Set-Cookie": "myCookie=test"`)

![쿠키](./img/1.PNG)

<hr>

#### 🔶 쿠키의 옵션
> - 쿠키명=쿠키값 : 기본적인 쿠키의 값이다. name=seung 과 같이 설정할 수 있다.
> - Expires=날짜 : 만료 기한으로써 이 기한이 지나면 쿠키가 제거되고 기본값은 클라이언트가 종료될 때까지이다.
> - Max-age=초 : Expires와 비슷하지만 날짜 대신 초를 입력할 수 있고 해당 초가 지나면 쿠키가 제거된다. 또한, Expires 보다 우선된다.
> - Domain=도메인명 : 쿠키가 전송될 도메인을 특정할 수 있다. 기본값은 현재 도메인이다.
> - Path=URL : 쿠키가 전송될 URL을 특정항 수 있다. 기본값은 '/'이고 이 경우 모든 URL에서 쿠키를 전송할 수 있다.
> - Secure: HTTPS일 경우에만 쿠키가 전송된다.
> - HttpOnly : 설정 시 자바스크립트에서 쿠키에 접근할 수 없다.

- [server4.js](https://github.com/saseungmin/Node.js-tutorial/blob/master/http%20%EB%AA%A8%EB%93%88%EB%A1%9C%20%EC%9B%B9%20%EC%84%9C%EB%B2%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0/%EC%BF%A0%ED%82%A4%EC%99%80%20%EC%84%B8%EC%85%98/server4.js) 에서의 방법은 쿠키가 노출되어 쿠키가 조작될 위험이 있다. => server5.js
> 📌 [server5.js](https://github.com/saseungmin/Node.js-tutorial/blob/master/http%20%EB%AA%A8%EB%93%88%EB%A1%9C%20%EC%9B%B9%20%EC%84%9C%EB%B2%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0/%EC%BF%A0%ED%82%A4%EC%99%80%20%EC%84%B8%EC%85%98/server5.js) 참고(세션 방법)
<pre>
// 임의의 숫자를 보낸다.
// 사용자 이름과 만료시간은 session 객체에 담는다.
const randomInt = Date.now();
session[randomInt] = {
    name,
    expires,
};
res.writeHead(302, {
Location: "/",
"Set-Cookie": `session=${randomInt}; Expires=${expires.toUTCString()}; HttpOnly; Path=/`,
});
res.end();
</pre>

![session](./img/2.PNG)

<hr>

## ✒ REST API(REpresentational State Transfer)와 라우팅
- REST API는 네트워크 구조의 한 형식으로 서버의 자원을 정의하고, 자원에 대한 주소를 지정하는 방법을 가르킨다.
- 주소는 의미를 명확히 전달하기 위해 명사로 구성된다. (사용자 정보 : /user 게시글 : /post)
#### 🔶 HTTP 요청 메서드
> - GET : 서버의 자원을 가져오고자 할 때 사용하는 것으로 요청의 본문에 데이터를 넣지 않고 데이터를 서버로 보내야 한다면 쿼리스트링을 사용한다.
> - POST : 서버에 자원을 새로 등록하고자 할 때 사용하는 것으로 요청의 본문(body)에 새로 등록할 데이터를 넣는다.
> - PUT : 서버의 자원을 요청에 들어 있는 자원으로 치환하고자 할 때 사용하는 것으로 요청의 본문(body)에 치환할 데이터를 넣어 보낸다.
> - PATCH : 서버 자원의 일부만 수정하고자 할 때 사용하는 것으로 요청의 body에 일부 수정할 데이터를 넣어 보낸다.
> - DELETE : 서버의 자원을 삭제하고자 할 때 사용한다.
