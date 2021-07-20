const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Game, Reservation, User } = require("../../db/models");
const { authenticated } = require('./security-utils');
const { mapsConfig: { mapsApiKey } } = require('../../config');
const checkAddress = require('./checkAddress');

const router = express.Router();
// const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    let [game, message, status] = [{}, '', 201];
    try {
        req.body.ownerId = req.user.id;
        req.body.dateTime = faker.date.future();
        let checked = await checkAddress(req.body.address);
        if (checked.success) {
          req.body.address = checked.address;
          game = (await Game.create(req.body)).dataValues;
          game = {...game, count: 0, reservationId: 0};
        } else {
          game.message = `There is something wrong with your game's address (${req.body.address}).`
          status = 400;
        }
        res.status(status).json({game});
    } catch (e) {
        res.status(400).send(e)
    }
}));

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    const user = req.user;
    // transform Query return to an array of pojos, to enable us to attach properties to each
    const games = (await Game.findAll({})).map(game => game.dataValues);
    const allVenues = [];
    games.forEach(async game => {
        allVenues.push(game.address);
        game.owner = (await User.findByPk(game.ownerId)).dataValues;
        delete game.owner.hashedPassword;
        let reservations = await Reservation.findAll({where: {gameId: game.id}});
        // transform Query to an array of pojos, to enable us to compute array's length
        game.count = reservations.map(reservation => reservation.dataValues).length;
        // Set reservationId to zero if no reservation for this game has been made by this user.
        game.reservationId = reservations.reduce((reservationId, reservation) => {
            return (reservation.playerId === user.id ? reservation.id : reservationId);
        }, 0);
    })
    // fetch travel-Time between user and a bundled array of addresses ("venues")
    // google restricts each bundle to contain no more than 25 addresses
    const maxFetch = 25;
    let nBundle = 0;
    while (allVenues.length) {
      let venues = allVenues.splice(0, Math.min(maxFetch, allVenues.length));
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${user.address}&destinations=${venues.join('|')}&key=${mapsApiKey}`);
      let data = await response.json();
      data.rows[0].elements.forEach((element, index) => {
        games[index + nBundle * maxFetch].duration = element.duration;
      });
      nBundle++;
    }
    res.json({games});
}));

router.get('/:id', [authenticated], asyncHandler(async(req, res, next) => {
  const user = req.user;
  const gameId = Number(req.params.id);
  const game = await Game.findByPk(gameId);
  if (game.ownerId !== user.id) return next({ status: 401, message: "You are not authorized." });
  const reservations = await Reservation.findAll({where: {gameId}});
  let players = [];
  for await (reservation of reservations) {
    const player = (await User.findByPk(reservation.playerId)).dataValues;
    reservation = reservation.dataValues;
    ['gameId', 'id', 'playerId', 'createdAt'].forEach(prop => delete reservation[prop]);
    ['firstName', 'lastName', 'address', 'tokenId', 'hashedPassword'].forEach(prop => delete player[prop]);
    player.reservation = reservation;
    players.push(player);
  };
  res.json({game: {...game.dataValues, owner: user, players}});
}))

// Do we want to allow a game owner to transfer game-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    let game = await Game.findByPk(Number(req.params.id));
    let message = '';
    if (game.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    // confirm that Google Maps API can find a route between game's address & NYC
    let checked = await checkAddress(req.body.address);
    if (checked.success) {
      req.body.address = checked.address;

    } else {
      message = `There is something wrong with your game's address (${req.body.address}).`
      delete req.body.address;
    }
    Object.entries(req.body).forEach(([key, value]) => {
        game[key] = value !== '' ? value : null;
    });
    await game.save();
    game = {...game.dataValues, message};
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
