const mongoose = require('mongoose');

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true); // 개발 환경일 때만 콘솔을 통해 확인할 수 있게 하는 코드이다.
    }
    // 접속 시도
    mongoose.connect(
      'mongodb://localhost:27017/admin',
      {
        dbName: 'nodejs',
      },
      (error) => {
        if (error) {
          console.log('몽고디비 연결 에러', error);
        } else {
          console.log('몽고디비 연결 성공');
        }
      },
    );
  };
  connect();
  // 몽구스 커넥션에 이벤트 리스너를 달아 에러 처리
  mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 재연결을 시도합니다.');
    connect();
  });
  require('./user');
  require('./comment');
};
