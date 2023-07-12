const httpStatus = require('http-status');
const { omit } = require('lodash');
const Setting = require('../../models/user.setting.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const setting = await Setting.get(id);
    req.locals = { setting };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => {
  Setting.findOne({ user: req.user._id })
    .then((settings) => {
      res.send(200, { code: 200, message: 'Setting list retrieved successfully.', data: settings });
    }).catch((errors) => {
      res.send(500, { code: 500, message: 'Setting list retrieved successfully.', errors });
    });
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.setting.transform());

exports.update = (req, res, next) => {
  const updateSetting = omit(req.body);
  const query = { user: req.user._id };

  Setting.findOneAndUpdate(query, updateSetting, { upsert: true }, (err, doc) => {
    if (err) return res.send(500, { code: 500, message: 'Internal server error', errors: err });
    if (doc) {
      Setting.findOne({ _id: doc._id }, (err, data) => {
        if (err) return res.send(500, { code: 500, message: 'Internal server error', errors: err });
        res.json(200, { code: 200, message: 'Setting updated successfully.', data });
      });
    } else {
      return res.send(500, { code: 500, message: 'Internal server error' });
    }
  });
};
