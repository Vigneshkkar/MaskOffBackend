const OrderRuter = require('express').Router();
const { transporter } = require('../util/nodeMailer');
const path = require('path');

const { createMsg } = require('../util/helper');

const Orders = require('../models/orders');

OrderRuter.post('/createOrder', (req, res) => {
  Orders.createOrder(req.body, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Order is not unique'));
      else res.status(500).json(createMsg('Error while adding Order.'));
    } else {
      let mail = {
        // from: process.env.THE_EMAIL,
        message: {
          to: req.body.email,
        },
        locals: {
          msg:
            req.body.paymentMethod === 'interac'
              ? 'placed Successfully. Please wait for confirmation'
              : 'Confirmed',
        },

        template: path.join(__dirname, '../emails', 'OrderConfrim'),
      };
      transporter
        .send(mail)
        .then((data) => {
          res.json(createMsg('Order Added Successful'));
        })
        .catch((err) => {
          res.json(createMsg('Order Added Successful'));
        });
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
  let flag = req.body.delivered;
  if (req.body.paymentMet === true) {
    flag = req.body.paymentDone;
  }
  Orders.updateDelivery(
    req.body._id,
    flag,
    req.body.paymentMet,
    (err, data) => {
      if (err) {
        res.status(500).json(createMsg('Cannot Update Orders.'));
      } else {
        let mail = {
          // from: process.env.THE_EMAIL,
          message: {
            to: data.email,
          },
          locals: {
            msg: data.delivered ? 'Delivered Successfully' : 'Confirmed',
          },

          template: path.join(__dirname, '../emails', 'OrderConfrim'),
        };
        transporter
          .send(mail)
          .then((data) => {
            res.json(createMsg('Updated Successfully'));
          })
          .catch((err) => {
            res.json(createMsg('Updated Successfully'));
          });

        // res.json('Updated Successfully');
      }
    }
  );
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

OrderRuter.get('/getAllOrders/Vignesh/getActions', (req, res) => {
  Orders.actionItems((err, data) => {
    if (err) {
      res.status(500).json(createMsg('Cannot Fetch Orders.'));
    } else {
      res.json(data);
    }
  });
});

module.exports = OrderRuter;
