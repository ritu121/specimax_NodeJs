const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Notification = require('../models/notification.model');
const Skills = require('../models/required.skill.and.experience.model');
// const Breaks = require('../../models/breaks.model');
const emailProvider = require('../services/emails/emailProvider');
const Duty = require('../models/key.shift.duties.model');
const controller = require('./user/user.shift.controller');
const { omitBy, isNil } = require('lodash');


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const shift = await Notification.get(id);
    req.locals = { shift };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */

// exports.getKeyDuties = async(id)=>{
//     try {
//         const duties = await Duty.findOne({shiftId:id},{key:1})
//         console.log('check',id,duties)
//         return duties;
//     } catch (error) {
//         next(error)
//     }
// }
// exports.getSkills = async(id)=>{
//     try {
//         const duties = await Skills.findOne({shiftId:id},{skill:1})
//         console.log('check',id,duties)
//         return duties;
//     } catch (error) {
//         next(error)
//     }
// }
exports.get = async(req, res) => {
    // let duties = await this.getKeyDuties(req.locals.shift._id)
    // let skills = await this.getSkills(req.locals.shift._id)
  res.json({code: 200, message: 'Notifications retrieved successfully.', data: req.locals.shift.transform()})
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.shift.transform());

exports.create = async (req, res, next) => {
  try {
    // req.body.userId = req.user._id;
    // req.body.shiftCode = await this.generateShiftCode(req.user)
    const shift = new Notification(req.body);
    const savedShift = await shift.save();
    // const addShiftDuties = new Duty({'key':req.body.key,'shiftId':savedShift._id});
    // await addShiftDuties.save()
    // emailProvider.resendShiftCode(req.user, req.body.shiftCode);
    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Notification created successfully.', data: savedShift.transform() });
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
    const { shift } = req.locals;
    const newShift = new Notification(req.body);
    const newShiftObject = omit(newShift.toObject(), '_id');

    await shift.updateOne(newShiftObject, { override: true, upsert: true });
    const savedShift = await shift.findById(shift._id);

    res.json({ code: 200, message: 'Notification updated successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedShift = omit(req.body);
  const shift = Object.assign(req.locals.shift, updatedShift);

  shift.save()
    .then((data) => res.json({ code: 200, message: 'Notification updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
};


exports.view = (req, res, next) => {
  const id = req.locals.shift;
  Notification.findOne({_id : id}, function(err, shift){
    if(err){
      res.send(500, { code: 500, message: 'Internal server error.', errors : err });
    }

    if(shift){
      res.send(200 ,{ code: 200, message: 'Notification updated successfully.', data: shift});
    }

    res.send(404, { code: 404, message: 'Notification updated successfully.', data: []});
  })
};
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    var notifications = []
    const {startDate, perPage = 25, page = 1} = req.query;
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      let options = omitBy({ startDate : startDate, siteId : {$in : req.user.sites} }, isNil);
      notifications = await  Notification.find(options)
        .populate([
          {
            path : 'siteId',
            model : 'Site'
          },
          {
            path : 'userId',
            model: 'User'
          },
          {
            path : 'company',
            model: 'Companies'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    else{
      let options = omitBy({ startDate }, isNil);
      notifications = await  Notification.find(options)
        .populate([
          {
            path : 'siteId',
            model : 'Site'
          },
          {
            path : 'userId',
            model: 'User'
          },
          {
            path : 'company',
            model: 'Company'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    // const shifts = await Notification.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Notification list retrieved successfully.', data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.listByUser = async (req, res, next) => {
  try {
    var notifications = []
    const {startDate, perPage = 25, page = 1} = req.query;
      let options = omitBy({ endDate : {$gte:startDate},userId:req.user._id }, isNil);
      notifications = await  Notification.find(options,{notes:1,notification:1,siteId:1,company:1})
        .populate([
          {
            path : 'siteId',
            model : 'Site',
            select:"name"
          },
          {
            path : 'company',
            model: 'Company',
            select:"name"
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    
    
    // const shifts = await Notification.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Notification list retrieved successfully.', data: notifications });
  } catch (error) {
    next(error);
  }
};
exports.listByUserCount = async (userId) => {
  try {
    var notifications = []
    // const {startDate, perPage = 25, page = 1} = req.query;
    let startDate = new Date()
      let options = omitBy({ endDate : {$gte:startDate},userId }, isNil);
      notifications = await  Notification.find(options,{notes:1,notification:1,siteId:1,company:1})
        .populate([
          {
            path : 'siteId',
            model : 'Site',
            select:"name"
          },
          {
            path : 'company',
            model: 'Company',
            select:"name"
          }
        ])
        .sort({ createdAt: -1 })
        .exec();
    return notifications.length
    
    // const shifts = await Notification.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    // res.json({ code: 200, message: 'Notification list retrieved successfully.', data: notifications });
  } catch (error) {
    console.log('err',error)
    next(error);
  }
};





/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { shift } = req.locals;

  shift.remove()
    .then(() => res.json(200, { code: 200, message: 'Notification delete successfully.' }))
    .catch((e) => next(e));
};
