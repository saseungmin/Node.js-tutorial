exports.isLoggedIn = (req, res, next) => {
  // 로그인 중이면 true, 아니면 false
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('loginError', '로그인이 필요합니다.');
    req.redirect('/');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};
