const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Event, Reservation, User, Sport, Favorite } = require("../../db/models");
const { authenticated } = require('./security-utils');
const { mapsConfig: { mapsApiKey } } = require('../../config');
const checkLocation = require('./checkLocation');

const router = express.Router();

// used by EditGame component
router.post('', [authenticated], asyncHandler(async (req, res, next) => {
  try {
  let [event, message, status] = [{}, '', 201];
  req.body.userId = req.user.id;
  // req.body.dateTime = faker.date.future();
  let checked = await checkLocation(req.body.Location);
  if (checked.success) {
    req.body.Location = checked.Location;
    ["sportId", "userId"].forEach(key => delete req.body[key]);
    console.log("req.body = ", req.body);
    event = (await Event.create(req.body)).dataValues;
    event = {...event, count: 0, reservationId: 0};
  } else {
    event.message = `There is something wrong with your event's location (${req.body.Location}).`
    status = 400;
  }
  res.status(201).json({id: event.id, message});
} catch(e) {
  console.log(e)
}
}));

// used by Home component (AKA ViewGames)
router.get('', [authenticated], asyncHandler(async(req, res, next) => {
  try {
    const user = req.user;
    const favorites = await Favorite.findAll({where: {userId: user.id}});
    // const favoriteIds = favorites.map(favorite => favorite.id);
    const events = (await Event.findAll({attributes: { exclude: ['sportId', 'userId'] }})).filter(event => {
      return favorites.map(favorite => favorite.id).includes(event.favoriteId);
    }).map(event => event.dataValues);
    const allVenues = [];
    events.forEach(async event => {
        allVenues.push(event.Location);
        let favorite = await Favorite.findByPk(event.favoriteId);
        let sport = await Sport.findByPk(favorite.sportId);
        event.Sport = sport.Name;
        event.Skills = JSON.parse(sport.Skills);
        event["Event organizer"] = (await User.findByPk(user.id)).dataValues.Nickname;
        let reservations = await Reservation.findAll({where: {eventId: event.id}});
        event["Player reservations"] = reservations.length;
        // Set reservationId to zero if no reservation for this event has been made by this user.
        event.reservationId = reservations.reduce((reservationId, reservation) => {
            return (reservation.userId === user.id ? reservation.id : reservationId);
        }, 0);
        ['favoriteId', 'createdAt', 'updatedAt'].forEach(key => delete event[key]);
    })
    // fetch travel-Time between user and a bundled array of addresses ("venues")
    // google restricts each bundle to contain no more than 25 addresses
    const maxFetch = 25;
    let nBundle = 0;
    while (allVenues.length) {
      let venues = allVenues.splice(0, Math.min(maxFetch, allVenues.length));
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${user.Address}&destinations=${venues.join('|')}&key=${mapsApiKey}`);
      let data = await response.json();
      data.rows[0].elements.forEach((element, index) => {
        events[index + nBundle * maxFetch].duration = element.duration;
      });
      nBundle++;
    }
    res.json({events});
  }catch(e) {
    console.log(e)
  }
}));

// Used by EditGame and ViewGame components
router.get('/:id', [authenticated], asyncHandler(async(req, res, next) => {
  try {
  const user = req.user;
  const eventId = Number(req.params.id);
  console.log("eventId = ", eventId);
  const event = (await Event.findByPk(eventId, {attributes: { exclude: ['sportId', 'userId'] }})).dataValues;
  console.log("event.id = ", event.id);
  console.log("favoriteId = ", event.favoriteId);
  let favorite = (await Favorite.findByPk(event.favoriteId)).dataValues;
  console.log("favorite.id = ", favorite.id)
  console.log("favorite.sportId = ", favorite.sportId);
  let sportId = favorite.sportId;

  const favorites = await Favorite.findAll({where: {userId: user.id}});
  const favoriteSportIds = favorites.map(favorite => favorite.sportId);
  event.Sports = (await Sport.findAll()).filter(sport => {
    return favoriteSportIds.includes(sport.id);
  }).map(sport => ({id: sport.id, Name: sport.Name, Skills: JSON.parse(sport.Skills)}));
  const sport = (await Sport.findByPk(sportId)).dataValues;
  const Skills = JSON.parse(sport.Skills);
  event.boolTypes = sport.boolTypes && JSON.parse(sport.boolTypes);
  if (favorite.userId !== user.id) return next({ status: 401, message: "You are not authorized." });
  const reservations = await Reservation.findAll({where: {eventId}});
  let players = [];
  for await (reservation of reservations) {
    let player = (await User.findByPk(reservation.userId)).dataValues;
    console.log("player = ", player)
    console.log("sportId/player.id = ", sportId, player.id);
    player.Skill = (await Favorite.findOne({where: {sportId, userId: player.id}})).Skill;
    reservation = reservation.dataValues;
    reservation.boolVals = JSON.parse(reservation.boolVals);
    ['eventId', 'id', 'userId', 'createdAt'].forEach(prop => delete reservation[prop]);
    ['First name', 'Last name', 'Address', 'tokenId', 'hashedPassword', 'updatedAt'].forEach(prop => delete player[prop]);
    player = {...player, ...reservation};
    players.push(player);
  };
  res.json({event: {...event, owner: user, players, sport, Skills}});
} catch(e) {
  console.log(e)
}
}))

// Used by EditGame component.
// Do we want to allow an event owner to transfer event-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
  try {
    const eventId = Number(req.params.id);
    let event = await Event.findByPk(eventId, {attributes: { exclude: ['sportId', 'userId'] }});
    let favorite = await Favorite.findByPk(event.favoriteId);
    let message = '';
    if (favorite.userId !== req.user.id) res.status(401).send("Unauthorized Access");
    // confirm that Google Maps API can find a route between event's address & NYC
    let checked = await checkLocation(req.body.Location);
    if (checked.success) {
      req.body.Location = checked.Location;
    } else {
      message = `There is something wrong with your event's location (${req.body.Location}).`
      delete req.body.Location;
    }
    if (req.body.sportId !== favorite.sportId) {
      (await Reservation.findAll({where: {eventId}})).forEach(async reservation => {
        reservation.bools = 0;
        await reservation.save();
      });
    }
    Object.entries(req.body).forEach(([key, value]) => {
        event[key] = value !== '' ? value : null;
    });

    await event.save();
    res.status(200).json({id: event.id, message});
  } catch(e) {
    console.log(e)
  }
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
  try {
    console.log("req.params.id = ", req.params.id)
    const event = await Event.findByPk(Number(req.params.id), {attributes: { exclude: ['sportId', 'userId'] }});
    console.log("event.favoriteId = ", event.favoriteId)
    let favorite = await Favorite.findByPk(event.favoriteId);
    if (favorite.userId !== req.user.id) res.status(401).send("Unauthorized Access");
      await event.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;
