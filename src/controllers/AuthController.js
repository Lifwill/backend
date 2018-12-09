import jwt from 'jsonwebtoken';
import serverConfig from '../serverConfig';
import User from '../models/user';
import sendEmail from '../helpers/mailer';

/*
 * Private
 * Send an email to validate the user's email
 */


const sendValidationEmail = (user) => {
  // setup email data with unicode symbols
  const mailOptions = {
    from: serverConfig.smtpFrom, // sender address
    to: serverConfig.DEV_SmtpTo || user.email, // list of receivers
    subject: 'test', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>', // html body
  };
  // send mail with defined transport object
  sendEmail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message %s sent: %s', info.messageId, info.response);
    }
  });
};

/*
 * Private
 * Create a token for authentication
 * Has an expires and a secret define in the config
 * Pass only the email and the _id
 */

const jwtSign = user => (
  jwt.sign({
    email: user.email,
    id: user.id,
  },
  serverConfig.jwtSecret, { /* expiresIn: serverConfig.jwtExpiresIn */ })
);

/*
 * return the profile. It may be used to see if the user is authenticated
 */

export function profile(req, res) {
  if (req.user) {
    res.status(200).json({
      user: req.user,
    });
  } else {
    // should never happens, but just in case
    res.status(401).json({
      code: 'NOT_AUTHORIZED',
    });
  }
}

/*
 * Register a new user
 * create user from the body
 * Save it to database
 * return the token and the new user from data created
 */

export function signup(req, res) {
  const user = new User(req.body);
  user.save((err, curUser) => {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      // clone object to avoid sideEffect
      const cloneUser = new User(curUser);
      cloneUser.password = undefined;
      const token = jwtSign({
        id: cloneUser._id,
        email: cloneUser.email,
      });
      sendValidationEmail(cloneUser);
      res.status(200).json({
        cloneUser,
        token,
      });
    }
  });
}

/*
 * Login a user
 * get the user from the database and compare the password
 * return the token and the new user profile found
 */

export function login(req, res) {
  // validate entries
  if (!req.body.password || !req.body.email) {
    // should never happens, but just in case
    res.status(401).json({
      code: 'NOT_AUTHORIZED',
    });
  } else {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        res.status(500).json({
          err,
        });
      } else if (!user || !user.validPassword(req.body.password)) {
        res.status(401).json({
          code: 'AUTHENTICATION_FAILED',
        });
      } else {
        // clone user to avoid sideEffect
        const cloneUser = new User(user);
        cloneUser.password = undefined;
        res.status(200).json({
          cloneUser,
          token: jwtSign({
            id: cloneUser._id,
            email: cloneUser.email,
          }),
        });
      }
    });
  }
}

/*
 * Middleware
 * Ensure that a user is connected to continue
 */

export function loginRequired(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      code: 'NOT_AUTHORIZED',
    });
  }
}

/*
 * Middleware
 * Load the user if provided by the token
 */

export function loadUser(req, res, next) {
  console.log(req && req.headers);
  console.log(req && req.headers && req.headers.authorization && req.headers.authorization.split(' '));
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], serverConfig.jwtSecret, (err, decode) => {
      console.log(err);
      if (decode) {
        console.log(decode);
        User.findById(decode.id, (userError, user) => {
          console.log(userError);
          console.log(user);
          if (user) {
            // clone user to avoid side effect
            const cloneUser = new User(user);
            // never return the password, just in case
            cloneUser.password = undefined;
            req.user = cloneUser;
          }
          next();
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
}
