const httpStatus = require('http-status');
const { omit } = require('lodash');
const Checkpoints = require('../models/site.checkpoints.model');
const qrcode = require('qrcode')

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const check = await Checkpoints.get(id);
    req.locals = { check };
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
  Checkpoints.findOne({_id : req.params.checkId})
    .then((site) => {
      res.json({code: 201, message: 'Checkpoints retrieved successfully.', data: site});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
};


/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const site = new Checkpoints(req.body);
    const savedSite = await site.save();
    res.json({code: 201, message: 'Checkpoints created successfully.', data: savedSite});
    
  }
  catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { site } = req.locals;
    const newSite = new Checkpoints(req.body);
    const newSiteObject = omit(newSite.toObject(), '_id');

    await site.updateOne(newSiteObject, { override: true, upsert: true });
    const savedSite = await site.findById(site._id);

    res.json({code: 200, message: 'Checkpoints updated successfully.', data: savedSite.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedSite = omit(req.body);
  const site = Object.assign(req.locals.check, updatedSite);

  site.save()
    .then((site) => res.json({code : 200, message : 'Checkpoints updated successfully.', data: site.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const check = await Checkpoints.list(req.query);
     const points = check.map((typ) => {
      typ.transform()
    });
     res.json({code : 200, message : 'Checkpoints retrieved successfully.', data: check});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { check } = req.locals;

  check.remove()
  .then(() => res.json({code : 200, message : 'Checkpoint delete successfully.', data : {}}))
    .catch((e) => next(e));
};
