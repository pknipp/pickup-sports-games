const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Game, Reservation, User } = require("../../db/models");
const { authenticated } = require('./security-utils');
const { mapsConfig: { mapsApiKey } } = require('../../config');

const router = express.Router();

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;
        req.body.dateTime = faker.date.future();
        //Transform query return to a pojo, so that we can attach properties
        let game = (await Game.create(req.body)).dataValues;
        // Should the following be done in a separate games/get fetch?
        game = {...game, count: 0, travelTime: 0, reservationId: 0}
        res.status(201).send({game})
    } catch (e) {
        res.status(400).send(e)
    }
}));

// router.get('/:lat/:long/:radius', async (req, res) => {
// router.get('', [authenticated], asyncHandler(async(req, res) => {
router.get('', authenticated, asyncHandler(async(req, res, next) => {
    const user = req.user;
    // transform Query return to an array of pojos, to enable us to attach properties to each
    const games = (await Game.findAll({})).map(game => game.dataValues);
    const venues = [];
    // replace for-loop w/forEach?
    for (let i = 0; i < games.length; i++) {
        let game = games[i];
        venues.push(game.address.split(' ').join('+'));
        game.owner = (await User.findByPk(game.ownerId)).dataValues;
        let reservations = await Reservation.findAll({where: {gameId: game.id}});
        // transform Query to an array of pojos, to enable us to compute array's length
        game.count = reservations.map(reservation => reservation.dataValues).length;
        // Set reservationId to zero if no reservation for this game has been made by this user.
        game.reservationId = reservations.reduce((reservationId, reservation) => {
            return (reservation.playerId === user.id ? reservation.id : reservationId);
        }, 0);
    }
    // fetch travel-Time between user and array of addresses ("venues")
    let elements;
    await(async () => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${user.address.split(' ').join('+')}&destinations=${venues.join('|')}&key=${mapsApiKey}`);
        let data = await response.json();
        // console.log("data = ", data);
        if (response.ok) elements = data.rows[0].elements;
    })()
    elements.forEach((element, index) => {
        games[index].duration = element.duration;
    })
    res.json({games});
}));

router.get('/:id', async(req, res) => {
    const id = Number(req.params.id);
    // Transform query return to a pojo, so that we can attach two properties.
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
    Object.entries(req.body).forEach(([key, value]) => {
        game[key] = value !== '' ? value : null;
    });
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
