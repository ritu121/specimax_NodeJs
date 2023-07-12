const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../../models/user.model');
const Site = require('../../models/site.model');
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
exports.get = (req, res) => res.json({code: 200, message: 'Guards list retrieved successfully.', data: req.locals.company.transform()});


exports.users = (req,res) => {
  Company.find({role: 'user'})
  .populate([
    {
      path : 'companyId',
      model : 'Company'
    },
    {
      path : 'roleId',
      model : 'Role'
    },
    {
        path : 'country',
        model : 'Country'
      },
  ])
  .sort({createdAt : -1})
  .then((data) => res.json({code: 201, message: 'Guard retreived successfully.', data: data}))
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
        res.json(400, {code: 400, message: 'Guard email already exists try different one.'});
      }
      else{
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(req.body.password, salt);
        // req.body.password  = hash;
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
          },
          {
            path : 'country',
            model : 'Country'
          },
        ])
        .then((data) => res.json({code: 201, message: 'Guard created successfully.', data: data}))
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

  let updatedCompany = omit(req.body);

  
  // const company = Object.assign(req.locals.company, updatedCompany);

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
          },
          {
            path : 'country',
            model : 'Country'
          },
        ])
        .then((data) => res.json({code: 201, message: 'Guard updated successfully.', data: data}))
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
    let options ={'role':'user', login_as : {$nin  : ['CLIENT_USER','CLIENT','COMPANY_CLIENT']}}
    if(req.query.company){
      let team=[]
      let sites = await Site.find({companyId:req.query.company},{team:1})
      // sites.map(e=>{
      //   team.concat(e.team)
      // })
      for(let i=0;i<sites.length;i++){
        console.log('ss',sites[i].team,sites[i])
        team = team.concat(sites[i].team)
      }
      // console.log('site',sites,team)
      options['_id']=team
      
      // options['company']=req.query.company
    }
    Company.find(options)
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'roleId',
        model : 'Role'
      },
      {
        path : 'country',
        model : 'Country'
      },
    ])
    .sort({ createdAt: -1 })
    .then((data) => res.json({code: 201, message: 'Guard list retrieved successfully.', data: data}))
    .catch((errors) => res.json({code: 500, message: 'Internal server error.', errors : errors}))
  } catch (error) {
    next(error);
  }
};



exports.changeStatus = async (req, res, next) => {
  try {
    Company.updateOne({_id : req.params.userId},{isVerified : req.body.isVerified, isDeleted : !req.body.isVerified}, async function(err, company){
      if(err){
        next(err)
      }
      else{
        let user =  await Company.findOne({_id : req.params.userId});
        res.json({code: 201, message: `Guard ${req.body.isVerified  === true ? 'activated' : 'deactivated'} successfully.`, data: user})
      }
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
  const { company } = req.locals;

  company.remove()
    .then(() => res.json({code : 200, message : 'Guard delete successfully.', data : {}}))
    .catch((e) => next(e));
};
