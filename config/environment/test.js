'use strict';

// Test specific configuration
// ===========================
module.exports = {
  sequelize: {
    name: 'familynetwork-test',
    user: 'root',
    password: 'root',

    options: {
      host: 'localhost',
      dialect: 'mysql',
      port: '8889',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    }
  }

};
