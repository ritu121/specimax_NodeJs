const httpStatus = require('http-status');
const { omit } = require('lodash');
const Page = require('../models/page.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const page = await Page.get(id);
    req.locals = { page };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Page info retrieved successfully.', data: req.locals.page.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.page.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const page = new Page(req.body);
    const savedPage = await page.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Page created successfully.', data: savedPage.transform()});
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
    const { page } = req.locals;
    const newPage = new Page(req.body);
    const newPageObject = omit(newPage.toObject(), '_id');

    await Page.updateOne(newPageObject, { override: true, upsert: true });
    const savedPage = await page.findById(faq._id);

    res.json({code: 200, message: 'Page updated successfully.', data: savedPage.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedPage = omit(req.body);
  const page = Object.assign(req.locals.page, updatedPage);

  page.save()
    .then((page) => res.json({code : 200, message : 'Page updated successfully.', data: page.transform()}))
    .catch((e) => next(e));
};

exports.findPage = (req, res, next) => {
  Page.findOne({identifier : req.params.pageId}, function(err, page){
    if(err){
      return res.json(500,{code : 500, message : 'Internal server error', errors : err});
    }
    if(page){
      return res.json(200,{code : 200, message : 'Page found', data : page});
    }
    return res.json(404,{code : 404, message : 'Page not found'});
  })
  
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const pages = await Page.list(req.query);
    const transformedPages = pages.map((page) => page.transform());
    res.json({code : 200, message : 'Page list retrieved successfully.', data: transformedPages});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { page } = req.locals;
  page.remove()
    .then(() => res.json({code : 200, message : 'Page deleted successfully.', data: null}))
    .catch((e) => next(e));
};
