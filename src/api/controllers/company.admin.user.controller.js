const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../models/user.model');
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
exports.get = (req, res) => res.json({code: 200, message: 'Company admin user retrieved successfully.', data: req.locals.company.transform()});


exports.users = (req,res) => {
  Company.find({companyId : req.body.companyId})
  .populate([
    {
      path : 'company',
      model : 'Company'
    },
    {
      path : 'sites',
      model : 'Site'
    },
    {
      path : 'roleId',
      model : 'admin_roles'
    },
    {
        path : 'vendor',
        model : 'VendorClients'
    }
  ])
  .sort({createdAt : -1})
  .then((data) => res.json({code: 201, message: 'Company admin user created successfully.', data: data}))
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
        res.json(400, {code: 400, message: 'Company admin user email already exists try different one.'});
      }
      else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('iamcompanyuser', salt);
        req.body.password  = hash;
        req.body.login_as = "CLIENT_USER"
        const company = new Company(req.body);
        const savedCompany = await company.save();
       
        var response = await Company.findOne({_id : savedCompany._id})
        .select("_id firstname lastname email company roleId vendor sites")
        .populate([
            {
              path : 'company',
              model : 'Company'
            },
            {
              path : 'roleId',
              model : 'admin_roles'
            },
            {
              path : 'vendor',
              model : 'Company'
            },
            {
              path : 'sites',
              model : 'Site'
            }
          ])
          res.json({code: 201, message: 'Company admin user created successfully.', data: response})
        // .then((data) => res.json({code: 201, message: 'Company user created successfully.', data: data}))
        // .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
      
      }
    })
    
  } catch (error) {
    next(error);
  }
};


exports.update = async(req, res, next) => {
  await Company.updateOne({_id : req.params.companyId}, req.body)
    .then(async (savedCompany) => {
      var data = await Company.findOne({_id : req.params.companyId})
      .select("_id firstname lastname email company roleId vendor sites")
      .populate([
          {
            path : 'company',
            model : 'Company'
          },
          {
            path : 'roleId',
            model : 'admin_roles'
          },
          {
            path : 'vendor',
            model : 'Company'
          },
          {
            path : 'sites',
            model : 'Site'
          }
        ])
        res.json({code: 201, message: 'Company admin user updated successfully.', data: data});
    })
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const {page = 1, perPage  = 25} = req.query;
    const options = { login_as : 'CLIENT_USER'}
    if(req.query.companyId){
      options['company']=req.query.companyId
    }
    Company.find(options)
    .select("_id firstname lastname email company roleId vendor sites isVerified createdAt")
    .populate([
      {
        path : 'company',
        model : 'Company'
      },
      {
        path : 'roleId',
        model : 'admin_roles'
      },
      {
        path : 'vendor',
        model : 'Company',
        // populate :{
        //   path : 'vendor',
        //   model : 'Company',
        // }
      },
      {
        path : 'sites',
        model : 'Site'
      }
    ])
    .sort({ createdAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .then((data) => res.json({code: 201, message: 'Company admin user list retrieved successfully.', data: data}))
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
    .then(() => res.json({code : 200, message : 'Company admin user delete successfully.', data : {}}))
    .catch((e) => next(e));
};


exports.status = async(req, res, next) => {
  let id = req.params.userId;
  let isVerified = req.body.isVerified;
  await Company.updateOne({_id : id, login_as : 'CLIENT_USER'},{isVerified : isVerified},async  function(err, user){
    if(err){
      next(err)
    }

    if(user === null){
      res.json({code : 403, message : 'User not found.'})
    }

    let newUser = await Company.findOne({_id : id});

    res.json({code : 200, message : `Admin user ${isVerified  === true ? 'activated' : 'deactivated'} successfully.`, data : newUser})
  })
};