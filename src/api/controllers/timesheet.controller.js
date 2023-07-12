const httpStatus = require('http-status');
const { omit } = require('lodash');
const Timesheet = require('../models/timesheet.model');
const TimesheetStatus = require('../models/timesheet.status.model');
const ClockData = require('../models/clock.data.model');
const casualShiftModel = require('../models/casual.shift.model');
const userShiftModel = require('../models/shift.model');
const rosterModel = require('../models/site.roster.model');
const Site = require('../models/site.model');
const Company = require('../models/company.model');
const Clients = require('../models/company.user.model');
const TimesheetGenerator = require('./user/userCv.controller');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const {correctStrToTime, formatRawDate} = require('../utils/helper')


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const timesheet = await Timesheet.get(id);
    req.locals = { timesheet };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: req.locals.status.transform() });

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
// exports.create = async (req, res, next) => {
//   // try {
//     req.body.statusId = await TimesheetStatus.findOne({ 'name': "Submitted" })._id
//     req.body.userId = req.user._id
//     req.body.startDate = new Date(req.body.startTime)
//     req.body.endDate = new Date(req.body.endTime)
//     var totalMillisecond = 0;
//     var shiftIds = [];
//     var siteIds = [];
//     var clocks = [];
//     var timeCardIds = [];
//     console.log(req.body.siteId)
//     let getShifts = await userShiftModel.find({
//                           // shiftDate : {$gte : req.body.startDate, $lte : req.body.endDate , $ne : null},
//                           shiftDate : {$gte : new Date(req.body.startTime)},
//                           shiftDate : {$lte : new Date(req.body.endTime)},
//                           shiftDate : {$ne : null},
//                           siteId : req.body.siteId
//                         }).populate('casualShiftId');

//     console.log('ALL SITE DATA', getShifts)
//     for(var i = 0 ; i < getShifts.length; i++){
//       if(getShifts[i].casualShiftId){
//         if(getShifts[i].casualShiftId.assignedUser === req.user._id){
//           shiftIds.push(getShifts[i]._id);
//           siteIds.push(getShifts[i].siteId)
//           console.log('Shift ID ARRAY',getShifts[i]._id)
//           console.log('SITE ID ARRAY',getShifts[i].siteId)
//         }
//       } 
//     }

 
//     let output = await ClockData.aggregate([
//       {
//         $sort : {
//           'createdAt' : -1
//         }
//       },
//       {
//         $match: { 
//           _id : {$ne : shiftIds}
//           // $and: [ 
//           //     // { createdAt : {$gte : req.body.startDate} },  
//           //     // { createdAt : {$lte : req.body.endDate}},
//           //     {shiftId : {$in : shiftIds}},
//           //     {siteId : req.body.siteId }
//           //   ]
//           }
//       },
//       {
//         $group : {
//           // "_id" : {
//           //   createdAt : "$createdAt",
//           // },
//           "_id" : {
//             year: "$createdAt.year",
//             month: "$createdAt.month",
//             day: "$createdAt.day",
//           },
//           clocks : {
//             $push : "$$ROOT"
//           }
//         }
//       },
//     ]).exec();

//     let populateQuery = [
//       {
//         path : 'SiteId',
//         model : 'Site'
//       },
//       {
//         path : 'userId',
//         model : 'User'
//       },
//       {
//         path : 'shiftId',
//         model : 'Shift'
//       },
//     ];
    

//     let allClock = await ClockData.populate(output,populateQuery);
//     // console.log('ALL Clock Query', allClock[0].clocks)

//     for(var k = 0 ; k < allClock.length;  k++){
//       let clockI = allClock[k];
//       if(clockI.clocks.length > 0){
//         let myShift = await userShiftModel.findOne({_id : clockI.clocks[0].shiftId});
//         // console.log('Clock Loop')
//         var obj = {
//           break : 0,
//           startDateTime : null,
//           endDateTime : null,
//           actualStartDateTime : `${formatRawDate(myShift.shiftDate)} ${correctStrToTime(myShift.startTime)}`,
//           actualEndDateTime : `${formatRawDate(myShift.shiftDate)} ${correctStrToTime(myShift.endTime)}`,
//           totalTime : 0
//         }
//        for(z = 0; z < clockI.clocks.length; z++){
        
