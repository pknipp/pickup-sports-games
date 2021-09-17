const express = require('express');
const asyncHandler = require('express-async-handler');
const { Sport } = require('../../db/models');
const router = express.Router();

router.get('', asyncHandler(async(req, res, next) => {
    // try {
    let sports = (await Sport.findAll()).map(sport => sport.dataValues);
    sports.forEach(sport => sport.Skills = JSON.parse(sport.Skills));
    // console.log("sports = ", sports);
    res.json({sports});
    // } catch(e) {console.log(e)}
}));

module.exports = router;
