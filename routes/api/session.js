const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const { favoriteProb } = require('../../db/seederData/favorites');
const router = require('express').Router();
const { Favorite, Sport } = require('../../db/models');

const UserRepository = require('../../db/user-repository');
const { authenticated, generateToken } = require('./security-utils');

const Email = check('Email').isEmail().withMessage('Provide valid email').normalizeEmail();
const Password = check('Password').not().isEmpty().withMessage('Provide password');

router.get('', asyncHandler(async(req, res, next) => {res.json({message: "Hello world"});}));

router.put('', [Email, Password],
  asyncHandler(async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next({ status: 422, errors: errors.array() });
  let user;
  try {
    user = await UserRepository.findByEmail(req.body.Email);
  } catch (e) {
    return next({ status: 401, message: "Invalid credentials" });
  }
  if (!user.isValidPassword(req.body.Password)) {
    let error = new Error('Invalid credentials');
    error = {...error, status: 401, title: 'Login failed', errors: ['Invalid credentials']};
    return next(error);
  }
  const { jti, token } = generateToken(user);
  user.tokenId = jti;
  await user.save();
  let favorites = await Favorite.findAll({where: {userId: user.id}});
  user = user.dataValues;
  delete user.hashedPassword;
  // user.favorites = favorites.map(async favorite => {
  //   let Skills = JSON.parse((await Sport.findByPk(favorite.sportId)).Skills);
  //   return {id: favorite.id, Name: favorite.Name, Skill: favorite.Skill, Skills};
  // });
  res.cookie('token', token);
  res.json({user});
  // res.json({ user: user.toSafeObject() });
}));

router.delete('', [authenticated],
  asyncHandler(async(req, res) => {
  req.user.tokenId = null;
  await req.user.save();
  res.clearCookie('token');
  res.json({ message: 'success' });
}));

module.exports = router;
