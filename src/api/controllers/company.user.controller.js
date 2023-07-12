const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../models/company.user.model');
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


exports.users = (req,res) => {
  Company.find({companyId : req.body.companyId})
  .populate([
    {
      path : 'companyId',
      model : 'Company'
    },
    {
      path : 'roleId',
      model : 'Role'
    }
  ])
  .sort({createdAt : -1})
  .then((data) => res.json({code: 201, message: 'Company user created successfully.', data: data}))
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
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password  = hash;
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
            model : 'Role'
          }
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
  if(req.body.password !== null && req.body.password !== 'null' && typeof req.body.password !== "object"){
    const salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password  = hash;
    
    updatedCompany = {
      companyId : req.body.companyId,
      roleId : req.body.roleId,
      name : req.body.name,
      email : req.body.email,
      phone : req.body.phone,
      password : req.body.password
    };
  }
  else{
    updatedCompany = {
      companyId : req.body.companyId,
      roleId : req.body.roleId,
      name : req.body.name,
      email : req.body.email,
      phone : req.body.phone,
    };
  }

  Company.updateOne({_id : req.params.companyId}, updatedCompany)
    .then((savedCompany) => {
      Company.findOne({_id : savedCompany._id})
        .populate([
          {
            path : 'companyId',
            model : 'Company'
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
