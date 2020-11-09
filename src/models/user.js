const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

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

let generateHash = async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
};
userSchema.pre('save', generateHash);

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
const Users = (module.exports = mongoose.model('Users', userSchema));

//add user
module.exports.addUser = (user, callback) => {
  Users.create(user, callback);
};

//validate user
const UpdateError = (userMail) => {
  Users.findOneAndUpdate(
    {
      userEmail: userMail,
    },
    { $inc: { failedLogin: 1 }, lastLogin: new Date() }
  ).exec();
};
module.exports.validateUser = (userMail, password, callback) => {
  const query = {
    userEmail: userMail,
  };
  // Users.find();
  Users.findOne(query, (err, success) => {
    if (!success) {
      UpdateError(userMail);
      callback({ msg: 'Validation failed' });
    } else {
      success.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          UpdateError(userMail);
          callback({ msg: 'Validation failed' });
        } else if (isMatch) {
          Users.findOneAndUpdate(
            {
              userEmail: userMail,
            },
            {
              failedLogin: 0,
              lastLogin: new Date(),
              failedLogin: 0,
              resetCode: null,
            }
          ).exec();
          callback(null, 'User Authorized');
        }
      });
    }
  });
};

//reset password
module.exports.resetPassword = (userMail, callback) => {
  const query = {
    userEmail: userMail,
  };
  const randomPass = Math.floor(100000 + Math.random() * 900000);
  Users.findOneAndUpdate(query, { resetCode: randomPass }, (err, success) => {
    if (!success) callback('email not found');
    else callback(null, randomPass);
  });
};

module.exports.changePassword = (userMail, newPassword, passcode, callback) => {
  const query = {
    userEmail: userMail,
    resetCode: passcode,
  };
  const data = {
    userEmail: userMail,
    password: newPassword,
  };
  Users.deleteOne(query, (err, succ) => {
    if (!err) {
      Users.create(data, (err, success) => {
        if (!success) callback('Cannot change the Password');
        else callback(null, 'Password reset successful');
      });
    } else {
      callback(null, 'Wrong Passcode');
    }
  });
};
