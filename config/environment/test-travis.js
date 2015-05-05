'use strict';

// Travis test specific configuration
// ==================================
module.exports = {
  sequelize: {
    name: 'familynetwork-test',
    user: 'root',
    password: 'root',

    options: {
      host: '127.0.0.1',
      dialect: 'mysql',
      logging: false
    }
  },

  seedDB: false
};
