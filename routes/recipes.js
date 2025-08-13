const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// INDEX – عرض كل الوصفات
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('owner').populate('ingredients');
    res.render('recipes/index', { recipes });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// NEW – عرض نموذج إنشاء وصفة جديدة
router.get('/new', (req, res) => {
  res.render('recipes/new');
});

// CREATE – إضافة وصفة جديدة لقاعدة البيانات
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.redirect('/recipes');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// SHOW – عرض وصفة معينة
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('owner')
      .populate('ingredients');
    if (!recipe) return res.status(404).send('Recipe not found');
    res.render('recipes/show', { recipe });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// EDIT – عرض نموذج تعديل وصفة
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('recipes/edit', { recipe });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE – تعديل وصفة معينة
router.put('/:recipeId', async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, req.body, { new: true });
    res.redirect(`/recipes/${req.params.recipeId}`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE – حذف وصفة
router.delete('/:recipeId', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect('/recipes');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
