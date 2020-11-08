const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  MainCat: {
    type: String,
    required: true,
  },
  SubCat: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Desc: {
    type: String,
  },
  lastChange: {
    type: Date,
  },
  onStock: {
    type: Boolean,
    required: true,
  },
});

const Prod = (module.exports = mongoose.model('Products', productSchema));

//add cats
module.exports.addProducts = (product, callback) => {
  const query = { Name: product.Name };
  const prods = { ...product, lastChange: new Date() };
  Prod.findOneAndUpdate(query, prods, { upsert: true }, callback);
};

//get all products
module.exports.getAllProducts = (getAvailable, callback) => {
  let query = {};
  if (getAvailable) {
    query = { onStock: true };
  }
  Prod.find(query, '-_id -lastChange -__v', callback);
};

//get Price Range
module.exports.getPriceRange = (getAvailable, callback) => {
  let query = {};
  if (getAvailable) {
    query = { onStock: true };
  }
  const max = Prod.find(query).sort('-Price').limit(1).exec();
  const min = Prod.find(query).sort('Price').limit(1).exec();
  let initail = {};

  Promise.all([min, max])
    .then((value) => {
      initail.min = value[0][0].Price;
      initail.max = value[1][0].Price;
    })
    .catch((err) => {
      initail = { min: 0, max: 1000 };
    })
    .finally(() => {
      callback(null, initail);
    });
};
