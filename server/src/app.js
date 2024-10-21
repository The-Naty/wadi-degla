const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
require('./start/routes')(app);
require('./start/database')();

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;
