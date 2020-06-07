'use strict';

require('dotenv').config();
const express = require('express');
const authRoute = require('../routes/loginRoutes');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/', authRoute);

module.exports = {
  sever: app,
  start: (port) => {
    app.listen(PORT, () => console.log(`listen on  ${PORT}`));
  },
};