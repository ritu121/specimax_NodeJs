const httpStatus = require('http-status');
const { omit } = require('lodash');
const Duty = require('../models/key.shift.duties.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const duty = await Duty.get(id);
    req.locals = { duty };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Key shift duty info retrieved successfully.', data: req.locals.duty.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.duty.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const duty = new Duty(req.body);
    const savedDuty = await duty.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Key shift duties created successfully.', data: savedDuty.transform()});
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
    const { duty } = req.locals;
    const newDuty = new Duty(req.body);
    const newDutyObject = omit(newDuty.toObject(), '_id');

    await duty.updateOne(newDutyObject, { override: true, upsert: true });
    const savedDuty = await duty.findById(duty._id);

    res.json({code: 200, message: 'Key shift duties updated successfully.', data: savedDuty.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedDuty = omit(req.body);
  const duty = Object.assign(req.locals.duty, updatedDuty);

  duty.save()
    .then((duty) => res.json({code : 200, message : 'Key shift duties updated successfully.', data: duty.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const duties = await Duty.list(req.query);
    const transformedDuties = duties.map((duty) => duty.transform());
    res.json({code : 200, message : 'Key shift duties list retrieved successfully.', data: transformedDuties});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { duty } = req.locals;
  duty.remove()
    .then(() => res.json({code : 200, message : 'Key shift duties deleted successfully.', data: null}))
    .catch((e) => next(e));
};
