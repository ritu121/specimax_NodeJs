const httpStatus = require('http-status');
const { omit } = require('lodash');
const Faq = require('../models/faq.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const faq = await Faq.get(id);
    req.locals = { faq };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Faq list retrieved successfully.', data: req.locals.faq.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.faq.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const faq = new Faq(req.body);
    const savedFaq = await faq.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Faq created successfully.', data: savedFaq.transform()});
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
    const { faq } = req.locals;
    const newFaq = new Faq(req.body);
    const newFaqObject = omit(newFaq.toObject(), '_id');

    await faq.updateOne(newFaqObject, { override: true, upsert: true });
    const savedFaq = await faq.findById(faq._id);

    res.json({code: 200, message: 'Faq updated successfully.', data: savedFaq.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedFaq = omit(req.body);
  const faq = Object.assign(req.locals.faq, updatedFaq);

  faq.save()
    .then((faq) => res.json({code : 200, message : 'Faq updated successfully.', data: faq.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const faqs = await Faq.list(req.query);
    const transformedFaqs = faqs.map((faq) => faq.transform());
    res.json({code : 200, message : 'Faq list retrieved successfully.', data: transformedFaqs});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { faq } = req.locals;
  faq.remove()
    .then(() => res.json({code : 200, message : 'Faq deleted successfully.', data: null}))
    .catch((e) => next(e));
};
