/**
 * Main application routes
 */

'use strict';

var errors = require('./../components/errors/index');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function(app) {

  //API routes
  app.use('/api/users', require('./user'));


  app.use('/auth', require('./authorization'));
  app.route('*').get(errors[404]);
};
