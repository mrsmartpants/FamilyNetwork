/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
//
module.exports = function(app) {
  var models = app.get('models');
  var User = models.User;

  models.sequelize.sync({force: true})
    .then(function() {
      User
        .create({
          provider: 'local',
          firstName: 'Ethan',
          lastName: 'Veres',
          email: 'ethanveres@gmail.com',
          password: 'test'
        })
        .then(function (user) {
          // success! do something with user
          //console.log(user);
        })
        .catch(function (reason) {
          // failure!
        });
    });
};
