const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Sport } = require('../../db/models');
// const { authenticated } = require('./security-utils');

const router = express.Router();

router.get('', asyncHandler(async(req, res, next) => {
    try {
    let sports = (await Sport.findAll({})).map(sport => sport.dataValues);
    sports.forEach(sport => sport.Skills = JSON.parse(sport.Skills));
    res.json({sports});
} catch(e) {
    console.log(e)
}
}));

module.exports = router;
