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

OrderRuter.get('/getAllOrders/Vignesh/Secret', (req, res) => {
  let flag = false;
  if (req.query.getAll == 'true') {
    flag = true;
  }
  Orders.getAllOrder(flag, (err, data) => {
    if (err) {
      res.status(500).json(createMsg('Cannot Fetch Orders.'));
    } else {
      res.json(data);
    }
  });
});

OrderRuter.post('/Vignesh/UpdateOrd', (req, res) => {
  Orders.updateDelivery(req.body._id, req.body.delivered, (err, data) => {
    if (err) {
      res.status(500).json(createMsg('Cannot Update Orders.'));
    } else {
      res.json('Updated Successfully');
    }
  });
});

OrderRuter.get('/getAllOrders/Vignesh/getRevenue', (req, res) => {
  Orders.totalRevenue((err, data) => {
    if (err) {
      res.status(500).json(createMsg('Cannot Fetch Orders.'));
    } else {
      res.json(data);
    }
  });
});

module.exports = OrderRuter;
