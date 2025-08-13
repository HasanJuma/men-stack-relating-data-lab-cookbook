const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// INDEX – عرض جميع وصفات المستخدم الحالي
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render('recipes/index.ejs', { recipes });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// NEW – عرض نموذج إنشاء وصفة جديدة
router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

// CREATE – حفظ وصفة جديدة
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});


// SHOW – عرض تفاصيل وصفة معينة
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      owner: req.session.user._id, // للتأكد أن الوصفة تخص المستخدم الحالي
    });

    if (!recipe) {
      return res.redirect('/recipes'); // إذا مش موجودة أو لا تخصه
    }

    res.render('recipes/show.ejs', { recipe });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// DELETE – حذف وصفة
router.delete('/:recipeId', async (req, res) => {
  try {
    // نبحث عن الوصفة التي تخص المستخدم الحالي فقط
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      owner: req.session.user._id,
    });

    if (!recipe) {
      return res.redirect('/recipes'); // إذا لم يتم العثور عليها
    }

    // حذف الوصفة
    await Recipe.deleteOne({ _id: req.params.recipeId });
    res.redirect('/recipes');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// EDIT – عرض فورم تعديل الوصفة
router.get('/:recipeId/edit', async (req, res) => {
  try {
    // البحث عن الوصفة التي تخص المستخدم الحالي فقط
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      owner: req.session.user._id
    });

    if (!recipe) {
      return res.redirect('/recipes');
    }

    res.render('recipes/edit.ejs', { recipe });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});


// UPDATE – تعديل الوصفة باستخدام .save()
router.put('/:recipeId', async (req, res) => {
  try {
    // البحث عن الوصفة التي تخص المستخدم الحالي
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      owner: req.session.user._id
    });

    if (!recipe) {
      return res.redirect('/recipes'); // إذا لم يتم العثور عليها أو لا تخص المستخدم
    }

    // تحديث البيانات من الفورم
    recipe.name = req.body.name;
    recipe.instructions = req.body.instructions;

    // حفظ التغييرات
    await recipe.save();

    // إعادة التوجيه لصفحة عرض الوصفة بعد التحديث
    res.redirect(`/recipes/${recipe._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});





module.exports = router;
