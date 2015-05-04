/**
 * Main application routes
 */

'use strict';

var errors = require('./../components/errors/index');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./../api/thing/index'));

  app.use('/auth', require('./../auth/index'));

};
