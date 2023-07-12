const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Alarm = require('../models/alarm.model');
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
    const shift = await Alarm.get(id);
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

  res.json({code: 200, message: 'Alarm retrieved successfully.', data: req.locals.shift.transform()})
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.shift.transform());

exports.create = async (req, res, next) => {
  try {
    const shift = new Alarm(req.body);
    const savedShift = await shift.save();
    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Alarm created successfully.', data: savedShift.transform() });
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
    const newShift = new Shift(req.body);
    const newShiftObject = omit(newShift.toObject(), '_id');
    await shift.updateOne(newShiftObject, { override: true, upsert: true });
    const savedShift = await shift.findById(shift._id);
    res.json({ code: 200, message: 'Alarm updated successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async(req, res, next) => {
  const shift =  await Alarm.updateOne({_id : req.params.alarmId}, req.body, async function(err, alarm){
    if(err){
      next(e)
    }
    let getAlarm = await Alarm.findOne({_id : req.params.alarmId}).populate([
      {
        path : 'shifts',
        model : 'Shift'
      },
      {
        path : 'company',
        model : 'Company'
      },
      {
        path : 'user',
        model : 'User'
      }
    ]);
    res.json({ code: 200, message: 'Alarm updated successfully.', data: getAlarm })
  });
};

exports.view = (req, res, next) => {
  const id = req.locals.shift;
  Shift.findOne({_id : id}, function(err, shift){
    if(err){
      res.send(500, { code: 500, message: 'Internal server error.', errors : err });
    }
    if(shift){
      res.send(200 ,{ code: 200, message: 'Alarm updated successfully.', data: shift});
    }
    res.send(404, { code: 404, message: 'Alarm updated successfully.', data: []});
  })
};

exports.list = async (req, res, next) => {
  try {
    const {startDate,endDate, status,siteId,companyId, userId,perPage = 25, page = 1} = req.query;
    var alarms = [];
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      var options = {}
      if(startDate && endDate){
        options = omitBy({ company : companyId, user : userId ,status, dueDate : {$gte : startDate} ,dueDate : {$lte : endDate}, sites : {$in : req.user.sites} }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate}, sites :  {$in : req.user.sites} }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$lte : endDate}, sites :  {$in : req.user.sites} }, isNil);
      }
      else{
        options = omitBy({ company : companyId, user : userId , status,sites :  {$in : req.user.sites} }, isNil);
      }
    
      alarms = await Alarm.find(options)
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
            path : 'user',
            model : 'User'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    else{
      var options = {}
      if(startDate && endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate} ,dueDate : {$lte : endDate}, sites : siteId }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate}, sites : siteId }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$lte : endDate}, sites : siteId }, isNil);
      }
      else{
        options = omitBy({ company : companyId, user : userId , status,sites : siteId }, isNil);
      }
    
      alarms = await Alarm.find(options)
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
            path : 'user',
            model : 'User'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    // const shifts = await Alarm.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Alarm list retrieved successfully.', data: alarms });
  } catch (error) {
    next(error);
  }
};


