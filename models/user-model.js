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
      if (result === null) {
        const newRecord = new this.schema(record);
        newRecord.password = await bcrypt.hash(newRecord.password, 5);
        console.log('new record >>>>>>>>>>>>>>>>>',newRecord);
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


}

module.exports = new User();