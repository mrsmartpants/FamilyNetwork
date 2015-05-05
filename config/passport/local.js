/**
 * Module dependencies.
 */

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var auth = require('../../app/services/authorization');


/**
 * Expose and use the local passport strategy
 * @method setup
 * @param {object} User the user model
 * @param {object} config the config
 * @return {object} the done callback
 */
exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {

      User.find({
        where: {email: email.toLowerCase()}
      })
        .then(function (user) {
          if (!user) {
            return done(null, false, {message: 'This email is not registered.'});
          }
          if (!user.authenticate(password)) {
            return done(null, false, {message: 'This password is not correct.'});
          }
          return done(null, user);
        })
        .catch(function(reason) {
          done(reason);
        });

    }));
};

/**
 * Load the local strategy into a route
 * @method load
 * @param {object} router
 * @return {object} the express router object
 */
exports.load = function(router) {
  router.post('/', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      var error = err || info;
      if (error) return  res.status(401).json(error);
      if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

      var token = auth.signToken(user.id, user.role);
      return res.status(200).json({token: token});
    })(req, res, next)
  });

  return router;
};


