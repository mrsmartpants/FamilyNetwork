'use strict';
/**
 * Passport export function.
 * This function initializes all passport strategies
 * @method exports
 * @param {object} app
 * @param {object} config
 */

//var User = require('../../app/models/user');

module.exports = function (User, config) {
  require('./local').setup(User, config);
};

