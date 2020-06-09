'use strict';

require('dotenv').config();
const express = require('express');
const authRouter = require('./auth/loginRoutes');
const extraRoutes = require('./auth/extra-routes');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('./public'));
app.use('/', authRouter);
app.use('/', extraRoutes);

module.exports = {
  sever: app,
  start: (port) => {
    app.listen(PORT, () => console.log(`Up on port ${PORT}`));
  },
};