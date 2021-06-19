const express = require('express');
const router = express.Router();
const { Game, Reservation, User } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('./security-utils');

router.post('/', [authenticated], asyncHandler(async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;
        const game = await Game.create(req.body);
        res.status(201).send({game})
    } catch (e) {
        res.status(400).send(e)
    }
}));

// router.get('/:lat/:long/:radius', async (req, res) => {
router.get('', [authenticated], asyncHandler(async(req, res) => {
    const user = req.user;
    // transform Query return to a pojo, to enable us to attach properties to it
    const games = (await Game.findAll({})).map(game => game.dataValues);
    let travelTime = 0;
    for (const game of games) {
        // here'll eventually be the fetch to get distance/travel-time between user and game
        game.travelTime = travelTime;
        let reservations = (await Reservation.findAll({where: {gameId: game.id}}));
        // transform Query to a pojo, to enable us to compute its length
        reservations = reservations.map(reservation => reservation.dataValues);
        game.count = reservations.length;
        // Set reservationId to zero if no reservation for this game has been made by this user.
        game.reservationId = reservations.reduce((reservationId, reservation) => {
            return reservationId || (reservation.id === user.id ? reservation.id : reservationId);
        }, 0);
    }
    res.json({games});
}));

router.get('/:id', async(req, res) => {
    const id = Number(req.params.id);
    const game = (await Game.findByPk(id)).dataValues;
    let owner = await User.findByPk(game.ownerId);
    const reservations = await Reservation.findAll({where: {gameId: game.id}});
    let players = [];
    reservations.forEach(async(reservation) => {
        players.push(await User.findByPk(reservation.playerId));
    });
    res.json({game: {...game, owner, players}});
})

// Do we want to allow a game owner to transfer game-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    const game = await Game.findByPk(Number(req.params.id));
    if (game.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    Object.keys(req.body).forEach(key => game[key] = req.body[key]);
    await game.save();
    res.status(200).json({game});
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    const game = await Game.findByPk(Number(req.params.id))   ;
    if (game.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    try{
      await game.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;
