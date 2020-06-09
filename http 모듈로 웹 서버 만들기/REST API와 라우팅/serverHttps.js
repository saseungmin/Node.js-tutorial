// https 모듈 사용하여 인증서 적용 방법
const https = require("https");
const fs = require("fs");

https
  .createServer(
    {
      cert: fs.readFileSync("도메인 인증서 경로"),
      key: fs.readFileSync("도메인 비밀키 경로"),
      ca: [
        fs.readFileSync("상위 인증서 경로"),
        fs.readFileSync("상위 인증서 경로"),
      ],
    },
    (req, res) => {
      res.write("<h1>hello</h1>");
      res.end("<p>hello</p>");
    }
  )
  .listen(443, () => {
    console.log("443포트 열림");
  });