exports.listReport = async (req, res, next) => {
  try {
    console.log('i am in')
    const {startDate,endDate, status,siteId,companyId, userId,perPage = 25, page = 1} = req.query;
    var alarms = [];
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      console.log('CLICNET')
      var options = {}
      if(startDate && endDate){
        options = omitBy({ company : companyId, user : userId ,status, dueDate : {$gte : startDate} ,dueDate : {$lte : endDate}, sites : {$in : req.user.sites} }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate}, sites :  {$in : req.user.sites} }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$lte : endDate}, sites :  {$in : req.user.sites} }, isNil);
      }
      else{
        options = omitBy({ company : companyId, user : userId , status,sites :  {$in : req.user.sites} }, isNil);
      }
    
      alarms = await Alarm.find(options)
        .populate([
          {
            path : 'company',
            model : 'Company',
            select : 'name'
          },
          {
            path : 'sites',
            model : 'Site',
            select : 'name'
          },
          {
            path : 'user',
            model : 'User',
            select : 'firstname lastname'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    else{
      console.log('admin')
      var options = {}
      if(startDate && endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate} ,dueDate : {$lte : endDate}, sites : siteId }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$gte : startDate}, sites : siteId }, isNil);
      }
      else if(startDate && !endDate){
        options = omitBy({ company : companyId, user : userId , status, dueDate : {$lte : endDate}, sites : siteId }, isNil);
      }
      else{
        options = omitBy({ company : companyId, user : userId , status,sites : siteId }, isNil);
      }
    
      alarms = await Alarm.find(options)
        .populate([
          {
            path : 'company',
            model : 'Company',
            select : 'name'
          },
          {
            path : 'sites',
            model : 'Site',
            select : 'name'
          },
          {
            path : 'user',
            model : 'User',
            select : 'firstname lastname'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    // const shifts = await Alarm.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Alarm list retrieved successfully.', data: alarms });
  } catch (error) {
    next(error);
  }
};

exports.generateShiftCode = async (email)=>{
    let digits = "0123456789";
    let randNum = "";
    for (let i = 0; i < 6; i++) {
        randNum += digits[Math.floor(Math.random() * 10)];
    }
    return randNum
}

exports.resendShiftCode = async(req,res,next)=>{
  try {
    const data = await Alarm.findOne({ _id: req.locals.shift })
    emailProvider.resendShiftCode(req.user, data.shiftCode);
    return res.send(201, { code: 201,status:true, message: 'Alarm Code Emailed Successfully.' });
  } catch (error) {
    next(error)
  }
}
exports.updateIntrest = async(req,res,next)=>{
    try {
        const update = req.locals.shift.intrestedUsers.push(req.user._id)
        const saveShift = await req.locals.shift.save()
        return res.send(201, { code: 201,status:true, message: 'Interest Updated Successfully.' });

    } catch (error) {
        next(error)
    }
}
exports.releaseShift = async(req,res,next)=>{
    try {
        const shift = await Alarm.get(req.body.shiftId);

        const ind = shift.intrestedUsers.indexOf(req.user._id)
        if (ind<0){
            return res.send(400, { code: 400,status:true, message: 'User newer applied.' });
        }
        shift.intrestedUsers.splice(ind,1);
        if (shift.status=='Assigned' && shift.assignedUser==req.user._id){
            shift.status='Unassigned'
        }
        const saveShift = await shift.save()
        return res.send(201, { code: 201,status:true, message: 'Alarm Released Successfully.' });

    } catch (error) {
        next(error)
    }
}
exports.cancelIntrest = async(req,res,next)=>{
    try {
        return res.send(201, { code: 201,status:true, message: 'Subscription Successfully.' });

    } catch (error) {
        next(error)
    }
}
exports.accpetInterest = async(req,res,next)=>{
    
    try {
        const shift = await Alarm.get(req.body.shiftId);
        if (shift.status=='Assigned'){
            return res.send(400, { code: 400,status:false, message: 'Alarm already assigned.' });

        }
        shift.assignedUser=req.body.userId;
        shift.status='Assigned';
        const saveShift = await shift.save()
        let data={}
        data.casualShiftId=saveShift._id;
        data.userId=req.body.userId;
        data.siteId = shift.siteId;
        data.shiftDate = shift.startDate;
        data.startDate = shift.startDate;
        data.endDate = shift.endDate;
        await controller.addUserShift(data);
        return res.send(201, { code: 201,status:true, message: 'Alarm Accepted Successfully.' });

    } catch (error) {
        next(error)
    }
}
exports.addBreak = async(req,res,next)=>{
  try {
    let addBreak = new Breaks(req.body);
    let saveData = await addBreak.save()
    const id = req.locals.shift;
    const updateShift = await Alarm.updateOne({_id:id},{$push:{'breaks':saveData._id}})
    const savedShift = await Alarm.findById(id);

    res.send(200 ,{ code: 200, message: 'Break added successfully.', data: savedShift.transform()});
  } catch (error) {
    next(error)
  }
}


exports.remove = async(req, res, next) => {
  await Alarm.deleteOne({_id : req.params.alarmId})
    .then(() => res.json(200, { code: 200, message: 'Alarm delete successfully.' }))
    .catch((e) => next(e));
};
