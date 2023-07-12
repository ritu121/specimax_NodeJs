const httpStatus = require('http-status');
const { omit } = require('lodash');
const Choice = require('../models/choice.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const choice = await Choice.get(id);
    req.locals = { choice };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Choice list retrieved successfully.', data: req.locals.choice.transform()});

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
    const choice = new Choice(req.body);
    const savedChoice = await choice.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Choice created successfully.', data: savedChoice.transform()});
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
    const { choice } = req.locals;
    const newChoice = new Choice(req.body);
    const newChoiceObject = omit(newChoice.toObject(), '_id');

    await choice.updateOne(newChoiceObject, { override: true, upsert: true });
    const savedQuestion = await choice.findById(choice._id);

    res.json({code: 200, message: 'Choice updated successfully.', data: savedQuestion.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedChoice = omit(req.body);
  const choice = Object.assign(req.locals.choice, updatedChoice);

  choice.save()
    .then((choice) => res.json({code : 200, message : 'Choice updated successfully.', data: choice.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const choices = await Choice.list(req.query);
    const transformedChoices = choices.map((status) => status.transform());
    res.json({code : 200, message : 'Choice list retrieved successfully.', data: transformedChoices});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { choice } = req.locals;

  choice.remove()
  .then(() => res.json({code : 200, message : 'Choice delete successfully.', data : {}}))
  .catch((e) => next(e));
};
