const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Alarm = require('../models/alarm.model');
const Dynamic = require('../models/dynamic.site.overview.model')
const { omitBy, isNil } = require('lodash');


exports.load = async (req, res, next, id) => {
  try {
    const shift = await Dynamic.get(id);
    req.locals = { shift };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async(req, res) => {
  res.json({code: 200, message: 'Report retrieved successfully.', data: req.locals.shift.transform()})
};


exports.loggedIn = (req, res) => res.json(req.shift.transform());

exports.create = async (req, res, next) => {
  try {
    req.body.addedBy = req.user._id;
    req.body.role = req.user.login_as;
    const check = await Dynamic.findOne(req.body);
    if(!check){
      const dynamic = new Dynamic(req.body);
      const savedDynamic = await dynamic.save();
      res.status(httpStatus.CREATED);
      res.send(201, { code: 201, message: 'Report added successfully.', data: savedDynamic.transform() });
    }
    else{
      res.send(403, { code: 403, message: 'Report already added, please add different one'});
    }
    
  } catch (error) {
    next(error);
  }
};


exports.update = async(req, res, next) => {
  req.body.addedBy = req.user._id;
  req.body.role = req.user.login_as;
  const dynamic =  await Dynamic.updateOne({_id : req.params.dynamicId}, req.body, async function(err, alarm){
    if(err){
      next(e)
    }
    let getDynamic = await Dynamic.findOne({_id : req.params.alarmId}).populate([
        {
            path : 'reportTypeId',
            model : 'AllReportType'
        },
        {
            path : 'siteId',
            model : 'Site'
        },
        {
            path : 'addedBy',
            model : 'User'
        },
    ]);
    res.json({ code: 200, message: 'Report updated successfully.', data: getDynamic })
  });
};



exports.list = async (req, res, next) => {
  try {
    const {addedBy, siteId, reportTypeId,perPage = 25, page = 1} = req.query;
    var dynamics = [];
    const  options = omitBy({ addedBy, siteId, reportTypeId }, isNil);
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      dynamics = await Dynamic.find(options)
        .populate([
            {
                path : 'reportTypeId',
                model : 'AllReportType'
            },
            {
                path : 'siteId',
                model : 'Site'
            },
            {
                path : 'addedBy',
                model : 'User'
            },
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    else{
        dynamics = await Dynamic.find(options)
        .populate([
            {
                path : 'reportTypeId',
                model : 'AllReportType'
            },
            {
                path : 'siteId',
                model : 'Site'
            },
            {
                path : 'addedBy',
                model : 'User'
            },
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
  
    res.json({ code: 200, message: 'Report list retrieved successfully.', data: dynamics });
  } catch (error) {
    next(error);
  }
};


exports.remove = async(req, res, next) => {
  await Dynamic.deleteOne({_id : req.params.alarmId})
    .then(() => res.json(200, { code: 200, message: 'Remove report successfully.' }))
    .catch((e) => next(e));
};
