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

// used by EditEvent component
router.post('', [authenticated], asyncHandler(async (req, res, next) => {
  // try {
  let [event, message, status] = [{}, '', 201];
  req.body.userId = req.user.id;
  // req.body.dateTime = faker.date.future();
  let checked = await checkLocation(req.body.Location);
  if (checked.success) {
    req.body.Location = checked.Location;
    event = (await Event.create(req.body)).dataValues;
    event = {...event, count: 0, reservationId: 0};
  } else {
    message = `There is something wrong with your event's location (${req.body.Location}). Try a different one.`
    status = 400;
  }
  res.status(201).json({id: event.id, message, Location: checked.Location});
// } catch(e) {console.log(e)}
}));

// used by Home component (AKA ViewEvents)
router.get('', [authenticated], asyncHandler(async(req, res, next) => {
  // try {
  const user = req.user;
  const mySportIds = (await Favorite.findAll({where: {userId: user.id}})).map(fav => fav.sportId);
  const possibleFavorites = (await Favorite.findAll()).filter(fav => mySportIds.includes(fav.sportId));
  const events = (await Event.findAll()).filter(event => {
    return possibleFavorites.map(fav => fav.id).includes(event.favoriteId);
  }).map(event => event.dataValues);
  const allVenues = [];
  for (let i = 0; i < events.length; i++) {
      let event = events[i];
      allVenues.push(event.Location);
      let eventFavorite = await Favorite.findByPk(event.favoriteId);
      let eventSport = await Sport.findByPk(eventFavorite.sportId);
      event.Sport = eventSport.Name;
      event.Skills = JSON.parse(eventSport.Skills);
      event["Event organizer"] = (await User.findByPk(eventFavorite.userId)).dataValues.Nickname;
      let reservations = await Reservation.findAll({where: {eventId: event.id}});
      event["Player reservations"] = reservations.length;
      let Nicknames = [];
      for (let i = 0; i < reservations.length; i++) {
        Nicknames.push((await User.findByPk(reservations[i].userId)).Nickname);
      };
      event.Nicknames = Nicknames.sort().join(", ");
      // Set reservationId to zero if no reservation for this event has been made by this user.
      event.reservationId = reservations.reduce((reservationId, reservation) => {
          return (reservation.userId === user.id ? reservation.id : reservationId);
      }, 0);
      ['favoriteId', 'createdAt', 'updatedAt'].forEach(key => delete event[key]);
  }
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
  res.json({events, sportsLength: mySportIds.length});
  // }catch(e) {console.log(e)}
}));

// Used by EditGame and ViewGame components
router.get('/:id', [authenticated], asyncHandler(async(req, res, next) => {
  // try {
  const user = req.user;
  const eventId = Number(req.params.id);
  const event = (await Event.findByPk(eventId)).dataValues;
  let favorite = (await Favorite.findByPk(event.favoriteId)).dataValues;
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
    player.Skill = (await Favorite.findOne({where: {sportId, userId: player.id}})).Skill;
    reservation = reservation.dataValues;
    reservation.boolVals = JSON.parse(reservation.boolVals);
    ['eventId', 'id', 'userId', 'createdAt'].forEach(prop => delete reservation[prop]);
    ['First name', 'Last name', 'Address', 'tokenId', 'hashedPassword', 'updatedAt'].forEach(prop => delete player[prop]);
    player = {...player, ...reservation};
    players.push(player);
  };
  res.json({event: {...event, owner: user, players, sport, Skills}});
  // } catch(e) {console.log(e)}
}))

// Used by EditGame component.
// Do we want to allow an event owner to transfer event-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
  // try {
  const eventId = Number(req.params.id);
  let event = await Event.findByPk(eventId);
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
  // }catch(e) {console.log(e)}
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
  // try {
  let eventId = Number(req.params.id);
  const event = await Event.findByPk(eventId);
  let favorite = await Favorite.findByPk(event.favoriteId);
  if (favorite.userId !== req.user.id) res.status(401).send("Unauthorized Access");
  let reservations = await Reservation.findAll({where: {eventId}});
  reservations = reservations.filter(reservation => reservation.userId !== req.user.id);
  if (!reservations.length || req.body.warning) {
    await event.destroy();
    res.json({});
  } else {
    res.json({warning: `Note that there ${reservations.length === 1 ? "is" : "are"} ${reservations.length} other ${reservations.length === 1 ? "person" : "people"} who ${reservations.length === 1 ? "has" : "have"} signed up for this event.  Are you sure that you want to cancel it?  If so, re-click "Delete".  If not, click "Cancel".`})
  }

  // } catch(e) {res.status(400).send(e)}
}));

module.exports = router;
