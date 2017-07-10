import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

import localPassport from './local-passport';
import auth from './routes/auth.routes';
import serverConfig from './serverConfig';

const app = express();

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, { useMongoClient: true}, error => {
  if (error) {
    console.log('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(session({
  secret: serverConfig.sessionSecret,  // session secret
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
localPassport();  // load local passport system
app.use(passport.session()); // persistent login sessions

app.use('/api/auth', auth);

app.get('/', function (req, res) {
  res.send(`<html>
  <head>
    <title>Express HTML</title>
  </head>
  <body>
    La ressource demandée n'existe pas
  </body>
</html>`);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
