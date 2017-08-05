import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import auth from './routes/AuthRoutes';
import serverConfig from './serverConfig';

const app = express();

// Set the promises
mongoose.Promise = global.Promise;
// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, { useMongoClient: true}, error => {
  if (error) {
    console.log('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));

app.use(auth.loadUser);

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
