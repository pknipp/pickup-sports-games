const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const router = require('express').Router();

const UserRepository = require('../../db/user-repository');
const { authenticated, generateToken } = require('./security-utils');

const email = check('email').isEmail().withMessage('Provide valid email').normalizeEmail();
const password = check('password').not().isEmpty().withMessage('Provide password');

router.get('', asyncHandler(async(req, res, next) => {res.json({message: "Hello world"});}));

router.put('', [email, password],
  asyncHandler(async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next({ status: 422, errors: errors.array() });
  let user;
  try {
    user = await UserRepository.findByEmail(req.body.email);
  } catch (e) {
    return next({ status: 401, message: "Invalid credentials" });
  }
  if (!user.isValidPassword(req.body.password)) {
    let error = new Error('Invalid credentials');
    error = {...error, status: 401, title: 'Login failed', errors: ['Invalid credentials']};
    return next(error);
  }
  const { jti, token } = generateToken(user);
  user.tokenId = jti;
  await user.save();
  res.cookie('token', token);
  res.json({ user: user.toSafeObject() });
}));

router.delete('', [authenticated],
  asyncHandler(async(req, res) => {
  req.user.tokenId = null;
  await req.user.save();
  res.clearCookie('token');
  res.json({ message: 'success' });
}));

module.exports = router;
