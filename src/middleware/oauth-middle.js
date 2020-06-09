'use strict';

const superagent = require('superagent');
const users = require('../auth/model/user-model.js');

module.exports = async (req, res, next) => {
  try {
    console.log('hello from the middleware');
    const code = req.query.code;
        
    let accessToken = await exchangeCodeForToken(code);

    let remoteUserData = await exchangeTokenForUser(accessToken);

    let [token, user] = await storeUserToDataBase(remoteUserData);

    req.user = user;
    req.token = token;

    next();
        
  }
  catch(err){
    next(`ERROR: ${err.message}`);
  }
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post('https://github.com/login/oauth/access_token')
    .send({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.CALLBACK_URI,
      grant_type: 'authorization_code',
    });

  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function exchangeTokenForUser(token) {
  const userData = await superagent.get('https://api.github.com/user')
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userData.body;
  return user;
}

async function storeUserToDataBase(user) {
  const newUserRecord = {
    username: user.username,
    password: 1234,
  };
  let storedUser = users.create(newUserRecord);
  let token = users.generateToken(user);

  return [token, storedUser];
}