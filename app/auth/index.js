'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../../config/environment');
var User = require('../models').User;
//TODO: implement user SQL model

// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local/index'));

module.exports = router;
