var crypto = require('crypto');

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
function authenticate(plainText) {
  return this.encryptPassword(plainText) === this.hashedPassword;
}

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
function makeSalt() {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
function encryptPassword(password, salt) {
  if (!password || !salt) return '';
  var s = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, s, 10000, 64).toString('base64');
}

module.exports.authenticate = authenticate;
module.exports.makeSalt = makeSalt;
module.exports.encryptPassword = encryptPassword;
