const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const router = require('express').Router();

const { User, Event, Reservation, Favorite, Sport } = require('../../db/models');
const { authenticated, generateToken } = require('./security-utils');
const { uploadFile } = require('../../s3helper.js');
const checkLocation = require('./checkLocation');

// const BUCKET = 'volleyballbucket';

const email = check('Email').isEmail().withMessage('Provide a valid email address.').normalizeEmail();
// const firstName = check('firstName').not().isEmpty().withMessage('Provide first name');
// const lastName = check('lastName').not().isEmpty().withMessage('Provide last name');
const password = check('password').not().isEmpty().withMessage('Provide a password.');

// used in User component
router.post('', [email, password],
  asyncHandler(async (req, res, next) => {
    try {
    let [user, messages] = [{}, []];
    const errors = validationResult(req).errors;
    if (errors.length) return res.status(400).json({messages: [errors[0].msg]});
    for (const key of ["Email", "Nickname"]) {
      let otherUser = await User.findOne({where: {[key]: req.body[key] }});
      if (otherUser) {
        messages.push(`That ${key} (${req.body[key]}) is taken.`);
        delete req.body[key];
      }
    }
    // confirm that Google Maps API can find a route between user's address & NYC
    let checked = await checkLocation(req.body.Address);
    if (!checked.success) messages.push(`There is something wrong with your address (${req.body.Address}).`);
    if (messages.length) return res.status(400).json({messages});
    req.body.Address = checked.Location;
    user = (await User.build(req.body)).setPassword(req.body.password);
    const { jti, token } = generateToken(user);
    user.tokenId = jti;
    res.cookie("token", token);
    await user.save();
    user = user.dataValues;
    delete user.hashedPassword;
    res.status(201).json({...user, messages});
    }catch(e){console.log(e)}
  }));

// used in putPost handler of User component
router.put('', [authenticated, email, password],
  asyncHandler(async (req, res, next) => {
    // try{
    let user = req.user;
    const errors = validationResult(req).errors;
    if (errors.length) return res.status(400).json({messages: [errors[0].msg]});
    if (user.id === 1) {
      return res.status(400).json({messages: ["You cannot modify our 'demo' user's details, which are needed in order to allow our site's visitors  to login easily.  Feel free to use the 'Signup' route to create a new user if you'd like to test out the 'Manage Account' route."]});
    }
    let messages = [];
    for (const key of ["Email", "Nickname"]) {
      let otherUser = await User.findOne({where: {[Sequelize.Op.and]: [
        { [key]: req.body[key] },
        {[Sequelize.Op.not]: { id: user.id } }
      ]}});
      if (otherUser) {
        messages.push(`That ${key} (${req.body[key]}) is taken.`);
        delete req.body[key];
      }
    }

    // confirm that Google Maps API can find a route between user's address & NYC
    let checked = await checkLocation(req.body.Address);
    if (checked.success) {
      req.body.Address = checked.Location;
    } else {
      messages.push(`There is something wrong with your new home address (${req.body.Address}).`);
      delete req.body.Address;
    }

    Object.entries(req.body).filter(([key,]) => key !== 'password').forEach(([key, value]) => {
      user[key] = value;
    });
    user = user.setPassword(req.body.password);
    const { jti, token } = generateToken(user);
    user.tokenId = jti;
    res.cookie("token", token);
    await user.save();
    if (req.body.index) {
      let favorites = (await Favorite.findAll({where: {userId: user.id}})).sort((a, b) => a.Name - b.Name);
      let favorite = favorites[req.body.index - 1];
      favorite.Skill = req.body.Skill;
      await favorite.save();
    }
    user = user.dataValues;
    delete user.hashedPassword;
    res.json({...user, messages });
    // }catch(e){console.log(e)}
  })
);

// used in User component
router.delete("", [authenticated], asyncHandler(async (req, res) => {
  // try {
  const user = req.user;
  if (user.id === 1) return res.json({ message: "You cannot delete my 'demo' user, because visitors to my site use that for testing purposes.  Create a new user via the 'Signup' route if you'd like to test out the deletion of a user." })
  await user.destroy();
  user.tokenId = null;
  res.clearCookie('token');
  res.json({});
  // } catch (e) {res.status(400).send(e);}
}));

module.exports = router;
