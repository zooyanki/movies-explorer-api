const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Модель User-a
const User = require('../models/user');

// Ошибки
const Unauthorized = require('../errors/unauthorized');
const BadRequestError = require('../errors/badRequestError');

module.exports.readUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then(() => res.send(true))
    .catch((err) => {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new BadRequestError('Такой пользователь уже существует'));
        }
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { $set: { name, email } }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Пользователь неавторизован'));
    });
};

module.exports.readUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.status(302).redirect('/signin');
};
