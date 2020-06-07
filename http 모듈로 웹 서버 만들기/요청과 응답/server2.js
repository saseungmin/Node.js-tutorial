const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    // 파일을 읽어와서 서버에 뿌리기
    fs.readFile('./server2.html', (err, data) => {
        if(err){
            throw err;
        }
        res.end(data);
    });
}).listen(8081, () => {
    console.log('8081 서버 실행');
})