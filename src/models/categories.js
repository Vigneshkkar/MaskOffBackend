const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  mainCat: {
    type: String,
    required: true,
    unique: true,
  },
  subCat: {
    type: Array,
    unique: true,
  },

  image: {
    type: String,
  },
  lastChange: {
    type: Date,
  },
});

const Cats = (module.exports = mongoose.model('Categories', categorySchema));

//add cats
module.exports.addMaskCats = (cat, callback) => {
  const cats = { ...cat, lastChange: new Date() };
  Cats.create(cats, callback);
};

module.exports.addMaskSubCat = (mainCat, subCat, callback) => {
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

module.exports.getAllCats = (callback) => {
  Cats.find({}, '-_id -lastChange -__v', callback);
};
