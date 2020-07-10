#! /usr/bin/env node
// process.argv : 어떤 옵션이 주어졌는지 확인할수 있다. 배열로 표시된다.
//console.log('Hello CLI', process.argv);

const readline = require('readline');

// readline을 불러와서 createInterface 메서드로 rl 객체를 생성한다.
const rl = readline.createInterface({
  input: process.stdin, // 콘솔 입력
  output: process.stdout, // 콘솔 출력
});

console.clear();
// 사용자의 질문
const answerCallback = (answer) => {
  if (answer === 'y') {
    console.log('아자아자!');
    rl.close();
  } else if (answer === 'n') {
    console.log('ㅠㅠ');
    rl.close();
  } else {
    console.clear();
    console.log('y또는 n만 입력하세요.');
    rl.question('개발이 재밌습니까? (y/n)', answerCallback);
  }
};

rl.question('개발이 재밌습니까? (y/n)', answerCallback);
