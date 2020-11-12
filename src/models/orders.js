const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  addressLine: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  lastChange: {
    type: Date,
  },
});

const Orders = (module.exports = mongoose.model('Orders', orderSchema));

//add cats
module.exports.createOrder = (details, callback) => {
  const data = { ...details, lastChange: new Date() };
  Orders.create(data, callback);
};

module.exports.getAllOrder = (mainCat, subCat, callback) => {
  const query = { mainCat: mainCat };

  Cats.findOneAndUpdate(
    query,
    { $addToSet: { subCat: { $each: subCat } } },
    (err, success) => {
      if ((err, !success)) callback('cannot insert');
      else callback(null, 'Inserted Successfully');
    }
  );
};

module.exports.getAllOrder = (callback) => {
  Orders.find({}, '-_id -lastChange -__v', callback);
};
