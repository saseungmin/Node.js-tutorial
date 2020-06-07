const http = require("http");


// 쿠키는 name=seung;year=2010 처럼 문자열 형식으로 오므로 이를  {name : 'seung', year:'2020'}와 같이 객체로 바꾸는 함수이다.
const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map((v) => v.split("="))
    .map(([k, ...vs]) => [k, vs.join("=")])
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http
  .createServer((req, res) => {
    // 쿠키는 req.headers.cookie에 담겨있다.
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    // 응답헤더에 쿠키를 기록한다.
    // 두번째 인자는 헤더의 내용을 입력한다.
    res.writeHead(200, { "Set-Cookie": "myCookie=test" });
    res.end("Create Cookie");
  })
  .listen(8002, () => {
    console.log("8002 서버 실행");
  });
