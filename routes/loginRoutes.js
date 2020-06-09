'use strict';

const express = require('express');
const basicAuth = require('../src/auth/auth');
const users = require('../models/user-model');
const oauth = require('../src/auth/oauth-middle');
const router = express.Router();

router.get('/auth', oauth, oauthHandler);
router.post('/signup', signUpHandler);
router.post('/signin', basicAuth, signInHandler);
router.get('/users', basicAuth, listUsersHandler);
router.post('/test', (req, res) => {
  users.create(req.body).then( result => {
    res.json(result);
  });
});


function signUpHandler(req, res) {
  users.create(req.body).then(user => {
    const token = users.generateToken(user);
    res.json({ token });
  }).catch(err => {
    res.status(403).send(err);
  });
}

function signInHandler(req, res) {
  res.json({ token: req.token });
}

function listUsersHandler(req, res) {
  users.read().then(users => {
    res.json({ users });
  }).catch(err => {
    res.status(403).send(err);
  });
}

function oauthHandler(req,res){
  console.log(' route handler');
  res.json({ token: req.token });
}

module.exports = router;