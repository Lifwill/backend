import passport from 'passport';

export function signup(req, res, next) {
    // use the local-signup stategy
  return passport.authenticate('local-signup', (error, user) => {
    if (error) {
      res.status(400).json({
        message: 'signupFailed',
      });
    } else {
      req.session.user = user;
      res.status(200).json({
        user: {
          email: user.email,
        },
      });
    }
  })(req, res, next);
}

export function isAuthenticated(req, res) {
  let user = req.session.user;
  res.status(200).json({
    user: {
      email: user.email,
    },
  });
}

export function login(req, res, next) {
  return passport.authenticate('local-login', (error, user) => {
    if (error) {
      res.status(400).jons({
        mesage: 'loginFailed',
      });
    } else {
      req.session.user = user;
      res.status(200).json({
        user: {
          email: user.email,
        },
      });
    }
  })(req, res, next);
}
