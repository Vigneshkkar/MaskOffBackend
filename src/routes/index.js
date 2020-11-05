const express = require('express').Router();
const UserRoute = require('./user-routes');
const CatsRoute = require('./cats-routes');
const ProductRoute = require('./product-routes');

express.use('/user', UserRoute);
express.use('/Categories', CatsRoute);
express.use('/Products', ProductRoute);

module.exports = express;
