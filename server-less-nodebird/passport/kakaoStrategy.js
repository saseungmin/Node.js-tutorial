const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(
    new KakaoStrategy(
      {
        // 카카오에서 발급해주는 아이디.
        clientID: process.env.KAKAO_ID,
        // 카카오로부터 인증 결과를 받을 라우터 주소.
        callbackURL: '/auth/kakao/callback',
      },
      // profile에는 사용자 정보가 담겨있다.
      async (accessToken, refreshToken, profile, done) => {
        try {
          // sns id가 있고, provider가 kakao 인 사람이 있으면
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            // 없으면 가입
            const newUser = await User.create({
              email: profile._json && profile._json.kaccount_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
