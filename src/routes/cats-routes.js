const CatRouter = require('express').Router();
const { createMsg } = require('../util/helper');

const Categories = require('../models/categories');

CatRouter.post('/addMaskCategories', (req, res) => {
  Categories.addMaskCats(req.body, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Categories is not unique'));
      else res.status(500).json(createMsg('Error while adding Categories.'));
    } else {
      res.json(createMsg('Added Successful'));
    }
  });
});
CatRouter.post('/addMaskSubCategories', (req, res) => {
  Categories.addMaskSubCat(req.body.mainCat, req.body.subCat, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Categories is not unique'));
      else res.status(500).json(createMsg('Error while adding Categories.'));
    } else {
      res.json(createMsg('Updated Successful'));
    }
  });
});

CatRouter.get('/', (req, res) => {
  Categories.getAllCats((err, data) => {
    if (err) res.status(500).json('Cannot Fetch Data');
    else res.json(data);
  });
});

CatRouter.post('/Vicky/Delete', (req, res) => {
  Categories.deleteCat(req.body.mainCat, (err, data) => {
    if (err) res.status(500).json('Cannot Delete Data');
    else res.json(data);
  });
});

module.exports = CatRouter;
