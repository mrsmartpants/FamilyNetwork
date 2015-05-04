var crypto = require('crypto');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var expressJwt = require('express-jwt');
var validateJwt = expressJwt({secret: config.secrets.session});


/**
 * Make salt
 * @api public
 * @method makeSalt
 * @return CallExpression
 */
function makeSalt() {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Encrypt password
 * @api public
 * @method encryptPassword
 * @param {String} password
 * @param {String} salt
 * @return CallExpression
 */
function encryptPassword(password, salt) {
  if (!password || !salt) return '';
  var s = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, s, 10000, 64).toString('base64');
}

/**
 * Returns a jwt token signed by the app secret
 * @method signToken
 * @param {} id
 * @param {} role
 * @return CallExpression
 */
function signToken(id, role) {
  return jwt.sign({id: id, role: role}, config.secrets.session, {expiresInMinutes: 60 * 5});
}

/**
 * Set token cookie directly for oAuth strategies
 * @method setTokenCookie
 * @param {} req
 * @param {} res
 * @return 
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, {message: 'Something went wrong, please try again.'});
  var token = signToken(req.user.id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 * @method isAuthenticated
 * @return CallExpression
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function (req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function (req, res, next) {
      var User = req.app.get('models').User;

      User
        .find({where: {id: req.user.id}})
        .then(function (user) {
          if (!user) return res.sendStatus(401);
          req.user = user;
          next();
        })
        .catch(function (err) {
          return next(err);
        });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 * @method hasRole
 * @param {} roleRequired
 * @return CallExpression
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

exports.makeSalt = makeSalt;
exports.encryptPassword = encryptPassword;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
