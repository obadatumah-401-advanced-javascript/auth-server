'use strict';
const bearer = require('../middleware/bearer-middle');
const permission = require('../middleware/authorize');
const express = require('express');
const router = express.Router();

router.get('/secret', bearer, (req, res)=> {
  res.status(200).json(req.user);
});

router.get('/read', bearer, permission('read'), permissionsAccessHandler);
router.post('/add', bearer, permission('create'), permissionsAccessHandler);
router.put('/change', bearer, permission('update'), permissionsAccessHandler);
router.delete('/remove', bearer, permission('delete'), permissionsAccessHandler);


function permissionsAccessHandler(req, res){
  res.status(200).send(`Authorized`);
}

module.exports = router;