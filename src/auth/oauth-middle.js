'use strict';

const superagent = require('superagent');
const users = require('../../models/user-model');

module.exports = async (req, res, next) => {
  try {
    console.log('middleware');
    const code = req.query.code;
    console.log(code);
    let accessToken = await exchangeCodeForToken(code);
    console.log(accessToken);
    let remoteUserData = await exchangeTokenForUser(accessToken);
    console.log('middleware3');
    let [token, user] = await storeUserToDataBase(remoteUserData);

    req.user = user;
    req.token = token;
    console.log('middleware4');
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
      redirect_uri: process.env.API_SERVER,
      grant_type: 'authorization_code',
    });
  console.log('fun2');

  let access_token = tokenResponse.body.access_token;
  console.log(access_token);
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
    password: 123123,
  };
  let storedUser = users.create(newUserRecord);
  let token = users.generateToken(user);

  return [token, storedUser];
}