const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const router = require('express').Router();

const { User, Event, Reservation, Favorite, Sport } = require('../../db/models');
const { authenticated, generateToken } = require('./security-utils');
const { uploadFile } = require('../../s3helper.js');
const checkLocation = require('./checkLocation');

// const BUCKET = 'volleyballbucket';

const email = check('Email').isEmail().withMessage('Give a valid email address').normalizeEmail();
// const firstName = check('firstName').not().isEmpty().withMessage('Provide first name');
// const lastName = check('lastName').not().isEmpty().withMessage('Provide last name');
const password = check('password').not().isEmpty().withMessage('Provide a password');

// used in User component
router.post('', [email, password],
  asyncHandler(async (req, res, next) => {
    let [user, message, status] = [{}, '', 400];
    const errors = validationResult(req).errors;
    if (errors.length) {
      message = errors[0].msg;
    } else {
      let otherUser1 = await User.findOne({ where: { Email: req.body.Email } });
      let otherUser2 = await User.findOne({ where: { Nickname: req.body.Nickname } });
      if (otherUser1) {
        message = "That email is taken.";
      } else if (otherUser2) {
        message = "That nickname is taken.";
      } else {
        // confirm that Google Maps API can find a route between user's address & NYC
        let checked = await checkLocation(req.body.Address);
        if (checked.success) {
          req.body.Address = checked.Location;
          user = (await User.build(req.body)).setPassword(req.body.password);
          const { jti, token } = generateToken(user);
          user.tokenId = jti;
          res.cookie("token", token);
          await user.save();
          sportIds = (await Sport.findAll({})).map(sport => sport.dataValues.id);
          // Give a new user all minimum values of skill-level.
          sportIds.forEach(async sportId => await Favorite.create({userId: user.id, sportId, Skill: 0}));
          user = user.toSafeObject();
          status = 201;
        } else {
          message = `There is something wrong with your address (${req.body.Address}).`
        }
      }
    }
    res.status(status).json({user: {...user, message}});
  }));

// used in putPost handler of User component
router.put('', [authenticated, email, password],
  asyncHandler(async (req, res, next) => {
    try {
    let [user, message, status] = [req.user, '', 200];
    const errors = validationResult(req).errors;
    if (user.id === 1) {
      message = "You cannot modify our 'demo' user's details, which are needed in order to allow our site's visitors  to login easily.  Feel free to use the 'Signup' route to create a new user if you'd like to test out the   'Manage Account' route.";
      status = 400;
    } else if (errors.length) {
      message = errors[0].msg;
      status = 400;
    } else {
      let otherUser1 = await User.findOne({
        where: {
          [Sequelize.Op.and]: [
            { Email: req.body.Email },
            { [Sequelize.Op.not]: { id: user.id } }
          ]
        }
      });
      let otherUser2 = await User.findOne({
        where: {
          [Sequelize.Op.and]: [
            { Nickname: req.body.Nickname },
            { [Sequelize.Op.not]: { id: user.id } }
          ]
        }
      });
      if (otherUser1) {
        message = `That email (${req.body.Email}) is taken.`;
        delete req.body.Email;
      } else if (otherUser2) {
        message = `That nickname (${req.body.Nickname}) is taken.`;
        delete req.body.Nickname
      } else {
        // confirm that Google Maps API can find a route between user's address & NYC
        let checked = await checkLocation(req.body.Address);
        if (checked.success) {
          req.body.Address = checked.Location;
        } else {
          message = `There is something wrong with your new home address (${req.body.Address}).`
          delete req.body.Address;
        }
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
    }
    res.status(status).json({ user: { ...user.toSafeObject(), message } });
  } catch(e) {
    console.log(e)
  }
  })
);

// not used
router.get('', asyncHandler(async (req, res, next) => {
  const users = await User.findAll();
  res.json({users});
}));

// used in User component
router.delete("", [authenticated], asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.id === 1) return res.json({ message: "You cannot delete my 'demo' user, because visitors to my site use that for testing purposes.  Create a new user via the 'Signup' route if you'd like to test out the deletion of a user." })

  try {
    await user.destroy();
    user.tokenId = null;
    res.clearCookie('token');
    res.json({});
  } catch (e) {
    res.status(400).send(e);
  }
}));

module.exports = router;
