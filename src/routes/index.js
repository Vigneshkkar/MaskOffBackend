const express = require('express').Router();
const UserRoute = require('./user-routes');
const CatsRoute = require('./cats-routes');
const ProductRoute = require('./product-routes');
const StripRoute = require('./strip-routes');
const OrderRoute = require('./orders-routes');

express.use('/user', UserRoute);
express.use('/Categories', CatsRoute);
express.use('/Products', ProductRoute);
express.use('/Checkout', StripRoute);
express.use('/Orders', OrderRoute);

module.exports = express;
