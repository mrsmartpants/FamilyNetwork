'use strict';

//The routes for the authorization api

var express = require('express');

var router = express.Router();

router.use('/local', require('../../config/passport/local').load(router));

module.exports = router;
