const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        const urlRegex = /https?:\/\/\S+\.\S+/gm;
        return urlRegex.test(url);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        const urlRegex = /https?:\/\/\S+\.\S+/gm;
        return urlRegex.test(url);
      },
    },
  },
  movieId: {
    type: mongoose.Schema.ObjectId,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        const urlRegex = /https?:\/\/\S+\.\S+/gm;
        return urlRegex.test(url);
      },
    },
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator(langRU) {
        const langRuRegex = /[^a-zA-Z]/gm;
        return langRuRegex.test(langRU);
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator(langEN) {
        const langEnRegex = /[^а-яА-Я]/gm;
        return langEnRegex.test(langEN);
      },
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
