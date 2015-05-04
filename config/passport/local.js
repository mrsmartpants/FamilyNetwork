/**
 * Module dependencies.
 */

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var auth = require('../../app/services/authorization');


/**
 * Expose
 * @method setup
 * @param {} User
 * @param {} config
 * @return 
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
 * Description
 * @method load
 * @param {} router
 * @return router
 */
exports.load = function(router) {
  router.post('/', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      var error = err || info;
      console.log(error);
      if (error) return  res.status(401).json(error);
      if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

      var token = auth.signToken(user.id, user.role);
      res.status(200).json({token: token});
    })(req, res, next)
  });

  return router;
};


