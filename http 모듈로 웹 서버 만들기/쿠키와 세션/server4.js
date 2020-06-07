const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map((v) => v.split("="))
    .map(([k, ...vs]) => [k, vs.join("=")])
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

// /login과 /로 시작하는 것까지 두개이기 떄문에 주소별로 분기 처리
http
  .createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    // /login 일시 처리
    if (req.url.startsWith("/login")) {
      const { query } = url.parse(req.url);
      const { name } = qs.parse(query);
      const expires = new Date();
      // 쿠키의 만료시간을 현제부터 5분 뒤로 설정
      expires.setMinutes(expires.getMinutes() + 5);
      // 헤더에는 한글을 설정할 수 없어서 name 변수를 encodeURIComponent 시킨다.
      // Expires=날짜 : 만료 기한
      // 자바스크립트에서 쿠키에 접근할 수 없다.
      res.writeHead(302, {
        Location: "/",
        "Set-Cookie": `name=${encodeURIComponent(
          name
        )};Expires=${expires.toUTCString()}; HttpOnly; Path=/`,
      });
      res.end();
    } else if (cookies.name) {
      // 로그인시 보여지는 곳
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`${cookies.name}님 안녕하세요`);
    } else {
      // 로그인 안되어 있을시 server4.html 보여주기
      fs.readFile("./server4.html", (err, data) => {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    }
  })
  .listen(8083, () => {
    console.log("8083포트 연결");
  });
