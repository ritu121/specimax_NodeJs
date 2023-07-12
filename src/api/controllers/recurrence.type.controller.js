const httpStatus = require('http-status');
const { omit } = require('lodash');
const ShiftType = require('../models/recurrence.type.model');
const multer = require('multer');


/**
 * Load user and append to req.
 * @public
 */
 exports.load = async (req, res, next, id) => {
    try {
      const logs = await ShiftType.get(id);
      req.locals = { logs };
      // console.log('err',req.locals)
      return next();
    } catch (error) {
      return next(error);
    }
  };
  


/**
 * Get user
 * @public
 */
 exports.get = (req, res) => res.json({code: 200, message: 'Recurrence Types retrieved successfully.', data: req.locals.logs.transform()});

 /**
  * Get logged in user info
  * @public
  */
 
 /**
  * Create new user
  * @public
  */
 exports.create = async (req, res, next) => {
   try {
     const shiftType = new ShiftType(req.body);
     const savedType = await shiftType.save();
     res.status(httpStatus.CREATED);
     res.json({code: 201, message: 'Recurrence type created successfully.', data: savedType.transform()});
   } catch (error) {
     next(error);
   }
 };
 
 /**
  * Replace existing user
  * @public
  */

 /**
  * Update existing user
  * @public
  */

 
 /**
  * Get user list
  * @public
  */
 exports.list = async (req, res, next) => {
   try {
     const type = await ShiftType.list(req.query);
     const transformedLogs = type.map((typ) => typ.transform());
     res.json({code : 200, message : 'Recurrence type list retrieved successfully.', data: transformedLogs});
   } catch (error) {
     next(error);
   }
 };
 
 /**
  * Delete user
  * @public
  */

 
