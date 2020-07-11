#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
// 단계적으로 생성하기
const readline = require('readline');

let rl;
// 프로세스 실행시 전달받는 파라미터 process.argv
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';

// html 템플릿
const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>`;

// router 템플릿
const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router; `;

const exist = (dir) => {
  try {
    // fs.accessSync 메서드를 통해 파일이나 폴더가 존재하는지 검사합니다.
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const mkdirp = (dir) => {
  // 현재 경로와 입력한 경로의 상대적인 위치를 파악한 후 순차적으로 상위 폴더부터 만들어 나간다.
  // ex) public/html과 같은 경로를 인자로 제공하면 public 폴더를 만들고 그 안에 html 폴더를 순차적으로 만든다.
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter((p) => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

// 실직적인 템플릿 만들기
const makeTemplate = () => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error('해당 파일이 존재합니다.');
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error('해당 파일이 존재합니다.');
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else {
    console.error('html 또는 express-router 둘 중 하나를 입력하세요');
  }
};

// 디렉터리
const dirAnswer = (answer) => {
  directory = (answer && answer.trim()) || '.';
  rl.close();
  makeTemplate();
};

// 파일명
const nameAnswer = (answer) => {
  if (!answer || !answer.trim()) {
    console.clear();
    console.log('name을 반드시 입력하세요.');
    return rl.question('파일명을 설정하세요.', nameAnswer);
  }
  name = answer;
  return rl.question('저장할 경로를 설정하세요.(설정하지 않으면 현재경로)', dirAnswer);
};

// 템플릿 종류
const typeAnswer = (answer) => {
  if (answer !== 'html' && answer !== 'express-router') {
    console.clear();
    console.log('html 또는 express-router만 지원합니다.');
    return rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
  }
  type = answer;
  return rl.question('파일명을 설정하세요.', nameAnswer);
};

const program = () => {
  if (!type || !name) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.clear();
    rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
  } else {
    makeTemplate();
  }
};

program();
