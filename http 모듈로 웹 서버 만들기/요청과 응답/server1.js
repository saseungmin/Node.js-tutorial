// 1. 콜백 함수로 넣어주기
// const http = require("http");

// http
//   .createServer((req, res) => {
//     res.write("<h1>hello</h1>");
//     res.end("<p>hello world</p>");
//   })
//   .listen(8080, () => {
//     console.log("8080연결 대기");
//   });

// 2. 이벤트 리스너 붙이기
const http = require("http");

const server = http.createServer((req, res) => {
  // 클라이언트로 보낼 데이터
  res.write("<h1>hello</h1>");
  // 응답을 종료하는 메서드
  // 인자가 있다면 클라이언트로 보내고 응답을 종료한다.
  res.end("<p>hello world</p>");
});
server.listen(8080);
server.on("listening", () => {
  console.log("8080 연결 대기");
});
server.on("error", (error) => {
  console.log(error);
});
