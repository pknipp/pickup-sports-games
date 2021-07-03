'use strict';

const bcrypt = require('bcryptjs');
const { people, numberOfUsers } = require('../seederData/users');
const createPassword = () => bcrypt.hashSync('password');
const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const users = [{email: 'volleyb@aol.com', address: 'Philadelphia PA', nickName: 'Volley B', firstName: 'Volley', lastName: 'Ball'}];

people.slice(0, numberOfUsers - 1).forEach(person => {
  let firstName = person[0];
  users.push({
    email: firstName[0].toLowerCase() + 'doe@aol.com',
    address: person[1],
    nickName: firstName + ' D',
    firstName,
    lastName: 'Doe'
  });
})

users.forEach(user => {
  user.cell = 10 ** 9 + Math.floor(Math.random() * 9 * 10 ** 9);
  user.skill = 1 + Math.floor(Math.random() * 8);
  user.photo = `${user.firstName}'s photoURL`;
  user.hashedPassword = createPassword();
  user = r(user);
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users')
};
