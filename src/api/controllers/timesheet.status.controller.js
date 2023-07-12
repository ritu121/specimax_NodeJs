const httpStatus = require('http-status');
const { omit } = require('lodash');
const TimesheetStatus = require('../models/timesheet.status.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const status = await TimesheetStatus.get(id);
    req.locals = { status };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
    res.json({code: 200, message: 'Status list retrieved successfully.', data: req.locals.status.transform()})
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const status = new TimesheetStatus(req.body);
    const savedStatus = await status.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Status created successfully.', data: savedStatus.transform()});
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
    const { status } = req.locals;
    const newStatus = new TimesheetStatus(req.body);
    const newStatusObject = omit(newStatus.toObject(), '_id');

    await status.updateOne(newStatusObject, { override: true, upsert: true });
    const savedStatus = await TimesheetStatus.findById(status._id);

    res.json({code: 200, message: 'Status updated successfully.', data: savedStatus.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedStatus = omit(req.body);
  const status = Object.assign(req.locals.status, updatedStatus);

  status.save()
    .then((savedStatus) => res.json({code : 200, message : 'Status updated successfully.', data: savedStatus.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const statuses = await TimesheetStatus.list(req.query);
    const transformedStatuses = statuses.map((status) => status.transform());
    res.json({code : 200, message : 'Status list retrieved successfully.', data: transformedStatuses});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { status } = req.locals;

  status.remove()
  .then(() => res.json({code : 200, message : 'Timesheet status delete successfully.', data : {}}))
    .catch((e) => next(e));
};
