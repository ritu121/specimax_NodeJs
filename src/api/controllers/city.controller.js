const httpStatus = require('http-status');
const { omit } = require('lodash');
const City = require('../models/city.model');
const bcrypt = require('bcryptjs');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    // const city = await City.get(id);
    const city = null;
    req.locals = { city };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'City list retrieved successfully.', data: req.locals.city.transform()});

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
    City.findOne({email : req.body.email}, async function(err, data){
      if(err){
        res.json(500, {code: 500, message: 'Internal server error.', errors: err});
      }
      if(data){
        res.json(400, {code: 400, message: 'City email already exists try different one.'});
      }
      else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password  = hash;
        const city = new City(req.body);
        const savedCity = await city.save();
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'City created successfully.', data: savedCity.transform()});
      }
    })
    
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
    const { city } = req.locals;
    const newCity = new City(req.body);
    const newCityObject = omit(newCity.toObject(), '_id');

    await city.updateOne(newCityObject, { override: true, upsert: true });
    const savedCity = await City.findById(city._id);

    res.json({code: 200, message: 'City updated successfully.', data: savedCity.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedCity = omit(req.body);
  const city = Object.assign(req.locals.company, updatedCompany);

  city.save()
    .then((savedCity) => res.json({code : 200, message : 'City updated successfully.', data: savedCity.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const cities = await City.list(req.query);
    const transformedCities = cities.map((status) => status.transform());
    res.json({code : 200, message : 'City list retrieved successfully.', data: transformedCities});
  } catch (error) {
    next(error);
  }
};

exports.cities = async (req, res, next) => {
  try {
    City.find({countryId : req.params.cityId}).sort({name:1})
    .then((data) => {
      res.json({code : 200, message : 'City list retrieved successfully.', data: data});
    })
    .catch((error) => {
      res.json({code : 500, message : 'Internal server error.', errors : error});
    })
   
  } catch (error) {
    next(error);
  }
};


/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { city } = req.locals;

  city.remove()
    .then(() => res.json({code : 200, message : 'City delete successfully.', data : {}}))
    .catch((e) => next(e));
};
