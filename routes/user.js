const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  updateUser, readUser,
} = require('../controllers/user');

usersRouter.get('/users/me', readUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = usersRouter;
