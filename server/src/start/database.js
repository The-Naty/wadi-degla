const mongoose = require('mongoose');

const uri = process.env.CONNECTION_STRING;

module.exports = function () {
  mongoose
    .connect(uri)
    .then(() => console.log(`Connected to MongoDb...`))
    .catch((error) => console.log(error));
};
