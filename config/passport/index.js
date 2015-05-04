/**
 * Passport export function.
 * This function initializes all passport strategies
 * @method exports
 * @param {object} app
 * @param {object} config
 * @return
 */
module.exports = function(app, config) {
  require('./local').setup(app.get('models').User, config);
};

