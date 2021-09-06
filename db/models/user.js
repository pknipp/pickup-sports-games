'use strict';
const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User",
    {
      Email: {allowNull: false, type: DataTypes.STRING, unique: true
        // validates: {isEmail: true, len: [3, 255]},
      },
      Address: {allowNull: false, type: DataTypes.STRING},
      Nickname: {allowNull: false, type: DataTypes.STRING, unique: true
        // validates: {isEmail: true, len: [3, 255]},
      },
      Photo: {type: DataTypes.TEXT},
      tokenId: {type: DataTypes.STRING},
      hashedPassword: {allowNull: false, type: DataTypes.STRING.BINARY, validates: {len: [60, 60]}},
      ...['First name', 'Last name'].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: DataTypes.STRING}});
      }, {}),
      ...['Cell'].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: DataTypes.INTEGER}});
      }, {}),
    },
    {
      defaultScope: {
        attributes: {
//          exclude: ["hashedPassword", "createdAt", "updatedAt"],
          exclude: ["Updated at"],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Event, {foreignKey: 'userId'});
    User.hasMany(models.Reservation, {foreignKey: 'userId'});
    // insert a belongsToMany relationship between User and Event, via Reservations
  };

  User.prototype.toSafeObject = function () {
    // DRY up the following, by simply deleting the hashedpassword property from the pojo
    return ["Created at", "Email", "First name", "Last name", "Nickname", "Address", "Photo", "Cell", "id"].reduce((pojo, key) => {
      return {...pojo, [key]: this[key]}
    }, {});
  }

  User.login = async function({ Email, Password }) {
    const user = await User.scope('loginUser').findOne({where: [{ Email }]});
    if (user && user.validatePassword(Password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.prototype.validatePassword = function(Password) {
    return bcrypt.compareSync(Password, this.hashedPassword.toString());
  };

  User.prototype.isValid = () => true;

  User.prototype.setPassword = function (Password) {
    this.hashedPassword = bcrypt.hashSync(Password);
    return this;
  };

  User.prototype.isValidPassword = function (Password) {
    return bcrypt.compareSync(Password, this.hashedPassword.toString());
  };

  User.getCurrentUserById = async function(id) {
    return await User.scope("currentUser").findByPk(id);
  };

  return User;
};
