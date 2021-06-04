'use strict';

const bcrypt = require('bcryptjs');

function createPassword() {
  return bcrypt.hashSync('password');
}

function r(o) {
  o.createdAt = new Date();
  o.updatedAt = new Date();
  return o;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      r({
        email: 'volleyb@aol.com',
        nickName: 'Volley B',
        firstName: 'Volley',
        lastName: 'Ball',
        cell: 1234567890,
        skill: 7,
        photo: "Volley B's photoURL",
        hashedPassword: await bcrypt.hash('password',10)
      }),
      r({
        email: 'jdoe@aol.com',
        nickName: 'John D',
        firstName: 'John',
        lastName: 'Doe',
        cell: 1345678901,
        skill: 4,
        photo: "John D's photoURL",
        hashedPassword: await bcrypt.hash('password',10)
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users');
  }
};
