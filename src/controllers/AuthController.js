import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import serverConfig from '../serverConfig';
import User from '../models/user';

/*
 * Private
 * Create a token for authentication
 * Has an expires and a secret define in the config
 * Pass only the email and the _id
 */

const jwtSign = (user) => {
  return jwt.sign({email: user.email, id : user._id}, serverConfig.jwtSecret, { expiresIn: serverConfig.jwtExpiresIn});
};

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
 * return the token and the new user profile created
 */

export function signup(req, res) {
  const user = new User(req.body);
  if (user.password) {
    user.password = user.generateHash(user.password);
  }
  user.save(function(err, user) {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      user.password = undefined;
      const token = jwtSign(user);
      res.status(200).json({
        user,
        token,
      })
    }
  })
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
    return res.status(401).json({
      code: 'NOT_AUTHORIZED',
    });
  }
  User.findOne({ email : req.body.email }, function(err, user){
    if (err) {
      res.status(500).json({
        err,
      });
    } else if (!user || !user.validPassword(req.body.password)) {
      res.status(401).json({
        code: 'AUTHENTICATION_FAILED',
      });
    } else {
      user.password = undefined;
      res.status(200).json({
        user,
        token: jwtSign(user),
      })
    }
  });
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
    })
  }
}

/*
 * Middleware
 * Load the user if provided by the token
 */

export function loadUser(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], serverConfig.jwtSecret, function(err, decode) {
      if (decode) {
        User.findById(decode.id, function(err, user){
          if (user) {
            // never return the password, just in case
            user.password = undefined;
            req.user = user;
          }
          next();
        });
      } else {
        next();
      }
    })
  } else {
    next();
  }
}
