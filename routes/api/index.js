
const router = require('express').Router();
const routes = ['session', 'users', 'events', 'reservations', 'favorites', 'sports'];
routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));
module.exports = router;
