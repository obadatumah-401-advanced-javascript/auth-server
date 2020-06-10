'use strict';

const userModel = require('../auth/model/user-model.js');
module.exports = (capability) => {
  return (req, res, next) => {
    try{
      let userRole = req.user.role;
      let usercapabilitys = userModel.roles[userRole];
      req.capability = capability;
      if(usercapabilitys.includes(capability)){
        next();
      }
      else{
        next('Access Denied');
      }
    }catch(err){
      next(err);
    }
  };
};