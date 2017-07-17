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
  // TODO : use a generic function to get the user (if later use the jwt or other mode of connection)
  const user = req.session.user;
  // there is a user authenticated
  if (user) {
    res.status(200).json({
      user: {
        email: user.email,
      },
    });
  } else {
    res.status(403).json({
      error: 'You are not logged in, please login before any other action.',
    });
  }
}

export function login(req, res, next) {
  return passport.authenticate('local-login', (error, user) => {
    if (error) {
      res.status(401).json({
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
