'use strict';

var should = require('should');
var app = require('../../app');
var User = require('../../app/models').User;
var Sequelize = require('../../app/models').sequelize;


var userObject = {
  provider: 'local',
  firstName: 'Fake',
  lastName: 'User',
  email: 'fakeuser@email.com',
  password: 'password'
};

var testUser = User.build(userObject);


describe('User Model', function () {
  before(function (done) {
    // Clear users before testing
    User.sync({force: true})
      .then(function () {
        done();
      });
  });

  afterEach(function (done) {
    User.sync({force: true})
      .then(function () {
        done();
      });
  });

  after(function (done) {
    Sequelize.close();
    done();
  });

  it('should begin with no users', function (done) {
    User.findAll()
      .then(function (users) {
        users.should.have.length(0);
        done();
      })
      .catch(function (err) {
        done()
      });
  });

  it('should fail when saving a duplicate user', function (done) {
    testUser.save()
      .then(function () {
        //create duplicate user
        User.create(userObject)
          .catch(function (err) {
            should.exist(err);
            done();
          });
      });
  });

  it('should fail when saving without an email', function (done) {
    testUser.email = '';
    testUser.save()
      .catch(function (err) {
        should.exist(err);
        done();
      });
  });

  it("should authenticate user if password is valid", function () {
    return testUser.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function () {
    return testUser.authenticate('blah').should.not.be.true;
  });
});
