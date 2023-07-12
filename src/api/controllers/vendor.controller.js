const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../models/company.model');
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const bcrypt = require('bcryptjs');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const company = await Company.get(id);
    req.locals = { company };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Vendor list retrieved successfully.', data: req.locals.company.transform()});

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
    Company.findOne({email : req.body.email}, async function(err, data){
      if(err){
        res.json(500, {code: 500, message: 'Internal server error.', errors: err});
      }
      if(data){
        res.json(400, {code: 400, message: 'Vendor email already exists try different one.'});
      }
      else{
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(req.body.password, salt);
        // req.body.password  = hash;
        req.body.type='vendor'
        // req.body.companyId = req.params.cityId;
        req.body.company = req.body.companyId
        const company = new Company(req.body);
        const savedCompany = await company.save();
        const clients = new Vendor({vendor:savedCompany._id})
        req.body.role='admin'
        req.body.login_as='VENDOR'
        req.body.company=savedCompany._id
        req.body.country = req.body.countryId
        const usr = new User(req.body)
        await usr.save()
        await clients.save();
        Company.findOne({_id : savedCompany._id},{type:0})
        .populate([
          {
            path : 'countryId',
            model : 'Country'
          },
          {
            path : 'cityId',
            model : 'City'
          },
          {
            path : 'company',
            model : 'Company'
          }
        ])
        .then((data) => {
          res.json({code: 201, message: 'Vendor created successfully.', data: data});
        })
        .catch((errors) => {
          res.json({code: 500, message: 'Internal server error.', errors : errors});
        })

        
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
    const { company } = req.locals;
    const newCompany = new Company(req.body);
    const newCompanyObject = omit(newCompany.toObject(), '_id');

    await company.updateOne(newCompanyObject, { override: true, upsert: true });
    const savedCompany = await Company.findById(company._id);

    res.json({code: 200, message: 'Vendor updated successfully.', data: savedCompany.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedCompany = omit(req.body);
  const company = Object.assign(req.locals.company, updatedCompany);

  company.save()
    .then((savedCompany) => {
      
      Company.findOne({_id : savedCompany._id})
        .populate([
          {
            path : 'countryId',
            model : 'Country'
          },
          {
            path : 'cityId',
            model : 'City'
          }
        ])
        .then((data) => {
          res.json({code: 201, message: 'Vendor updated successfully.', data: data});
        })
        .catch((errors) => {
          res.json({code: 500, message: 'Internal server error.', errors : errors});
        })
    })
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    req.query.type='vendor'
    const companies = await Company.list(req.query);
    const transformedCompanies = companies.map((status) => status.transform());
    res.json({code : 200, message : 'Vendor list retrieved successfully.', data: transformedCompanies});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { company } = req.locals;

  company.remove()
    .then(() => res.json({code : 200, message : 'Vendor delete successfully.', data : {}}))
    .catch((e) => next(e));
};
