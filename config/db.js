const config = require('../config.json');
const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(config.db || process.env.MONGO_URI, { useNewUrlParser: true })
    .then((res) => {
      console.log('Database connected');
    })
    .catch((err) => console.log(err));
};
