const http = require("http");
const fs = require("fs");

const users = {};

http
  .createServer((req, res) => {
    if (req.method === "GET") {
      // root면 restFront.html 뿌려주기
      if (req.url === "/") {
        return fs.readFile("./restFront.html", (err, data) => {
          if (err) {
            throw err;
          }
          res.end(data);
        });
        // root면 ./about.html 읽어서 뿌려주기
      } else if (req.url === "/about") {
        return fs.readFile("./about.html", (err, data) => {
          if (err) {
            throw err;
          }
          res.end(data);
        });
      } else if (req.url === "/users") {
        return res.end(JSON.stringify(users));
      }
      // 그 이외의 url
      return fs.readFile(`.${req.url}`, (err, data) => {
        if (err) {
          // 응답헤더에 쓰기
          res.writeHead(404, "NOT FOUND");
          return res.end("NOT FOUND");
        }
        return res.end(data);
      });
    } else if (req.method === "POST") {
      if (req.url === "/users") {
        let body = "";
        req.on("data", (data) => {
          // 실행
          // 받은 데이터들을 body에 넣는다.
          body += data;
        });
        return req.on("end", () => {
          console.log("POST body : ", body);
          const { name } = JSON.parse(body);
          const id = Date.now();
          users[id] = name;
          // 201 Created 요청 성공, 자원 생성
          res.writeHead(201);
          res.end("등록 성공");
        });
      }
      // 수정
    } else if (req.method === "PUT") {
      // startsWith() 메서드는 어떤 문자열이 특정 문자로 시작하는지 확인하여 결과를 true false로 반환한다.
      if (req.url.startsWith("/users/")) {
        const key = req.url.split("/")[2];
        console.log("PUT key : ", key);
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        return req.on("end", () => {
          console.log("PUT body : ", body);
          users[key] = JSON.parse(body).name;
          return res.end(JSON.stringify(users));
        });
      }
      // 삭제
    } else if (req.method === "DELETE") {
      if (req.url.startsWith("/users/")) {
        const key = req.url.split("/")[2];
        delete users[key];
        return res.end(JSON.stringify(users));
      }
    }
    // 해당 값이 없으면 not found
    res.writeHead(404, "NOT FOUND");
    return res.end("NOT FOUND");
  })
  .listen(8085, () => {
    console.log("8085포트 실행");
  });
