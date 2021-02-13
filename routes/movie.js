const movieRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createMovie, deleteMovie, readMovies,
} = require('../controllers/movie');

movieRouter.get('/movies', readMovies);

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/\S+\.\S+/m),
    trailer: Joi.string().required().regex(/https?:\/\/\S+\.\S+/m),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(/https?:\/\/\S+\.\S+/m),
    movieId: Joi.string().alphanum(),
  }),
}), createMovie);

movieRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
