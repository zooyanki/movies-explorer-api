module.exports = {
  'extends': [
    'airbnb-base'],
  'rules': {
    'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
    'quote-props': ['error', 'as-needed', { 'keywords': false, 'unnecessary': false }],
    'max-len': ['error', { 'code': 105 }],
  },
};
