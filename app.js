/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');




// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);

//Bootstrap the routes, controllers and models
require('./app/routes')(app);
require('./app/controllers')(app);
app.set('models', require('./app/models'));

// Populate DB with sample data
if(config.seedDB) { require('./config/seed')(app); }

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
