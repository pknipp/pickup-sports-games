const express = require('express');
const router = express.Router();
const { Game, Reservation, User } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('./security-utils');

router.post('/', asyncHandler(async (req, res, next) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).send(game)
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
        // here goes fetch call to determine distance/travel-time between user and game
        game.travelTime = travelTime;
        // transform Query to a pojo, to enable us to compute its length
        const reservations = (await Reservation.findAll({where: {gameId: game.id}})).map(reservation => reservation.dataValues);
        game.count = reservations.length;
        game.reserved = reservations.some(reservation => reservation.playerId === user.id);
    }
    res.json({games});
}));

router.get('/:id', async(req, res) => {
    const id = Number(req.params.id);
    const game = await Game.findByPk(id);
    let owner = await User.findByPk(game.ownerId);
    const reservations = await Reservation.findAll({where: {gameId: game.id}});
    let players = [];
    reservations.forEach(async(reservation) => {
        let player = await User.findByPk(reservation.playerId);
        players.push(player);
    });
    res.json({...game, owner, players});
})

// Do we want to allow a game owner to transfer game-"owner"ship to another user?
router.put('/:id', async (req, res) => {
    const userId = req.body.id;
    // const game = await Game.findOne({ id: req.params.id })
    const game = await Game.findByPk(Number(req.params.id));

    if (game.ownerId !== userId) {
        res.status(401).send("Unauthorized Access");
    }
    game = {...game, ...req.body};
    await game.save();
    res.status(200).json(game);

});

router.delete("", [authenticated], asyncHandler(async(req, res) => {
    const user = req.user;
    const game = await Game.findByPk(Number(req.params.id))   ;
    if (game.ownerId !== user.id) res.status(401).send("Unauthorized Access");
    try{
      await game.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;
