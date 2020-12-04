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
  },
  paymentMethod: {
    type: String,
  },
  paymentDone: {
    type: Boolean,
  },
  lastChange: {
    type: Date,
  },
  delivered: {
    type: Boolean,
  },
});

const Orders = (module.exports = mongoose.model('Orders', orderSchema));

//add orders
module.exports.createOrder = (details, callback) => {
  const data = { ...details, lastChange: new Date(), delivered: false };
  Orders.create(data, callback);
};

module.exports.getAllOrder = (getDelivered, callback) => {
  let query = {};
  if (!getDelivered) {
    query = { delivered: false };
  }
  Orders.find(query, '-__v', { sort: { lastChange: -1 } }, callback);
};

module.exports.updateDelivery = (id, status, paymentMet, callback) => {
  const query = { _id: id };
  let update = { delivered: status };
  if (paymentMet) {
    update = { paymentDone: status };
  }
  Orders.findOneAndUpdate(query, update, { returnOriginal: false }, callback);
};

module.exports.totalRevenue = (callback) => {
  // const data = { ...details, lastChange: new Date(), delivered: false };
  Orders.aggregate(
    [
      {
        $group: {
          _id: '$id',
          total: {
            $sum: '$totalValue',
          },
        },
      },
    ],
    callback
  );
};

module.exports.actionItems = (callback) => {
  const quer = {
    paymentMethod: 'interac',
    paymentDone: { $ne: true },
  };

  Orders.count(quer, callback);
};
