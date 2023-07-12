const httpStatus = require('http-status');
const { omit } = require('lodash');
const LicenseType = require('../models/license.type.model');
const CityModel = require('../models/state.model');
const multer = require('multer');


/**
 * Load user and append to req.
 * @public
 */
 exports.load = async (req, res, next, id) => {
    try {
      const logs = await LicenseType.get(id);
      req.locals = { logs };
      return next();
    } catch (error) {
      return next(error);
    }
  };
  


/**
 * Get user
 * @public
 */
 exports.get = (req, res) => res.json({code: 200, message: 'Shift Types retrieved successfully.', data: req.locals.logs.transform()});

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
     const licenseType = new LicenseType(req.body);
     const savedType = await licenseType.save();
     res.status(httpStatus.CREATED);
     res.json({code: 201, message: 'License added successfully.', data: savedType.transform()});
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
    if(req.query.cities){
      req.query.name = req.query.cities
      let data = await CityModel.list(req.query)
      console.log('aa',data)
    req.query.state = req.query.cities

    }
    // if(req.query.country){
      
    // }
     const type = await LicenseType.list(req.query);
    //  const transformedLogs = type.map((typ) => typ.transform());
     res.json({code : 200, message : 'Shift type list retrieved successfully.', data: type});
   } catch (error) {
     next(error);
   }
 };
 
 exports.update = (req, res, next) => {
  const updatedShift = omit(req.body);
  const shift = Object.assign(req.locals.logs, updatedShift);

  shift.save()
    .then((data) => res.json({ code: 200, message: 'License Type updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
};
 /**
  * Delete user
  * @public
  */
  exports.remove = (req, res, next) => {
    const { logs } = req.locals;
  
    logs.remove()
      .then(() => res.json(200, { code: 200, message: 'License Type delete successfully.' }))
      .catch((e) => next(e));
  };

 
