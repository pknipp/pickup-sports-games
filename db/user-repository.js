const { User } = require('./models');

class NullUser {
  isValid() { return false; }
  setPassword() {}
  isValidPassword() { return false; }
  toSafeObject() { return {}; }
}

async function create(details) {
  const user = await User.build(details);
  user.setPassword(details.Password);
  return await user.save();
}

async function findByEmail(Email) {
  let user;
  try {
    user = await User.findOne({ where: { Email } });
  } catch (error) {
    console.error(error);
    return next({ status: 401, message: "User.findOne made an error" });
  }
  return user || new NullUser();
}

async function findByTokenId(tokenId) {
  const user = await User.findOne({ where: { tokenId } });
  return user || new NullUser();
}

module.exports = {
  create,
  findByEmail,
  findByTokenId,
};
