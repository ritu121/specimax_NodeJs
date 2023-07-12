const httpStatus = require('http-status');
const { omit } = require('lodash');
const Alert = require('../models/alert.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const role = await Alert.get(id);
    req.locals = { role };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Alerts list retrieved successfully.', data: req.locals.role.transform()});


/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.user = req.user._id
    const tip = new Alert(req.body);
    const savedTip = await tip.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Alert created successfully.', data: savedTip.transform()});
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
    const { role } = req.locals;
    const newRole = new Alert(req.body);
    const newRoleObject = omit(newRole.toObject(), '_id');

    await role.updateOne(newRoleObject, { override: true, upsert: true });
    const savedRole = await role.findById(role._id);

    res.json({code: 200, message: 'Alert updated successfully.', data: savedRole.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedRole = omit(req.body);
  const role = Object.assign(req.locals.role, updatedRole);

  role.save()
    .then((role) => res.json({code : 200, message : 'Alert updated successfully.', data: role.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const roles = await Alert.list(req.query);
    const transformedRoles = roles.map((status) => status.transform());
    res.json({code : 200, message : 'Alerts list retrieved successfully.', data: transformedRoles});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { role } = req.locals;

  role.remove()
    .then(() => res.json({code : 200, message : 'Alert deleted successfully.', data: []})
    )
    .catch((e) => next(e));
};
