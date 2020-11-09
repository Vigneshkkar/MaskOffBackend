const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  failedLogin: {
    type: Number,
    default: 0,
  },
  lastFailedTime: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
  resetCode: {
    type: Number,
  },
});

const Users = (module.exports = mongoose.model('Users', userSchema));

//add user
module.exports.addUser = (user, callback) => {
  Users.create(user, callback);
};

//validate user
module.exports.validateUser = (userMail, password, callback) => {
  const query = {
    userEmail: userMail,
    password: password,
  };
  // Users.find();
  Users.findOneAndUpdate(
    query,
    { lastLogin: new Date(), failedLogin: 0, resetCode: null },
    (err, success) => {
      if (!success) {
        Users.findOneAndUpdate(
          {
            userEmail: userMail,
          },
          { $inc: { failedLogin: 1 }, lastLogin: new Date() }
        ).exec();
        callback({ msg: 'Validation failed' });
      } else {
        callback(null, success);
      }
    }
  );
};

//reset password
module.exports.resetPassword = (userMail, callback) => {
  const query = {
    userEmail: userMail,
  };
  const randomPass = Math.floor(100000 + Math.random() * 900000);
  Users.findOneAndUpdate(query, { resetCode: randomPass }, (err, success) => {
    if (!success) callback('email not found');
    else callback(null, success.resetCode);
  });
};

module.exports.changePassword = (userMail, newPassword, passcode, callback) => {
  const query = {
    userEmail: userMail,
    resetCode: passcode,
  };
  Users.findOneAndUpdate(
    query,
    {
      lastLogin: new Date(),
      failedLogin: 0,
      resetCode: null,
      password: newPassword,
    },
    (err, success) => {
      if (!success) callback('Cannot change the Password');
      else callback(null, 'Password reset successful');
    }
  );
};
