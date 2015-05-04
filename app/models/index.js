var Sequelize = require('sequelize');
var config = require('./../../config/environment');

// initialize database connection
var sequelize = new Sequelize(
  config.sequelize.name,
  config.sequelize.user,
  config.sequelize.password,
  config.sequelize.options
);


// load models
var models = [
  'User'
];
models.forEach(function (model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function (m) {
})(module.exports);

module.exports.sequelize = sequelize;
