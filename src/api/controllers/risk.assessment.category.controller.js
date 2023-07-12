const httpStatus = require('http-status');
const { omit } = require('lodash');
const Category = require('../models/risk.assessment.category.model');
const Question = require('../models/risk.assessment.question.model')

exports.load = async (req, res, next, id) => {
  try {
    const category = await Category.get(id);
    req.locals = { category };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json({code: 200, message: 'Risk assessment category retrieved successfully.', data: req.locals.category.transform()});

exports.loggedIn = (req, res) => res.json(req.user.transform());

exports.create = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Risk assessment category created successfully.', data: savedCategory.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const category = await Category.updateOne({_id : req.params.categoryId}, req.body)
    .then(async(category) => {
        let newCategory = await Category.findOne({_id : req.params.categoryId})
        res.json({code : 200, message : 'Risk assessment category updated successfully.', data: newCategory.transform()})
    })
    .catch((e) => next(e));
};


exports.list = async (req, res, next) => {
  try {
    const categories = await Category.list(req.query);
    const transformedCategories = categories.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment category list retrieved successfully.', data: transformedCategories});
  } catch (error) {
    next(error);
  }
};


exports.remove = (req, res, next) => {
  Category.deleteOne({_id : req.params.categoryId})
  .then(async () => {
    let question = await Question.deleteMany({riskAssessmentCategoryId : req.params.categoryId})
    res.json({code : 200, message : 'Risk assessment category delete successfully.', data : {}})
  })
    .catch((e) => next(e));
};
