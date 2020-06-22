const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      // 첫번째인자로 주어진 객체는 전략(Strategy)에 관한 설정을 하는 곳이다.
      // req.body의 속성명에 해당
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      // 실제 전략을 수행한다.
      // 세번째 매개변수 done은 passport.authenticate의 콜백함수이다.
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
