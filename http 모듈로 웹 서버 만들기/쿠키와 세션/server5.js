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

const session = {};

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
      // cookies.session이 있고 만료 기한을 넘기지 않았다면 session 변수에서 사용자 정보를 가져와서 사용한다.
    } else if (cookies.session && session[cookies.session].expires > new Date()) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`${session[cookies.session].name}님 안녕하세요`);
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
  .listen(8084, () => {
    console.log("8084포트 연결");
  });
