import passport from 'passport';

export function signup(req, res, next) {
    // use the local-signup stategy
  return passport.authenticate('local-signup', (error, user) => {
    if (error) {
      res.status(400).json({
        message: 'signupFailed',
      });
    } else {
      res.status(200).json({
        user: {
          email: user.email,
        },
      });
    }
  })(req, res, next);
}

export function isAuthenticated(req, res) {
  res.status(200).json({
    user: req.user,
  });
}

export function login(req, res, next) {
  return passport.authenticate('local-login', (error, user) => {
    if (error) {
      res.status(400).jons({
        mesage: 'loginFailed',
      });
    } else {
      res.status(200).json({
        user: {
          email: user.email,
        },
      });
    }
  })(req, res, next);
}
