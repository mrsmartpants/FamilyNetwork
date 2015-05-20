'use strict';

var should = require('should');
var app = require('../../app');
var User = require('mongoose').model('User');

var user = new User({
  provider: 'local',
  email: 'fake@user.com',
  firstName: 'Fake',
  lastName: 'User',
  birthday: new Date('Dec 5 1991'),
  bio: 'Just another guy',
  gender: 'male',
  password: 'password'
});

describe('User Model', function () {
  before(function (done) {
    // Clear users before testing
    User.remove().exec().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    User.remove().exec().then(function () {
      done();
    });
  });

  it('should begin with no users', function (done) {
    User.find({}, function (err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function (done) {
    user.save(function () {
      var userDup = new User(user);
      userDup.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function (done) {
    var tempuser = user;
    tempuser.email = '';
    tempuser.save(function (err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function () {
    return user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function () {
    return user.authenticate('blah').should.not.be.true;
  });

  it("should have a virtual profile property", function () {
    user.email = 'test@test.com';
    user.save(function (err) {
      return user.should.have.property('profile');
    });
  });
});
