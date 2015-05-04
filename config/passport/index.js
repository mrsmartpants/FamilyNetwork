/**
 * Description
 * @method exports
 * @param {} app
 * @param {} config
 * @return 
 */
module.exports = function(app, config) {
  require('./local').setup(app.get('models').User, config);
};

