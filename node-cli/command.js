#! /usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

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
const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('해당 파일이 존재합니다.'));
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(chalk.green(pathToFile, '생성 완료'));
    }
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('해당 파일이 존재합니다.'));
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(chalk.green(pathToFile, '생성 완료'));
    }
  } else {
    console.error(chalk.bold.yellow('html 또는 express-router 둘 중 하나를 입력하세요'));
  }
};

program.version('0.0.1', '-v, --version').name('cli');

program
  .command('template <type>')
  .usage('<type> --filename [filename] --path [path]')
  .description('템플릿을 생성합니다.')
  .alias('tmpl')
  .option('-f, --filename <filename>', '파일명을 입력하세요.', 'index')
  .option('-d, --directory [path]', '생성 경로를 입력하세요.', '.')
  .action((type, options) => {
    makeTemplate(type, options.filename, options.directory);
  });

program
  .action((cmd, args) => {
    if (args) {
      console.log('해당 명령어를 찾을 수 없습니다.');
      program.help();
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'type',
            message: '템플릿 종류를 선택하세요.',
            choices: ['html', 'express-router'],
          },
          {
            type: 'input',
            name: 'name',
            message: '파일의 이름을 입력하세요.',
            default: 'index',
          },
          {
            type: 'input',
            name: 'directory',
            message: '파일이 위치할 폴더의 경로를 입력하세요.',
            default: '.',
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: '생성하시겠습니까?',
          },
        ])
        .then((answers) => {
          if (answers.confirm) {
            makeTemplate(answers.type, answers.name, answers.directory);
            console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'));
          }
        });
    }
  })
  .parse(process.argv);
