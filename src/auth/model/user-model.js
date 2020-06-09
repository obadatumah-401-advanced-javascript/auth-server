'use strict';

const schema = require('./users.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;

class User {
  constructor() {
    this.schema = schema;
  }

  read() {
    return this.schema.find({});
  }

  async create(record) {
    try {
      const result = await this.schema.findOne({ username: record.username });
      console.log('result', result);
      if (result === null) {
        const newRecord = new this.schema(record);
        newRecord.password = await bcrypt.hash(newRecord.password, 5);
        console.log(newRecord);
        return newRecord.save();
      }
      else {
        return this.generateToken({ result });
      }
    } catch (err) {
      return err;
    }

  }

  async authenticateBasic(user, pass) {
    try {
      console.log(user, pass);
      const result = await this.schema.findOne({ username: user });
      console.log(result);
      if (result) {
        console.log(result);
        const isValid = await bcrypt.compare(pass, result.password);
        return isValid ? result : Promise.reject('Not a user');
      }
      return Promise.reject();
    } catch (err) {
      return err;
    }
  }

  generateToken(user) {
    try{
      const token = jwt.sign({ username: user.username }, SECRET);
      return token;
    }catch (err) {
      return err;
    }
  }
  verifyToken(token) {
    const sc = this.schema;
    return jwt.verify(token, SECRET, async function(err, decoded) {
      if (err) {
        console.log('err>>> ', err);
        return Promise.reject(err);
      }
      console.log('decoded >>>> ',decoded); // {username: usernameValue, ...}
      // let username =  //decoded['username']; // decoded.username
      const result = await sc.findOne({ username: decoded.username });
      if (result) {
        return Promise.resolve(decoded);
      } 
      return Promise.reject();
    });


  }
}

module.exports = new User();