//         timeCardIds.push(clockI.clocks[z]._id)
//         if(clockI.clocks[z].type === 'clockin'){
//           // console.log('Group CLock IN')
//           obj['startDateTime'] = clockI.clocks[z].createdAt;
//         }
//         if(clockI.clocks[z].type === 'clockout'){
//           // console.log('Group CLock OUT')
//           obj['endDateTime'] = clockI.clocks[z].createdAt;
//         }
//        }
//        var startDate = obj.startDateTime !== null ? new Date(obj.startDateTime) : null;
//        var endDate = obj.endDateTime !== null ? new Date(obj.endDateTime) : null;

//       //  console.log('START DATE',startDate)
//       //  console.log('end DATE',endDate)
//        if(startDate !== null && endDate !== null){
//         // console.log('Start END -------')
//         // console.log('TIME',Math.abs(endDate - startDate));
//         obj['totalTime'] = Math.abs(endDate - startDate);
//         totalMillisecond = totalMillisecond + obj['totalTime'];
//         console.log('One TOtal Millisecond',totalMillisecond)
//        }
//       //  clocks.push(obj);
//       //  console.log('CLOCK -----', obj)
//       }
//     }

//     let data = {
//       startDate : req.body.startDate,
//       endDate : req.body.endDate,
//       siteId : req.body.siteId,
//       userId : req.user._id,
//       clientId : req.body.clientId,
//       note : req.body.note ?? null,
//       totalHours : totalMillisecond,
//       client : req.body.client,
//       employer : req.user.login_as,
//       clock : clocks
//     }

//     // console.log('DATA  OBJECT -------',data)

//     const timesheet = new Timesheet(data);
//     const savedTimesheet = await timesheet.save();
//     await ClockData.updateMany({ _id: { $in: timeCardIds } },{"status":"Submitted"})

//     // let timeCardIds = req.body.timeCardIds
//     // await ClockData.updateMany({ _id: { $in: timeCardIds } },{"status":"Submitted"})
//     // const timesheet = new Timesheet(req.body);
//     // const savedTimesheet = await timesheet.save();
//     // res.send(201,{ code: 201, message: 'Timesheet created successfully.', data: {} });
//     res.send(201,{ code: 201, message: 'Timesheet created successfully.', data: savedTimesheet.transform() });
//   // } catch (error) {
//   //   next(error);
//   // }
// };


