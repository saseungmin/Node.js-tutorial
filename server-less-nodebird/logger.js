const { createLogger, format, transports } = require('winston');

// winston 패키지의 createLogger 메서드로 logger 생성
const logger = createLogger({
  // 로그의 심각도
  level: 'info',
  // 로그의 형식
  format: format.json(),
  // 로그 저장 방식
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// 배포환경이 아닐땐 파일뿐만 아니라 콘솔에도 출력하도록 되어있다.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;
