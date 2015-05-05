var authService = require('../services/authorization');
var config = require('../../config/environment');

/**
 * Exposes the user model
 * @method exports
 * @param {object} sequelize
 * @param {object} DataTypes
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      role: {
        type: DataTypes.ENUM,
        defaultValue: 'user',
        values: config.userRoles
      },
      hashedPassword: DataTypes.STRING,
      provider: DataTypes.STRING,
      salt: DataTypes.STRING,

      //Virtuals
      password: {
        type: DataTypes.VIRTUAL,
        /**
         * Setter method for the virtual password column
         * of the User database/model. When a user instance is saved
         * the unencrypted password is taken to this method and
         * saves the hashed password and salt to the database
         * @method set
         * @param {String} password
         */
        set: function (password) {
          this.setDataValue('password', password);
          this.setDataValue('salt', authService.makeSalt());
          this.setDataValue('hashedPassword', authService.encryptPassword(password, this.getDataValue('salt')));
        }
        //validate: {
        //  isLongEnough: function (val) {
        //    if (val.length < 7) {
        //      throw new Error("Please choose a longer password")
        //    }
        //  }
        //}
      },
      profile: {
        type: DataTypes.VIRTUAL,
        /**
         * Getter method for the virtual profile column
         * of the User database/model
         * @method get
         * @return {object} profile - the user's public profile
         */
        get: function () {
          return {
            id: this.getDataValue('id'),
            name: this.getDataValue('firstName') + ' ' + this.getDataValue('lastName'),
            role: this.getDataValue('role')
          }
        }
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      instanceMethods: {

        /**
         * Authenticate - check if the passwords are the same
         * @method authenticate
         * @param {String} password
         * @return {Boolean} expression true if given password is the user's
         */
        authenticate: function(password) {
          return authService.encryptPassword(password, this.getDataValue('salt')) === this.hashedPassword;
        }
      }
    }
  );
};
