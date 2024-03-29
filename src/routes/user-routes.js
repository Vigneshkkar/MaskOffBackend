const UserRouter = require('express').Router();
const { createMsg } = require('../util/helper');
const { transporter } = require('../util/nodeMailer');

const Users = require('../models/user');
const e = require('express');
const path = require('path');

UserRouter.post('/register', (req, res) => {
  req.body.data = Buffer.from(req.body.data, 'base64').toString();
  Users.addUser(req.body, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('email not unique'));
      else res.status(500).json(createMsg('Error while registering the user.'));
    } else {
      res.json(createMsg('Registration Successful'));
    }
  });
});

UserRouter.post('/validate', (req, res) => {
  Users.validateUser(
    req.body.userEmail,
    Buffer.from(req.body.data, 'base64').toString(),
    (err, status) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.json(createMsg('Login Successful'));
      }
    }
  );
});

UserRouter.post('/resetPassword', (req, res) => {
  Users.resetPassword(req.body.userEmail, (err, suc) => {
    let mail = {
      // from: process.env.THE_EMAIL,
      message: {
        to: req.body.userEmail,
      },
      locals: {
        OTP: suc,
      },

      template: path.join(__dirname, '../emails', 'OTP'),
    };

    if (err) res.status(403).json(createMsg('email not found'));
    else {
      transporter
        .send(mail)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  });
});

UserRouter.post('/changePassword', (req, res) => {
  Users.changePassword(
    req.body.userEmail,
    Buffer.from(req.body.newdata, 'base64').toString(),
    req.body.passcode,
    (err, suc) => {
      if (err) res.status(403).json(createMsg('Cannot Change password.'));
      else res.json(createMsg('Password changed successfully'));
    }
  );
});

UserRouter.get('/', (req, res) => res.json('working good'));

module.exports = UserRouter;
