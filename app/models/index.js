var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('./../../config/database.json')[env];
var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
var db = {};

// initialize database connection
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);


// load models

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
