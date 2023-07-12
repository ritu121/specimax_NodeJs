const httpStatus = require('http-status');
const { omit } = require('lodash');
const Company = require('../models/company.model');
const Site = require('../models/site.model');
const Shift = require('../models/shift.model');
const ShiftLog = require('../models/shift.logs.model');
const CasualShift = require('../models/casual.shift.model');
const SiteRoster = require('../models/site.roster.model')
const Task = require('../models/task.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const ClockData = require('../models/clock.data.model');
const CheckPoint = require('../models/site.checkpoints.model');
const Alarm = require('../models/alarm.model')
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
exports.get = (req, res) => res.json({code: 200, message: 'Company list retrieved successfully.', data: req.locals.company.transform()});

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
        res.json(400, {code: 400, message: 'Company email already exists try different one.'});
      }
      else{
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(req.body.password, salt);
        // req.body.password  = hash;
        req.body.type='client'
        req.body.companyId = req.params.cityId;
        const company = new Company(req.body);
        const savedCompany = await company.save();
        req.body.role='admin'
        req.body.login_as='CLIENT'
        req.body.company=savedCompany._id
        req.body.country = req.body.countryId
        const usr = new User(req.body)
        await usr.save()
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
          res.json({code: 201, message: 'Company created successfully.', data: data});
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

    res.json({code: 200, message: 'Company updated successfully.', data: savedCompany.transform()});
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
      Company.findOne({_id : savedCompany._id},{type:0})
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
          res.json({code: 201, message: 'Company updated successfully.', data: data});
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
    req.query.type='client'
    let perPage = req.query.perPage||25
    let page = req.query.page||1
    const companies = await Company.find({_id:{$in:req.user.companyList},type:'client'})
    .populate([
      {
        path : 'countryId',
        model : 'Country'
      },
      {
        path : 'roleId',
      },
      {
        path : "cityId",
        model : "City"
      }
    ])
    .sort({ createdAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec();
    const transformedCompanies = companies.map((status) => status.transform());
    res.json({code : 200, message : 'Company list retrieved successfully.', data: transformedCompanies});
  } catch (error) {
    next(error);
  }
};

exports.listAll = async (req, res, next) => {
  try {
    // req.query.type='client'
    const companies = await Company.find({ type : "client"})
                      .populate([
                        {
                          path : 'countryId',
                          model : 'Country'
                        },
                        {
                          path : 'roleId',
                        },
                        {
                          path : "cityId",
                          model : "City"
                        }
                      ]);
    // const transformedCompanies = companies.map((status) => status.transform());
    res.json({code : 200, message : 'Company list retrieved successfully.', data: companies});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async(req, res, next) => {
  const { company } = req.locals;
  let siteProcess = await Site.find({companyId : req.params.companyId}, async function(err, sites){
    for(var i = 0; i < sites.length; i++){
      await Shift.find({siteId : sites[i]._id}, async function(err, shifts){
         for(var j = 0; j < shifts.length; j++){
          await ShiftLog.deleteMany({shiftId : shifts[j]._id})
         }
      });
      await SiteRoster.deleteMany({siteId : sites[i]._id})
      await Shift.deleteMany({siteId : sites[i]._id})
      await CasualShift.deleteMany({siteId : sites[i]._id});
      await ShiftLog.deleteMany({siteId : sites[i]._id});
      await Task.deleteMany({siteId : sites[i]._id});
      await Notification.deleteMany({siteId : sites[i]._id});
      await ClockData.deleteMany({siteId : sites[i]._id});
      await CheckPoint.deleteMany({siteId : sites[i]._id});
      await Alarm.deleteMany({sites : sites[i]._id});
    }

    await Site.deleteMany({companyId : req.params.companyId});
  })
  
  
  await company.remove()
    .then(() => res.json({code : 200, message : 'Company delete successfully.', data : {}}))
    .catch((e) => next(e));
};
