const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  mainCat: {
    type: String,
    required: true,
  },
  subCat: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  },
  lastChange: {
    type: Date,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

const Prod = (module.exports = mongoose.model('Products', productSchema));

//add cats
module.exports.addProducts = (product, callback) => {
  const query = { name: product.name };
  const prods = { ...product, lastChange: new Date() };
  Prod.findOneAndUpdate(query, prods, { upsert: true }, callback);
};

//get all products
module.exports.getAllProducts = (getAvailable, callback) => {
  let query = {};
  if (getAvailable) {
    query = { available: true };
  }
  Prod.find(query, '-_id -lastChange -__v', callback);
};

//get Price Range
module.exports.getPriceRange = (getAvailable, callback) => {
  let query = {};
  if (getAvailable) {
    query = { available: true };
  }
  const max = Prod.find(query).sort('-price').limit(1).exec();
  const min = Prod.find(query).sort('price').limit(1).exec();
  let initail = {};

  Promise.all([min, max])
    .then((value) => {
      initail.min = value[0][0].price;
      initail.max = value[1][0].price;
    })
    .catch((err) => {
      initail = { min: 0, max: 1000 };
    })
    .finally(() => {
      callback(null, initail);
    });
};
