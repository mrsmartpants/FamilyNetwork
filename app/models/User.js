var authService = require('../services/auth');

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
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      hashedPassword: DataTypes.STRING,
      provider: DataTypes.STRING,
      salt: DataTypes.STRING,
      password: {
        type: DataTypes.VIRTUAL,
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
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  );
};
