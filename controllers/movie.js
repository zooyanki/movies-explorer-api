const Movie = require('../models/movie');
const AccessError = require('../errors/accessError');
const NotFoundError = require('../errors/notFoundError');

module.exports.readMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie) {
        if (String(movie.owner) === req.user._id) {
          Movie.findByIdAndRemove(req.params._id)
            .then((delMovie) => res.send(delMovie));
        } else {
          next(new AccessError('У вас нет прав для удаления'));
        }
      } else {
        next(new NotFoundError('Фильм не найден'));
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
