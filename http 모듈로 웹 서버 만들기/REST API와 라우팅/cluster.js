const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  // cpu 개수만큼 worker 생산
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // worker 종료
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid}번 worker 종료`);
    // 종료 한뒤 다시 생성
    cluster.fork();
  });
} else {
  // worker들이 포트에서 대기
  http
    .createServer((req, res) => {
      res.write("<h1>hello</h1>");
      res.end("<p>hello</p>");
      // 8085 접속 시마다 1초후 worker가 종료된다.
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    })
    .listen(8085);
  console.log(`${process.pid}번 워커 실행`);
}
