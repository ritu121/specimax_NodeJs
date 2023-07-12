const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../models/user.model');
const Company1 = require('../models/company.model');
const bcrypt = require('bcryptjs');
const { updateCompany } = require('../validations/company.user.validation');

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
exports.get = (req, res) => res.json({code: 200, message: 'Company user list retrieved successfully.', data: req.locals.company.transform()});


exports.users = async(req,res) => {
  let id = await Company1.findOne({email:req.user.email},{id:1})
  Company.find({'role':'admin','login_as':'GUARD'})
  .populate([
    {
      path : 'companyId',
      model : 'Company'
    },
    {
      path : 'country',
      model : 'Country'
    },
    {
      path : 'roleId',
    }
  ])
  .sort({createdAt : -1})
  // .limit(2)
  .then((data) => res.json({code: 201, message: 'Company user list retreived successfully.', data: data}))
  .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
}
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
        res.json(400, {code: 400, message: 'Company user email already exists try different one.'});
      }
      else{
        
        req.body.role='admin'
        const company = new Company(req.body);
        const savedCompany = await company.save();
        Company.findOne({_id : savedCompany._id})
        .populate([
          {
            path : 'companyId',
            model : 'Company'
          },
          {
            path : 'roleId',
          },
          {
            path : 'country',
            model : 'Country'
          },
        ])
        .then((data) => res.json({code: 201, message: 'Company user created successfully.', data: data}))
        .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
      
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

    res.json({code: 200, message: 'Company user updated successfully.', data: savedCompany.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  // const updatedCompany = omit(req.body);

  var  updatedCompany = {};
  
  var hash = "";
  
  updatedCompany = omit(req.body);

  Company.updateOne({_id : req.params.companyId}, updatedCompany)
    .then((savedCompany) => {
      Company.findOne({_id : savedCompany._id})
        .populate([
          {
            path : 'companyId',
            model : 'Company'
          },
          {
            path : 'country',
            model : 'Country'
          },
          {
            path : 'roleId',
            model : 'Role'
          }
        ])
        .then((data) => res.json({code: 201, message: 'Company user updated successfully.', data: data}))
        .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
    })
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    Company.find({})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'country',
        model : 'Country'
      },
      {
        path : 'roleId',
        model : 'Role'
      }
    ])
    .sort({ createdAt: -1 })
    .then((data) => res.json({code: 201, message: 'Company user list retrieved successfully.', data: data}))
    .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
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
    .then(() => res.json({code : 200, message : 'Company user delete successfully.', data : {}}))
    .catch((e) => next(e));
};
