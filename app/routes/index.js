'use strict';

var errors = require('./../components/errors/index');

/**
 * Main application routes
 * Expose all the routes for the application
 * @method exports
 * @param {object} app the Express app object
 */
module.exports = function(app) {

  //API routes
  app.use('/api/users', require('./user'));


  app.use('/auth', require('./authorization'));
  app.route('*').get(errors[404]);
};
