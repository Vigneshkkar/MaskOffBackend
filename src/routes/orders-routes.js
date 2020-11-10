const OrderRuter = require('express').Router();
const { createMsg } = require('../util/helper');

const Orders = require('../models/orders');

OrderRuter.post('/createOrder', (req, res) => {
  Orders.createOrder(req.body, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Order is not unique'));
      else res.status(500).json(createMsg('Error while adding Order.'));
    } else {
      res.json(createMsg('Order Added Successful'));
    }
  });
});

module.exports = OrderRuter;
