'use strict';

const base64 = require('base-64');
const users = require('../../models/user-model');

module.exports = (req, res ,next) => {
  if(!req.headers.authorization){
    next('Invalid Login');
  }
  else{
    const basic = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basic).split(':');
    users.authenticateBasic(user, pass).then(validUser => {
      console.log(validUser);
      req.token = users.generateToken(validUser);
      next();
    }).catch(err => {
      next('Wrong Password');
    });
  }
};