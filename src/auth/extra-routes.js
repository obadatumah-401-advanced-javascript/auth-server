'use strict';
const bearer = require('../middleware/bearer-middle');
const express = require('express');
const router = express.Router();

router.get('/secret', bearer, (req, res)=> {
  res.status(200).json(req.user);
});

module.exports = router;