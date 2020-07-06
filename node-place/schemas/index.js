const mongoose = require('mongoose');

const { NODE_ENV } = process.env;
const MONGO_URL = 'mongodb://localhost:27017/admin';

module.exports = () => {
  const connect = () => {
    // 개발 환경일 때만 콘솔을 통해 확인할 수 있게 하는 코드이다.
    if (NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect(
      MONGO_URL,
      {
        dbName: 'nodeplace',
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

  mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
  });

  require('./favorite');
  require('./history');
};
