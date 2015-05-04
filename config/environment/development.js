'use strict';

// Development specific configuration
// ==================================
module.exports = {
  sequelize: {
    dialect: 'mysql',
    mysql: {
      host: 'localhost:8889',
      db: 'familynetwork',
      user: 'root',
      password: 'root'
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },

  seedDB: true
};
