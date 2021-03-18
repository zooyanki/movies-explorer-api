require('dotenv').config();

const { Joi, celebrate } = require('celebrate');
const { errors } = require('celebrate');

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { userRouter, movieRouter } = require('./routes/index');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/notFoundError');

const { login, createUser, signout } = require('./controllers/user');

const { PORT, MAIN_DOMAIN, API_DOMAIN } = process.env;
const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedCors = [
  `https://${MAIN_DOMAIN}`,
  `http://${MAIN_DOMAIN}`,
  `https://${API_DOMAIN}`,
  `http://${API_DOMAIN}`,
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use(express.json({ type: '*/*' }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

app.post('/signout', signout);

app.use(auth);

app.use('/', auth, userRouter);

app.use('/', auth, movieRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? message
        : message,
    });
  next();
});

app.listen(PORT);
