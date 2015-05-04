/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
//
module.exports = function (app) {
  var models = app.get('models');
  var User = models.User;

  models.sequelize.sync({force: true})
    .then(function () {
      User
        .bulkCreate([{
          provider: 'local',
          firstName: 'Ethan',
          lastName: 'Veres',
          email: 'ethanveres@gmail.com',
          password: 'test'
        },
          {
            provider: 'local',
            firstName: 'test',
            lastName: 'test',
            email: 'test@test.com',
            password: 'test'
          }
        ]);
    });
};
