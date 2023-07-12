const httpStatus = require('http-status');
const { omit } = require('lodash');
const Help = require('../models/help.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const help = await Help.get(id);
    req.locals = { help };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Help info retrieved successfully.', data: req.locals.help.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.help.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const help = new Help(req.body);
    const savedHelp = await help.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Help created successfully.', data: savedHelp.transform()});
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
    const { help } = req.locals;
    const newHelp = new Help(req.body);
    const newHelpObject = omit(newHelp.toObject(), '_id');

    await help.updateOne(newHelpObject, { override: true, upsert: true });
    const savedHelp = await help.findById(help._id);

    res.json({code: 200, message: 'Help updated successfully.', data: savedHelp.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const query = {_id : req.params.helpId};
  const updatedData = req.body;

  Help.updateOne(query, updatedData, function(err, help){
    if(err){
        res.json(500, {code : 500, message : 'Internal server error.', errors : err})
    }
    if(help){
        Help.findOne(query, function(error, data){
            res.json(200, {code : 200, message : 'Help updated successfully.', data: data})
        })
        
    }
    else{
        res.json(404, {code : 404, message : 'Help data not found.', data: {}})
    }
    
  })
//   const updatedHelp = omit(req.body);
//   const help = Object.assign(req.locals.faq, updatedHelp);

//   help.save()
//     .then((faq) => res.json({code : 200, message : 'Help updated successfully.', data: help.transform()}))
//     .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const helps = await Help.list(req.query);
    const transformedHelps = helps.map((faq) => faq.transform());
    res.json({code : 200, message : 'Help list retrieved successfully.', data: transformedHelps});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { help } = req.locals;
  help.remove()
    .then(() => res.json({code : 200, message : 'Help deleted successfully.', data: null}))
    .catch((e) => next(e));
};
