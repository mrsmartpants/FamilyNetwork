'use strict';

// Development specific configuration
// ==================================
module.exports = {
  sequelize: {
    name: 'familynetwork',
    user: 'root',
    password: 'root',

    options: {
      host: 'localhost:8889',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    }
  },

  seedDB: true
};
