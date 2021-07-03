const express = require('express');
const router = express.Router();
const { Game, Reservation, User } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('./security-utils');

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;
        let reservation = await Reservation.create(req.body);
        res.status(201).send({reservation})
    } catch (e) {
        res.status(400).send(e)
    }
}));

router.get('', [authenticated], asyncHandler(async(req, res) => {
    const user = req.user;
    const reservations = await Reservation.findAll({});
    res.json({reservations});
}));

router.get('/:resGameId', async(req, res) => {
    const [reservationId, gameId] = req.params.resGameId.split('-').map(id => Number(id));
    let reservation;
    if (reservationId) {
        reservation = (await Reservation.findByPk(reservationId)).dataValues;
        const game = (await Game.findByPk(gameId)).dataValues;
        reservation.game = game;
    } else {
        reservation = {game : (await Game.findByPk(gameId)).dataValues};
    }
    res.json({reservation});
})

router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    let reservation = await Reservation.findByPk(Number(req.params.id));
    if (reservation.playerId !== req.user.id) res.status(401).send("Unauthorized Access");
    Object.keys(req.body).forEach(key => reservation[key] = req.body[key]);
    await reservation.save();
    let game = (await Game.findByPk(reservation.gameId)).dataValues;
    reservation = {...reservation.dataValues, game};
    res.status(200).json({reservation});
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    const reservation = await Reservation.findByPk(Number(req.params.id));
    if (reservation.playerId !== req.user.id) res.status(401).send("Unauthorized Access");
    try{
      await reservation.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;
