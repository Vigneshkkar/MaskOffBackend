const UserRouter = require('express').Router();
const { createMsg } = require('../util/helper');

const Users = require('../models/user');
const e = require('express');

UserRouter.post('/register', (req, res) => {
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
  Users.validateUser(req.body.userEmail, req.body.password, (err, status) => {
    if (err) {
      res.status(403).json(err);
    } else {
      res.json(createMsg('Login Successful'));
    }
  });
});

UserRouter.post('/resetPassword', (req, res) => {
  Users.resetPassword(req.body.userEmail, (err, suc) => {
    if (err) res.status(403).json(createMsg('email not found'));
    else res.json(createMsg('mail sent'));
  });
});

UserRouter.post('/changePassword', (req, res) => {
  Users.changePassword(
    req.body.userEmail,
    req.body.newPassword,
    req.body.passcode,
    (err, suc) => {
      if (err) res.status(403).json(createMsg('Cannot Change password.'));
      else res.json(createMsg('Password changed successfully'));
    }
  );
});

UserRouter.get('/', (req, res) => res.json('working good'));

module.exports = UserRouter;