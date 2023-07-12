const httpStatus = require('http-status');
const { omit } = require('lodash');
const Tracker = require('../models/tracker.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const tracker = await Tracker.get(id);
    req.locals = { tracker };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Tracker list retrieved successfully.', data: req.locals.tracker.transform()});

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
    const tracker = new Tracker(req.body);
    const savedTracker = await tracker.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Tracker created successfully.', data: savedTracker.transform()});
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
    const { tracker } = req.locals;
    const newTracker = new Tracker(req.body);
    const newTrackerObject = omit(newTracker.toObject(), '_id');

    await tracker.updateOne(newTrackerObject, { override: true, upsert: true });
    const savedTracker = await Tracker.findById(tracker._id);

    res.json({code: 200, message: 'Tracker updated successfully.', data: savedTracker.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedTracker = omit(req.body);
  const tracker = Object.assign(req.locals.tracker, updatedTracker);

  tracker.save()
    .then((savedTracker) => res.json({code : 200, message : 'Tracker updated successfully.', data: savedTracker.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const trackers = await Tracker.list(req.query);
    const transformedTrackers = trackers.map((tracker) => tracker.transform());
    res.json({code : 200, message : 'Tracker list retrieved successfully.', data: transformedTrackers});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { tacker } = req.locals;

  tacker.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
