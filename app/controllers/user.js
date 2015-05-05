'use strict';

var User = require('../models').User;
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var getAttributes = ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt'];

/**
 * Sends a json validation error
 * @callback validationError
 * @access private
 * @param {object} res the response object
 * @param {String} err
 * @return error - the validation error
 */
var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 * @method index
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @return the response
 */
exports.index = function (req, res) {
  User.findAll({attributes: getAttributes})
    .then(function (users) {
      res.json(200, users);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
};

/**
 * Creates a new user
 * @method create
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {object} next - the next callback
 * @return {validationError}
 */
exports.create = function (req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');

  newUser.save()
    .then(function (user) {
      var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
      res.json({token: token});
    })
    .catch(function (err) {
      return validationError(res, err);
    })
};

/**
 * Get a single user
 * @method show
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {object} next - the next callback
 * @return {object} next callback
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.find({where: {id: userId}})
    .then(function (user) {
      if (!user) return res.send(401);
      res.json(user.profile);

    }).catch(function (err) {
      return next(err);
    })
};

/**
 * Deletes a user
 * restriction: 'admin'
 * @method destroy
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @return response
 */
exports.destroy = function (req, res) {
  User.destroy({where: {id: req.params.id}})
    .then(function (user) {
      return res.send(204);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
};

/**
 * Change a users password
 * @method changePassword
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {object} next - the next callback
 * @return {validationError}
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user.id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({where: {id: userId}})
    .then(function (user) {
      if (user.authenticate(oldPass)) {

        user.update({password: newPass})
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            return validationError(res, err);
          });

      } else {
        res.sendStatus(403);
      }
    })
    .catch(function (err) {
      res.send(500, err);
    });
};

/**
 * Get my info
 * @method me
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {object} next - the next callback
 * @return response
 */
exports.me = function (req, res, next) {
  var userId = req.user.id;

  User
    .find({ where: {id: userId}, attributes: getAttributes })
    .then(function (user) {
      if (!user) return res.json(401);
      res.send(user.profile);
    })
    .catch(function (err) {
      console.log(err);
      return res.send(err);
    });
};

/**
 * Authentication callback
 * @callback authCallback
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {object} next - the next callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
