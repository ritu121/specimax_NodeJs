const httpStatus = require('http-status');
const { omit, forEach } = require('lodash');
const multer = require('multer');
const moment = require('moment-timezone')
const exceljs = require('exceljs');
const stripe = require('stripe')('sk_test_51LLPCjCK0aC99gHRt1NdlldC5A0HLZ8LwVk6dcYV5mvGoFVPZvVJphZQDGo8aw3Ry3mE9LVoTvCiNluJDSp0x0iK00cU8eeJ88');
const Shift = require('../../models/casual.shift.model');
const UserShift = require('../../models/shift.model');
const Setting = require('../../models/user.setting.model');
const User = require('../../models/user.model');
const Site = require('../../models/site.model');
const Skills = require('../../models/required.skill.and.experience.model');
// const Breaks = require('../../models/breaks.model');
const emailProvider = require('../../services/emails/emailProvider');
const Duty = require('../../models/key.shift.duties.model');
const Availability = require('../../models/shift.availability.model');
const Receipt = require('../receipt.controller');
const controller = require('../user/user.shift.controller');
const Card = require('../../models/user.payment.card.model');
const uuidv4 = require("uuid/v4")
const {getDateRange,sentPushNotification} = require('../../utils/helper')
const { omitBy, isNil } = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.load = async (req, res, next, id) => {
  try {
    const shift = await Shift.get(id);
    req.locals = { shift };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.getKeyDuties = async (id) => {
  try {
    const duties = await Duty.findOne({ shiftId: id }, { key: 1 })
    return duties;
  } catch (error) {
    next(error)
  }
}

exports.getSkills = async (id) => {
  try {
    const duties = await Skills.findOne({ shiftId: id }, { skill: 1 })
    return duties;
  } catch (error) {
    next(error)
  }
}

exports.get = async (req, res) => {
  let duties = await this.getKeyDuties(req.locals.shift._id)
  let skills = await this.getSkills(req.locals.shift._id)
  res.json({ code: 200, message: 'Shift retrieved successfully.', data: req.locals.shift.transform(), 'shiftDuties': duties, 'skills': skills })
};

exports.loggedIn = (req, res) => res.json(req.shift.transform());

// exports.create = async (req, res, next) => {
//   try {
//     if(req.body.siteId && req.body.assignedUser){
//       if(req.body.recurrenceDay.length > 0){
//         console.log('IN')
//         let ranges = await getDateRange(new Date(req.body.startDate), new Date(req.body.endDate));
//         let days = req.body.recurrenceDay;
//         req.body.recurrenceId = uuidv4();
//         req.body.groupId = uuidv4();
//         for(var i =0; i < ranges.length; i++){
//           console.log('Loop')
//           console.log('DATE ---', ranges[i])
//            var dynamicDate = new Date(ranges[i]);
//            console.log('LOOPS DATES', days)
//            console.log('FIND DAY', dynamicDate.getDay().toString())
//            if(days.includes(dynamicDate.getDay().toString())){
//             console.log('INSIDE')
//             console.log('DATE  NO---', dynamicDate.getDay())
//               // saved casual shift
//               req.body.isRecurrence = true;
//               // req.body.groupId = uuidv4();
//               req.body.userId = req.user._id;
//               req.body.shiftCode = await this.generateShiftCode(req.user)
//               req.body.shiftDate = dynamicDate;
//               // req.body.recurrenceId = uuidv4();
//               req.body.isGroup = false;
//               const shift = new Shift(req.body);
//               const savedShift = await shift.save();
//               const addShiftDuties = new Duty({ 'key': req.body.key, 'shiftId': savedShift._id });
//               await addShiftDuties.save()
          
//               // saved shift
//               let data = {}
//               data.casualShiftId = savedShift._id;
//               data.userId = req.body.assignedUser;
//               data.siteId = shift.siteId;
//               data.shiftDate = dynamicDate;
//               data.startTime = req.body.startTime;
//               data.endTime = req.body.endTime;
//               data.startDate = shift.startDate;
//               data.endDate = shift.endDate;
//               data.groupId = req.body.groupId;
//               data.isGroup = false;
//               data.isRecurrence = true;
//               data.recurrenceId = req.body.recurrenceId ;
//               await controller.addUserShift(data);

//               // get user
//               let assigned = await User.findOne({_id : req.body.assignedUser})
//               // send email
//               emailProvider.resendShiftCode(assigned, req.body.shiftCode);
//            }
//         }
//       }

//       res.status(201).send({ code: 201, message: 'Casual Shift created successfully.', data: {} });
//     }
//     else if(req.body.siteId){
//       let site = await Site.findOne({_id : req.body.siteId}).populate({path : 'team',model : 'User'})
      
//       req.body.groupId = uuidv4();
//       req.body.isGroup = true;
//       if(site){
//         for(var i = 0; i < site.team.length; i++){
//           if(site.team[i]){
//             if(req.body.recurrenceDay.length > 0){
//               console.log('IN')
//               let ranges = await getDateRange(new Date(req.body.startDate), new Date(req.body.endDate));
//               let days = req.body.recurrenceDay;
//               req.body.recurrenceId = uuidv4();
//               for(var j =0; j < ranges.length; j++){
//                 console.log('Loop')
//                 console.log('DATE ---', ranges[j])
//                  var dynamicDate = new Date(ranges[j]);
//                  console.log('LOOPS DATES', days)
//                  console.log('FIND DAY', dynamicDate.getDay().toString())
//                  if(days.includes(dynamicDate.getDay().toString())){
//                      // saved casual shift
//                     req.body.userId = req.user._id;
//                     req.body.isRecurrence = true;
//                     req.body.shiftCode = await this.generateShiftCode(req.user)
//                     req.body.shiftDate = dynamicDate;
//                     req.body.assignedUser = site.team[i]._id;
//                     const shift = new Shift(req.body);
//                     const savedShift = await shift.save();
//                     const addShiftDuties = new Duty({ 'key': req.body.key, 'shiftId': savedShift._id });
//                     await addShiftDuties.save()
              
//                     // saved shift
//                     let data = {}
//                     data.casualShiftId = savedShift._id;  
//                     data.userId = req.body.assignedUser;
//                     data.siteId = shift.siteId;
//                     data.shiftDate = dynamicDate;
//                     data.startDate = shift.startDate;
//                     data.endDate = shift.endDate;
//                     data.groupId = req.body.groupId;
//                     data.isGroup = req.body.isGroup;
//                     data.isRecurrence = req.body.isRecurrence;
//                     data.recurrenceId = req.body.recurrenceId;
//                     await controller.addUserShift(data); 

//                     // send email
//                     emailProvider.resendShiftCode(site.team[i], req.body.shiftCode);
//                  }
//               }
//             }
            
//           }
//         }
//       }
//       res.status(201).send({ code: 201, message: 'Casual Shift created successfully.', data: {} });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

exports.create = async (req, res, next) => {
  try {
      // let site = await Site.findOne({_id : req.body.siteId}).populate({path : 'team',model : 'User'})
      
      req.body.groupId = uuidv4();
      req.body.isGroup = false;
      req.body.createdBy = req.user._id;

        // saved casual shift
      req.body.shiftCode = await this.generateShiftCode(req.user)
      const shift = new Shift(req.body);
      req.body.shiftType = 'Casual';
      const savedShift = await shift.save();
      const addShiftDuties = new Duty({ 'key': req.body.key, 'shiftId': savedShift._id });
      await addShiftDuties.save()
      // let ranges = await getDateRange(new Date(req.body.startDate), new Date(req.body.endDate));
      // let days = req.body.recurrenceDay;
      // req.body.recurrenceId = uuidv4();
      // saved shift
      let data = {}
      data.casualShiftId = savedShift._id;  
      data.siteId = shift.siteId;
      data.startDate = shift.startDate;
      data.endDate = shift.endDate;
      data.startTime = shift.startTime;
      data.endTime = shift.endTime;
      data.shiftType = 'Casual';
      data.status = 'Unassigned';
      data.shiftCode = req.body.shiftCode;
      data.recurrenceDay = req.body.recurrenceDay;
      data.groupId = req.body.groupId;
      data.isGroup = req.body.isGroup;
      data.createdBy = req.body.createdBy;
      await controller.addUserShift(data); 
      res.status(201).send({ code: 201, message: 'Casual Shift created successfully.', data: savedShift.transform() });
    
  } catch (error) {
    next(error);
  }
};


exports.updateShift = async (req, res, next) => {
  try {
    // req.body.groupId = uuidv4();
    // req.body.isGroup = true;
    req.body.createdBy = req.user._id;

    req.body.shiftCode = await this.generateShiftCode(req.user)
    // const shift = new Shift(req.body);
    // const savedShift = await shift.save();
    const shift = await Shift.updateOne({_id : req.params.shiftId},req.body, function(err, data){
      if(err){
        next(err)
      }
    });

    if(req.body.key){
      let deleteDuty = Duty.remove({shiftId: req.params.shiftId})
      const addShiftDuties = new Duty({ 'key': req.body.key, 'shiftId': req.params.shiftId });
      await addShiftDuties.save()
    }
   
    // emailProvider.resendShiftCode(req.user, req.body.shiftCode);
    const getShift = await Shift.findOne({_id : req.params.shiftId});

    let data = {}
    if(req.body.siteId){
      data.siteId = req.body.siteId;
    }
    if(req.body.startDate){
      data.startDate = req.body.startDate;
    }
    if(req.body.endDate){
      data.endDate = req.body.endDate;
    }
    if(req.body.startTime){
      data.startTime = req.body.startTime;
    }
    if(req.body.endTime){
      data.endTime = req.body.endTime;
    }
    if(req.body.recurrenceDay){
      data.recurrenceDay = req.body.recurrenceDay;
    }
    
    data.shiftType = 'Casual';
    data.shiftCode = req.body.shiftCode;
    data.createdBy = req.user._id;
    let userShift = await UserShift.updateOne({casualShiftId : req.params.shiftId}, data);

    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Casual Shift updated successfully.', data: getShift });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    if(req.body.status){
      let shift = await Shift.findOne({_id : req.params.shiftId});
      var getUser = await User.findOne({_id : shift.assignedUser})
      console.log('aaa',getUser,shift)
      let status = req.body.status;
      if(status === 'Reassign' || status === 'Approved'){
        if(req.body.assignedUser){
          const shiftUpdate = await Shift.updateOne({_id : req.params.shiftId}, req.body, async function(err, data){
            // console
            if(err){
              next(err)
            }
            else{
              let userShift = await UserShift.updateOne({casualShiftId : req.params.shiftId},{$set:{assignedUser : req.body.assignedUser,shiftDate:shift.startDate,status:"In Process"}})
              // let shiftUpdate = await Shift.findOne({_id : req.params.shiftId});
              emailProvider.resendShiftStatus(getUser.email, req.body.status);
              sentPushNotification('Casual Shift',`Casual shift has been ${status}`,getUser.deviceToken);
              res.status(201).send({code : 201, message : 'Casual shift status updated successfully.'});
            }
          });
        }
        else{
          res.status(500).send({code : 500, message : 'Assigned User is required', data : {}});
        }
      }
      else if(status === 'Cancel'){
        const shiftUpdate = await Shift.updateOne({_id : req.params.shiftId}, req.body, async function(err, data){
          if(err){
            next(err)
          }
          else{
            emailProvider.resendShiftStatus(getUser.email, req.body.status);
            sentPushNotification('Casual Shift',`Casual shift has been ${status}`,getUser.deviceToken);
            res.status(201).send({code : 201, message : 'Casual shift status updated successfully.'});
          }
        });
      }
      else if(status === 'Assigned'){
        req.body.status = "In Process";
        console.log('stat',req.body)
        const shiftUpdate = await Shift.updateOne({_id : req.params.shiftId}, req.body, async function(err, data){
          console.log('aa',data)
          if(err){
            next(err)
          }
          else{
            emailProvider.resendShiftStatus(getUser.email, req.body.status);
            sentPushNotification('Casual Shift',`Casual shift has been assigned`,getUser.deviceToken);
            res.status(201).send({code : 201, message : 'Casual shift status updated successfully.'});
          }
        });
      }
      else{
        const shiftUpdate = await Shift.updateOne({_id : req.params.shiftId}, req.body, async function(err, data){
          if(err){
            next(err)
          }
          else{
            emailProvider.resendShiftStatus(getUser.email, req.body.status);
            let userShift = await UserShift.findOne({casualShiftId : req.params.shiftId},{assignedUser : null})
            let shiftUpdate = await Shift.findOne({_id : req.params.shiftId},{assignedUser : null});
            sentPushNotification('Casual Shift',`Casual shift has been ${status}`,getUser.deviceToken);
            res.status(201).send({code : 201, message : 'Casual shift status updated successfully.'});
          }
        });
      }
    }
    else{
      res.status(400).send({code : 400, message : 'Status is required', data : {}});
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteShift = async (req, res, next) => {
  try {
    const deleteShift = await Shift.deleteOne({_id : req.params.shiftId});
    const deleteDuty = await Duty.deleteOne({shiftId : req.params.shiftId});
    const deleteUserSHift = await UserShift({casualShiftId : req.params.shiftId})
    res.status(httpStatus.CREATED);
    res.status(201).send({ code: 201, message: 'Casual Shift deleted successfully.', data: {} });
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { shift } = req.locals;
    const newShift = new Shift(req.body);
    const newShiftObject = omit(newShift.toObject(), '_id');

    await shift.updateOne(newShiftObject, { override: true, upsert: true });
    const savedShift = await shift.findById(shift._id);

    res.json({ code: 200, message: 'Shift updated successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error);
  }
};

exports.update = (req, res, next) => {
  const updatedShift = omit(req.body);
  const shift = Object.assign(req.locals.shift, updatedShift);

  shift.save()
    .then((data) => res.json({ code: 200, message: 'Shift updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
};

exports.view = (req, res, next) => {
  const id = req.locals.shift;
  Shift.findOne({ _id: id }, function (err, shift) {
    if (err) {
      res.send(500, { code: 500, message: 'Internal server error.', errors: err });
    }

    if (shift) {
      res.send(200, { code: 200, message: 'Shift updated successfully.', data: shift });
    }

    res.send(404, { code: 404, message: 'Shift updated successfully.', data: [] });
  })
};

exports.list = async (req, res, next) => {
  try {
    req.body.endDate = new Date();
    const shifts = await Shift.list(req.query);
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: shifts });
  } catch (error) {
    next(error);
  }
};


exports.listReport = async (req, res, next) => {
  try {
    // const  {startDate, endDate, siteId, status, page = 1, perPage = 25} =req.body;
    // req.query.endDate = endDate ? endDate : new Date();

    console.log('I am here ')
    const shifts = await Shift.list(req.query);
    // req.query.assignedUser = {$ne : null}

    // const shifts = await Shift.find(req.query)
    //                .populate([
    //                 {
    //                   path : 'companyId',
    //                   model : 'Company',
    //                   select: "name"
    //                 },
    //                 {
    //                   path : 'siteId',
    //                   model : 'Site',
    //                   select: "name",
    //                   populate :[ 
    //                     {
    //                       path : 'companyId',
    //                       select: "name"
    //                     },
    //                     {
    //                       path : 'city',
    //                       select: "name"
    //                     },
    //                     {
    //                       path : 'country',
    //                       select: "name"
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   path : 'shiftType',
    //                   model : 'ShiftType',
    //                   select: "name"
    //                 },
    //                 {
    //                   path : 'reportAt',
    //                   model : 'Site'
    //                 },
    //                 {
    //                   path : 'licenseType',
    //                   model : 'LicenseType'
    //                 },
    //                 {
    //                   path : 'assignedUser',
    //                   model : 'User',
    //                   select: "firstname lastname"
    //                 },
    //                 {
    //                   path : 'createdBy',
    //                   model : 'User',
    //                   select: "firstname lastname"
    //                 },
    //                ])
    //                 .sort({ shiftDate: -1 })
    //                 .skip(perPage * (page - 1))
    //                 .limit(perPage)
    //                 .exec();
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: shifts });
  } catch (error) {
    next(error);
  }
};

exports.listGroup = async (req, res, next) => {
  try {
    const {page = 1, perPage = 25, status, startDate,endDate, startTime,endTime} = req.query;
    const options = omitBy({ isGroup : true, groupId : req.params.groupId, status, startDate, endDate, startTime, endTime}, isNil);

    const shifts = await Shift.find(options)
                   .populate([
                    {
                      path : 'companyId',
                      model : 'Company',
                      select: "name"
                    },
                    {
                      path : 'siteId',
                      model : 'Site',
                      select: "name",
                      populate :[ 
                        {
                          path : 'companyId',
                          select: "name"
                        },
                        {
                          path : 'city',
                          select: "name"
                        },
                        {
                          path : 'country',
                          select: "name"
                        }
                      ]
                    },
                    
                    {
                      path : 'shiftType',
                      model : 'ShiftType',
                      select: "name"
                    },
                    {
                      path : 'reportAt',
                      model : 'Site'
                    },
                    {
                      path : 'licenseType',
                      model : 'LicenseType'
                    },
                    {
                      path : 'assignedUser',
                      model : 'User',
                      select: "firstname lastname"
                    },
                    {
                      path : 'createdBy',
                      model : 'User',
                      select: "firstname lastname"
                    },
                  ])
                  .skip(perPage * (page - 1))
                  .limit(perPage)
                  .exec();
                  
    // const transformedShifts = shifts.map((status) => status.transform());
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: shifts });
  } catch (error) {
    next(error);
  }
};

exports.listUser = async (req, res, next) => {
  try {
    const {page = 1, perPage = 30} = req.query;
    console.log('User info', req.user._id)
    var available = [];
    await Availability.find({ user: req.user._id }, function(err, availabilities){
      for(var i = 0; i< availabilities.length; i++){
        if(availabilities[i].availability === true){
          available.push(availabilities[i].day)
        }
      }
    })
    console.log('aaa',available)

      const options = omitBy({ status : 'Approved'}, isNil);
      const userId = req.user._id;
      let output = await Shift.aggregate([
        {
          $skip : perPage * (page - 1)
        },
        {
          $limit : perPage
        },
        {
          $sort : {
            'createdAt' : 1
          }
        },
        {
          $match : 
          {
            $or: [
              { assignedUser: { $exists:false } },
              { assignedUser:mongoose.Types.ObjectId(req.user._id) }
            ]
          }
          // {assignedUser : [mongoose.Types.ObjectId(req.user._id)]}
        },
        {
          $group : {
            "_id" : {
              isGroup : "$isGroup",
              groupId : "$groupId",
            },
            shifts : {
              $push : "$$ROOT"
            }
          }
        },
      ]).exec()

 
  
       let populateQuery =  [
          {
            path : 'shifts.companyId',
            model : 'Company',
            select: "name"
          },
          {
            path : 'shifts.siteId',
            model : 'Site',
            select: "name",
            populate :[ 
              {
                path : 'companyId',
                select: "name"
              },
              {
                path : 'city',
                select: "name"
              },
              {
                path : 'country',
                select: "name"
              }
            ]
          },
          {
            path : 'shifts.shiftType',
            model : 'ShiftType',
            select: "name"
          },
          {
            path : 'shifts.reportAt',
            model : 'Site'
          },
          {
            path : 'shifts.licenseType',
            model : 'LicenseType'
          },
          {
            path : 'shifts.assignedUser',
            model : 'User',
            select: "firstname lastname"
          },
          {
            path : 'shifts.createdBy',
            model : 'User',
            select: "firstname lastname"
          },
        ];
  
      let shifts = await  Shift.populate(output,populateQuery);


    // const shifts = await Shift.find({assignedUser : null, status : 'Approved' })
    //   .populate([
    //     {
    //       path: 'siteId',
    //       model: 'Site',
    //       select: 'name city _id',
    //       populate: [
    //         {
    //           path: 'city'
    //         },
    //       ]
    //     },
    //   ])
    //   .sort({ createdAt: 1 })
    //   // .skip(perPage * (page - 1))
    //   // .limit(perPage)
    //   .exec();
      console.log('SHIFTS', shifts[0]?.shifts)
    // const transformedShifts = shifts.map((status) => status.transform());
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var data = [];
    if(shifts.length > 0){
      shifts.forEach((item) => {
        // console.log('in shifts',items)
        let startDate = new Date(item.shifts[0].startDate);
        let endDate = new Date(item.shifts[0].endDate);
        var checked = false
        for(loopDate = startDate; loopDate < endDate; loopDate += 1)
        {
          console.log('Loop date', loopDate)
          console.log('Available ----', available)
          
           let newDay = days[loopDate.getDay()];
           console.log('New Day ----', newDay)
           if(available.includes(newDay)){
             checked = true;
           }
           if(checked){
             data.push(item.shifts[0]);
           }
        }
      })
    }
    
    


    // console.log('START',(page == 1) ? 0 : (((page -1) * perPage) -1 ))
    // console.log('END', (page * perPage) > (data.length + 1) ? ((page * perPage) -1 ) : data.length -1)
    // var newData = data.slice((page == 1) ? 0 : (((page -1) * perPage) -1 ), (page * perPage) > (data.length + 1) ? ((page * perPage) -1 ) : data.length -1);

    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: data });
  } catch (error) {
    next(error);
  }
};

exports.getUserLength = async (userId) => {
  try {
    // const {page = 1, perPage = 30} = req.query;
    // console.log('User info', req.user._id)
    var available = [];
    await Availability.find({ user: userId }, function(err, availabilities){
      for(var i = 0; i< availabilities.length; i++){
        if(availabilities[i].availability === true){
          available.push(availabilities[i].day)
        }
      }
    })
    console.log('aaa',available)

      const options = omitBy({ status : 'Approved'}, isNil);
      // const userId = req.user._id;
      let output = await Shift.aggregate([
        {
          $sort : {
            'createdAt' : 1
          }
        },
        {
          $match : 
          {
            $or: [
              { assignedUser: { $exists:false } },
              { assignedUser: userId }
            ]
          }
        },
        {
          $group : {
            "_id" : {
              isGroup : "$isGroup",
              groupId : "$groupId",
            },
            shifts : {
              $push : "$$ROOT"
            }
          }
        },
      ]).exec()

 
  
       let populateQuery =  [
          {
            path : 'shifts.companyId',
            model : 'Company',
            select: "name"
          },
          {
            path : 'shifts.siteId',
            model : 'Site',
            select: "name",
            populate :[ 
              {
                path : 'companyId',
                select: "name"
              },
              {
                path : 'city',
                select: "name"
              },
              {
                path : 'country',
                select: "name"
              }
            ]
          },
          {
            path : 'shifts.shiftType',
            model : 'ShiftType',
            select: "name"
          },
          {
            path : 'shifts.reportAt',
            model : 'Site'
          },
          {
            path : 'shifts.licenseType',
            model : 'LicenseType'
          },
          {
            path : 'shifts.assignedUser',
            model : 'User',
            select: "firstname lastname"
          },
          {
            path : 'shifts.createdBy',
            model : 'User',
            select: "firstname lastname"
          },
        ];
  
      let shifts = await  Shift.populate(output,populateQuery);


    // const shifts = await Shift.find({assignedUser : null, status : 'Approved' })
    //   .populate([
    //     {
    //       path: 'siteId',
    //       model: 'Site',
    //       select: 'name city _id',
    //       populate: [
    //         {
    //           path: 'city'
    //         },
    //       ]
    //     },
    //   ])
    //   .sort({ createdAt: 1 })
    //   // .skip(perPage * (page - 1))
    //   // .limit(perPage)
    //   .exec();
      console.log('SHIFTS', shifts[0]?.shifts)
    // const transformedShifts = shifts.map((status) => status.transform());
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var data = [];
    if(shifts.length > 0){
      shifts.forEach((item) => {
        // console.log('in shifts',items)
        let startDate = new Date(item.shifts[0].startDate);
        let endDate = new Date(item.shifts[0].endDate);
        var checked = false
        for(loopDate = startDate; loopDate < endDate; loopDate += 1)
        {
          console.log('Loop date', loopDate)
          console.log('Available ----', available)
          
           let newDay = days[loopDate.getDay()];
           console.log('New Day ----', newDay)
           if(available.includes(newDay)){
             checked = true;
           }
           if(checked){
             data.push(item.shifts[0]);
           }
        }
      })
    }
    
    


    // console.log('START',(page == 1) ? 0 : (((page -1) * perPage) -1 ))
    // console.log('END', (page * perPage) > (data.length + 1) ? ((page * perPage) -1 ) : data.length -1)
    // var newData = data.slice((page == 1) ? 0 : (((page -1) * perPage) -1 ), (page * perPage) > (data.length + 1) ? ((page * perPage) -1 ) : data.length -1);
    return data.length
    // res.json({ code: 200, message: 'Shift list retrieved successfully.', data: data });
  } catch (error) {
    next(error);
  }
};

exports.generateShiftCode = async (email) => {
  let digits = "0123456789";
  let randNum = "";
  for (let i = 0; i < 6; i++) {
    randNum += digits[Math.floor(Math.random() * 10)];
  }
  return randNum
}

exports.resendShiftCode = async (req, res, next) => {
  try {
    const data = await Shift.findOne({ _id: req.locals.shift })
    emailProvider.resendShiftCode(req.user, data.shiftCode);
    return res.send(201, { code: 201, status: true, message: 'Shift Code Emailed Successfully.' });
  } catch (error) {
    next(error)
  }
}

exports.updateIntrest = async (req, res, next) => {
  try {
    if(!req.locals.shift.assignedUser){
      req.locals.shift.assignedUser=req.user._id;
      req.locals.shift.status="Unassigned"
    }
    const update = req.locals.shift.intrestedUsers.push(req.user._id)
    const saveShift = await req.locals.shift.save()
    return res.send(201, { code: 201, status: true, message: 'Interest Updated Successfully.' });
  } catch (error) {
    next(error)
  }
}

exports.releaseShift = async (req, res, next) => {
  try {
    // console.log('in shift', req.body)
    const shift = await Shift.get(req.body.shiftId);
    // const userDetails = await User.findById(req.body.userId)
    const ind = shift.intrestedUsers.indexOf(req.user._id)
    if (ind < 0) {
      return res.send(400, { code: 400, status: true, message: 'User newer applied.' });
    }
    let charge = await chargeCreditCard(req.user.stripeId, 500)
    if (!charge) {
      return res.send(403, { code: 403, status: false, message: 'Failed to charge your card, please check you payment method first.' });
    }
    let report = Receipt.generateReport({ 'email': userDetails.email, userId: req.body.userId, amount: 5 })
    shift.intrestedUsers.splice(ind, 1);
    if (shift.status == 'Assigned' && shift.assignedUser == req.user._id) {
      shift.status = 'Unassigned'
    }
    const saveShift = await shift.save()
    return res.send(200, { code: 200, status: true, message: 'Shift Released Successfully.' });

  } catch (error) {
    next(error)
  }
}

exports.cancelIntrest = async (req, res, next) => {
  try {
    let user = req.user;
    await Setting.updateOne({ user: req.user._id }, { 'casualShiftsSubscription': false });
    await Shift.deleteMany({userId : req.user._id});
    await UserShift.deleteMany({userId : req.user._id});
    await Card.deleteMany({ user: req.user._id });
    emailProvider.cancelSubscription(user);
    return res.send(201, { code: 201, status: true, message: 'Subscription Cancelled Successfully.' });

  } catch (error) {
    next(error)
  }
}

chargeCreditCard = async (custId, amount) => {
  const charge = await stripe.charges.create({
    amount: amount,
    currency: 'usd',
    customer: custId
    // source: 'tok_amex',
  });
  console.log('card charge object', charge)
  if (charge.status == 'succeeded') {
    return true
  } else {
    return false
  }
}

exports.accpetInterest = async (req, res, next) => {
  try {
    const shift = await Shift.get(req.body.shiftId);
    if (shift.status == 'Assigned') {
      return res.send(400, { code: 400, status: false, message: 'Shift already assigned.' });
    }
    const userDetails = await User.findById(req.body.userId)
    let charge = await chargeCreditCard(userDetails.stripeId, 250)
    if (!charge) {
      return res.send(403, { code: 403, status: false, message: 'Please add your incoming & outgoing payment card first, then try again' });
    }
    let report = await Receipt.generateReport({ 'email': userDetails.email, userId: req.body.userId, amount: 2.5 })
    shift.assignedUser = req.body.userId;
    shift.status = 'Assigned';
    const saveShift = await shift.save()
    let data = {}
    data.casualShiftId = saveShift._id;
    data.userId = req.body.userId;
    data.siteId = shift.siteId;
    data.shiftDate = shift.startDate;
    data.startDate = shift.startDate;
    data.endDate = shift.endDate;
    await controller.addUserShift(data);
    return res.send(201, { code: 201, status: true, message: 'Shift Accepted Successfully.' });
  } catch (error) {
    next(error)
  }
}

exports.reAssignInterest = async (req, res, next) => {
  try {
    const shift = await Shift.findOne({ _id : req.params.shiftId });
    const userDetails = await User.findById(req.body.userId)
    let charge = await chargeCreditCard(userDetails.stripeId, 250)
    if (!charge) {
      return res.send(403, { code: 403, status: false, message: 'Please add your incoming & outgoing payment card first, then try again.' });
    }
    var assignedUser = req.body.userId;
    const saveShift = await Shift.updateOne({_id : req.params.shiftId}, {assignedUser : assignedUser, status : 'Assigned'} , async function(err, newShift){
      if(err){
        next(err)
      }
      if(newShift === null){
        return res.send(500, { code: 500, status: false, message: 'Shift re-assigned failure.' });
      }
      else{
         UserShift.deleteOne({casualShiftId : req.params.shiftId})
        let data = {}
        data.casualShiftId = req.params.shiftId;
        data.userId = req.body.userId;
        data.siteId = shift.siteId;
        data.shiftDate = shift.startDate;
        data.startDate = shift.startDate;
        data.endDate = shift.endDate;
        let info = await controller.addUserShift(data);
        if(info)
        {
          return res.send(201, { code: 201, status: true, message: 'Shift re-assigned Successfully.' });
        }
        else{
          return res.send(500, { code: 500, status: false, message: 'Shift re-assigned failure.' });
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.addBreak = async (req, res, next) => {
  try {
    let addBreak = new Breaks(req.body);
    let saveData = await addBreak.save()
    const id = req.locals.shift;
    const updateShift = await Shift.updateOne({ _id: id }, { $push: { 'breaks': saveData._id } })
    const savedShift = await Shift.findById(id);
    res.send(200, { code: 200, message: 'Break added successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error)
  }
}


exports.remove = (req, res, next) => {
  const { shift } = req.locals;

  shift.remove()
    .then(() => res.json(200, { code: 200, message: 'Shift delete successfully.' }))
    .catch((e) => next(e));
};


exports.casualShiftList = async (req, res, next) => {
  try {
  
    const {startDate, endDate} = req.query
    var shiftList = null;
    if(startDate && endDate)
    {
      shiftList = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate} })
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers createdBy')
                      .sort({ createdAt: -1 });
    }
    else if(startDate)
    {
      shiftList = await Shift.find({startDate : {$gte : startDate}})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers createdBy')
                      .sort({ createdAt: -1 });
    }
    else if(endDate)
    {
      shiftList = await Shift.find({endDate : {$lte : endDate}})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers createdBy')
                      .sort({ createdAt: -1 });
    }
    else{
      shiftList = await Shift.find({})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers createdBy')
                      .sort({ createdAt: -1 });
    }

    const result = shiftList.map((data) => {
      var startTime = moment(data.startTime, 'HH:mm a');
      var endTime = moment(data.endTime, 'HH:mm a');
      if (startTime > endTime){
        endTime = moment(endTime).add(1, "days")
      }
      
      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));
      // duration in hours
      var hours = parseInt(duration.asHours());
      // duration in minutes
      var minutes = parseInt(duration.asMinutes()) % 60;
      let tempData = { ...data._doc }
      tempData.totalHours = hours + ' hour and ' + minutes + ' minutes.'
      return tempData;
    })
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  } catch (error) {
    next(error);
  }
};

exports.exportCasualShift = async (req , res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const shiftList = await Shift.find({})
    const result = shiftList.map((data) => {
      var startTime = moment(data.startTime, 'HH:mm a');
      var endTime = moment(data.endTime, 'HH:mm a');
      if (startTime > endTime) endTime = moment(endTime).add(1, "days")
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) % 60;
      let tempData = { ...data._doc }
      tempData.totalHours = hours + ' hour and ' + minutes + ' minutes.'
      return tempData;
    })
    worksheet.columns = [
      { header: 'User Id', key: 'userId', width: 25 },
      { header: 'Site Id', key: 'siteId', width: 25 },
      { header: 'Status', key: 'status', width: 25 },
      { header: 'shiftType', key: 'shiftType', width: 25 },
      { header: 'Price', key: 'price', width: 25 },
      { header: 'Start Date', key: 'startDate', width: 25 },
      { header: 'End Date', key: 'endDate', width: 25 },
      { header: 'Start Time', key: 'startTime', width: 25 },
      { header: 'End Time', key: 'endTime', width: 25 },
      { header: 'Total hours', key: 'totalHours', width: 25 },
      { header: 'Shift Recurrence', key: 'shiftRecurrence', width: 25 },
      { header: 'Shift Code', key: 'shiftCode', width: 25 },
      { header: 'Wo Number', key: 'woNumber', width: 25 },
      { header: 'Allowed Breaks', key: 'allowedBreaks', width: 25 },
      { header: 'Report At', key: 'reportAt', width: 25 },
      { header: 'Parking Required', key: 'parkingRequired', width: 25 },
      { header: 'Intrested Users', key: 'intrestedUsers', width: 25 },
      { header: 'Assigned User', key: 'assignedUser', width: 25 },
    ];
    result.forEach((data) => worksheet.addRow(data));
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=casualShift.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));
    // res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  } catch (error) {
    next(error);
  }
}
