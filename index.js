'use strict';
const server = require('./lib/server');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
    
mongoose.connect(MONGODB_URI, mongooseOptions);

server.start(3030);