exports.create = async (req, res, next) => {
  try {

    req.body.statusId = await TimesheetStatus.findOne({ 'name': "Submitted" })._id
    req.body.userId = req.user._id
    req.body.startTime = new Date(req.body.startTime)
    req.body.endTime = new Date(req.body.endTime)
    console.log(req.body)
    let timeCardIds = req.body.timeCardIds
    await ClockData.updateMany({ _id: { $in: timeCardIds } },{"status":"Submitted"})
    const timesheet = new Timesheet(req.body);
    const savedTimesheet = await timesheet.save();
    res.status(httpStatus.CREATED);
    res.json({ code: 201, message: 'Timesheet created successfully.', data: savedTimesheet.transform() });
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
    const { timesheet } = req.locals;
    const newTimesheet = new Timesheet(req.body);
    const newTimesheetObject = omit(newTimesheet.toObject(), '_id');

    await timesheet.updateOne(newTimesheetObject, { override: true, upsert: true });
    const savedTimesheet = await Timesheet.findById(timesheet._id);

    res.json({ code: 200, message: 'Timesheet updated successfully.', data: savedTimesheet.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedTimesheet = omit(req.body);
  const timesheet = Object.assign(req.locals.timesheet, updatedTimesheet);

  timesheet.save()
    .then((savedTimesheet) => res.json({ code: 200, message: 'Timesheet updated successfully.', data: savedTimesheet.transform() }))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  console.log('Timesheet In')
  try {
    const timesheets = await Timesheet.list(req.query);
    const transformedTimesheets = timesheets.map((status) => status.transform());
    res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: transformedTimesheets });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { timesheet } = req.locals;

  timesheet.remove()
  .then(() => res.json({code : 200, message : 'Timesheet delete successfully.', data : {}}))
    .catch((e) => next(e));
};
exports.downloadTimesheet = async (req, res, next) => {
  try {
    TimesheetGenerator.getTimesheetData(req, res, next);
  } catch (error) {
    next(error)
  }
}

exports.getTimeSheet = async (req, res, next) => {
  let startTime = req.body.startTime
  let endTime = req.body.endTime
  let employer = req.body.employer
  let siteId = req.body.siteId
  let client = req.body.client
  let status = req.body.status

  let st = new Date(startTime).setHours(0,0,0,0)
  let ed = new Date(endTime).setHours(0,0,0,0)
  let getData = await Timesheet.find({ 'userId': req.user._id, startTime, endTime, siteId, statusId: status })

  if (getData.length > 0) {
    return res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: getData[0] });
  } else if (req.body.status == '62e814c2049bd2e0a191399f') {
    // let shiftIds = await casualShiftModel.find({siteId,assignedUser:req.user._id})
    let shiftIds = await userShiftModel.find({ siteId, assignedUser: req.user._id })
    // let rShiftIds = await rosterModel.find({siteId,assignedUser:req.user._id})
    console.log('aaa',shiftIds)
    let clockData = await ClockData.find({ createdAt: { $gte: startTime, $lte: endTime }, status: "Open", shiftId: { $in: shiftIds } })
    let clock = []
    let clockObj = { 'break': 0, "start":"",finish:"", timeCardIds: [] }
    // let total=0
    let timeCardIds = []
    console.log('aa11a1',clockData)

    for (let i = 0; i < clockData.length; i++) {
      // clockObj.timeCardIds.push(clockData[i]._id)
      timeCardIds.push(clockData[i]._id)
      if (clockData[i]['type'] == 'clockin') {
        clockObj.start = clockData[i]['createdAt']
      }
      else if (clockData[i]['type'] == 'break') {
        clockObj.break = clockData[i]['breakDuration']
      }
      if (clockData[i]['type'] == 'clockout') {
        clockObj.finish = clockData[i]['createdAt']
        clockObj.total = ((new Date(clockObj.finish) - new Date(clockObj.start)) / 60000) + (clockObj.break || 0)
        clock.push({ ...clockObj })
        clockObj = { 'break': 0, timeCardIds:[] }
      }
      // let timeSheet={}
    }
    // clock.push({ timeCardIds })
    // clock.splice(0,0,{timeCardIds})
    // const timesheet = new Timesheet({startTime,endTime,userId:req.user._id,statusId:status,siteId,clock});
    // const savedTimesheet = await timesheet.save();
    return res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: { startTime, endTime, siteId, timeCardIds, clock } });
  } else {
    return res.json({ code: 404, message: ' Timesheet Not Found.', data: {} });

  }
}

exports.getUserSites = async (req, res, next) => {
  try {
    let siteData = await Site.find({}, { _id: 1, name: 1 });
    if (siteData) {
      return res.json({ code: 200, message: 'Sheet list retrieved successfully.', data: siteData });
    } else {
      return res.json({ code: 401, message: 'No sites found.', data: [] });
    }
  } catch (error) {
    next(error)
  }
}
exports.getClients = async (req, res, next) => {
  try {
    let siteData = await Clients.find({}, { _id: 1, name: 1 });
    if (siteData) {
      return res.json({ code: 200, message: 'Clients list retrieved successfully.', data: siteData });
    } else {
      return res.json({ code: 401, message: 'No sites found.', data: [] });
    }
  } catch (error) {
    next(error)
  }
}
exports.getEmployer = async (req, res, next) => {
  try {
    let siteData = await Company.find({}, { _id: 1, name: 1 });
    if (siteData) {
      return res.json({ code: 200, message: 'Employer list retrieved successfully.', data: siteData });
    } else {
      return res.json({ code: 401, message: 'No sites found.', data: [] });
    }
  } catch (error) {
    next(error)
  }
}