'use strict';

const bcrypt = require('bcryptjs');
const { numberOfUsers } = require('../seederNumbers');
const createPassword = () => bcrypt.hashSync('password');
const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const fNames = ['Aaron', 'Ben', 'Curtis', 'Darius', 'Ed', 'Fred', 'Geoffrey', 'Hal', 'Ian', 'Javier', 'Krisna', 'Lauren', 'Mylo', 'Nick', 'Olive', 'Pete', 'Quincy', 'Rose', 'Simon', 'Tyna', 'Ugo', 'Vann', 'Warren', 'Yul', 'Zachery'];

const users = [{email: 'volleyb@aol.com', nickName: 'Volley B', firstName: 'Volley', lastName: 'Ball'}];

for (const firstName of fNames.slice(0, numberOfUsers - 1)) {
  users.push({
    email: firstName[0].toLowerCase() + 'doe@aol.com',
    nickName: firstName + ' D',
    firstName: firstName,
    lastName: 'Doe'
  });
}

users.forEach(user => {
  user.cell = 10 ** 9 + Math.floor(Math.random() * 1.14 * 10 ** 9);
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
