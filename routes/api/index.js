const router = require('express').Router();
const routes = ['session', 'users', 'games', 'reservations', 'skills', 'gameTypes'];
routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));
module.exports = router;
