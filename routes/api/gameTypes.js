const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const gameType = require('../../db/models/gameType');

const router = express.Router();

router.get('', asyncHandler(async(req, res, next) => {
    // transform Query return to an array of pojos, to enable us to attach properties to each
    res.json((await GameType.findAll({})).map(gameType => gameType.dataValues));
}));

module.exports = router;
