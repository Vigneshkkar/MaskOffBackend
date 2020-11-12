const ProdRouter = require('express').Router();
const { createMsg } = require('../util/helper');

const Products = require('../models/products');

ProdRouter.post('/addUpdateProducts416', (req, res) => {
  Products.addProducts(req.body, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Product is not unique'));
      else res.status(500).json(createMsg('Error while adding Product.'));
    } else {
      res.json(createMsg('Product Added Successful'));
    }
  });
});
ProdRouter.post('/addMaskSubCategories', (req, res) => {
  Products.addMaskSubCat(req.body.mainCat, req.body.subCat, (err, status) => {
    if (err) {
      if (err.code === 11000)
        res.status(403).json(createMsg('Categories is not unique'));
      else res.status(500).json(createMsg('Error while adding Categories.'));
    } else {
      res.json(createMsg('Updated Successful'));
    }
  });
});

ProdRouter.get('/', (req, res) => {
  Products.getAllProducts(true, (err, data) => {
    if (err) res.status(500).json('Cannot Fetch Data');
    else res.json(data);
  });
});

ProdRouter.get('/priceRange', (req, res) => {
  Products.getPriceRange(true, (err, data) => {
    if (err) res.status(500).json('Cannot Fetch Data');
    else res.json(data);
  });
});

ProdRouter.post('/Vicky/Delete/ProductSecret', (req, res) => {
  Products.deleteProduct(req.body.name, (err, data) => {
    if (err) res.status(500).json('Cannot Delete Data');
    else res.json(data);
  });
});

module.exports = ProdRouter;
