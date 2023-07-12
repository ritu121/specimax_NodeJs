const httpStatus = require('http-status');
const { omit } = require('lodash');
const Question = require('../models/question.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const question = await Question.get(id);
    req.locals = { question };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Question list retrieved successfully.', data: req.locals.question.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.question.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Question created successfully.', data: savedQuestion.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { question } = req.locals;
    const newQuestion = new Question(req.body);
    const newQuestionObject = omit(newQuestion.toObject(), '_id');

    await question.updateOne(newQuestionObject, { override: true, upsert: true });
    const savedQuestion = await question.findById(question._id);

    res.json({code: 200, message: 'Question updated successfully.', data: savedQuestion.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedQuestion = omit(req.body);
  const question = Object.assign(req.locals.question, updatedQuestion);

  question.save()
    .then((question) => res.json({code : 200, message : 'Question updated successfully.', data: question.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const questions = await Question.list(req.query);
    const transformedQuestions = questions.map((status) => status.transform());
    res.json({code : 200, message : 'Question list retrieved successfully.', data: transformedQuestions});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { question } = req.locals;

  question.remove()
  .then(() => res.json({code : 200, message : 'Question delete successfully.', data : {}}))
    .catch((e) => next(e));
};
