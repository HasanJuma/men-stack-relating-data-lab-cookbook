const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');

// INDEX
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.render('ingredients/index', { ingredients });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// NEW
router.get('/new', (req, res) => {
  res.render('ingredients/new');
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    await ingredient.save();
    res.redirect('/ingredients');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// SHOW
router.get('/:ingredientId', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId);
    if (!ingredient) return res.status(404).send('Ingredient not found');
    res.render('ingredients/show', { ingredient });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// EDIT
router.get('/:ingredientId/edit', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId);
    res.render('ingredients/edit', { ingredient });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
router.put('/:ingredientId', async (req, res) => {
  try {
    await Ingredient.findByIdAndUpdate(req.params.ingredientId, req.body, { new: true });
    res.redirect(`/ingredients/${req.params.ingredientId}`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE
router.delete('/:ingredientId', async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.ingredientId);
    res.redirect('/ingredients');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
