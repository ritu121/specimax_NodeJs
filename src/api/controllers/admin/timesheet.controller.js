const httpStatus = require('http-status');
const { omit } = require('lodash');
const Timesheet = require('../../models/timesheet.model');
const exceljs = require('exceljs');
const TimesheetStatus = require('../../models/timesheet.status.model');
const ClockData = require('../../models/clock.data.model');
const casualShiftModel = require('../../models/casual.shift.model');
const userShiftModel = require('../../models/shift.model');
const rosterModel = require('../../models/site.roster.model');
const Site = require('../../models/site.model');
const Company = require('../../models/company.model');
const Clients = require('../../models/company.user.model');
const TimesheetGenerator = require('../user/userCv.controller')
const { omitBy, isNil } = require('lodash');


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
exports.get = (req, res) => res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: req.locals.timesheet.transform() });

/**
 * Get logged in user info
 * @public
 */



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
//   const updatedTimesheet = omit(req.body);
//   const timesheet = Object.assign(req.locals.timesheet, updatedTimesheet);
    req.locals.timesheet.approvedNotes = req.body.approverNotes;
    req.locals.timesheet.statusId = req.body.status;

    req.locals.timesheet.save()
    .then((savedTimesheet) => res.json({ code: 200, message: 'Timesheet updated successfully.', data: savedTimesheet.transform() }))
    .catch((e) => next(e));
};

exports.updateStatus = async(req, res, next) => {
  try{
    let timesheetId = req.params.timesheetId;
    if(req.body.statusId){
      req.body.actionBy = req.user._id;
       let updateTimeSheet = await Timesheet.updateOne({_id : timesheetId}, {statusId : req.body.statusId}, async function(err , sheet){
         if(err){
          next(err);
         }
         else{
           let getSheet = await Timesheet.findOne({_id : timesheetId});
           let status = await TimesheetStatus.findOne({_id : req.body.statusId})
           res.status(201).send({code : 201, message : `TimeSheet ${status.name} successfully.`, data : getSheet});
         }
       })
    }
    else{
      res.status(400).send({code : 400, message : 'Status ID required!.', data : {}});
    }
  }
  catch(errors){
    console.log(errors)
    next(errors)
  }
}

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    var timesheets = [];
    const {page = 1, perPage = 25, startDate, endDate, siteId,clientId, userId, statusId, createdAt} = req.query;
    
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      let options = omitBy({ startDate, endDate, siteId : {$in : req.user.sites}, userId, clientId, statusId, createdAt }, isNil);
      timesheets = await  Timesheet.find(options)
      .populate([
        {
          path: 'userId',
          model: 'User',
          select: 'firstname lastname'
        },
        {
          path: 'siteId',
          model: 'Site',
          select: 'name'
        },
        {
          path: 'clientId',
          model: 'User',
          select: 'firstname lastname'
        },
        {
          path: 'statusId',
          model: 'TimesheetStatus',
          select: 'name'
        },
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    else{
      let options = omitBy({ startDate, endDate, siteId, userId,clientId, statusId, createdAt }, isNil);
      timesheets = await  Timesheet.find(options)
      .populate([
        {
          path: 'userId',
          model: 'User',
          select: 'firstname lastname'
        },
        {
          path: 'siteId',
          model: 'Site',
          select: 'name'
        },
        {
          path: 'clientId',
          model: 'User',
          select: 'firstname lastname'
        },
        {
          path: 'statusId',
          model: 'TimesheetStatus',
          select: 'name'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    // const timesheets = await Timesheet.list(req.query);
    // const transformedTimesheets = timesheets.map((status) => status.transform());
    res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: timesheets, count :  timesheets.length});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */

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
  let getData = await Timesheet.find({ 'userId': req.user._id, startTime, endTime, siteId, statusId: status })
  if (getData.length > 0) {
    return res.json({ code: 200, message: 'Timesheet list retrieved successfully.', data: getData[0] });
  } else if (req.body.status == '62e814c2049bd2e0a191399f') {
    // let shiftIds = await casualShiftModel.find({siteId,assignedUser:req.user._id})
    let shiftIds = await userShiftModel.find({ siteId, userId: req.user._id })
    // let rShiftIds = await rosterModel.find({siteId,assignedUser:req.user._id})
    let clockData = await ClockData.find({ createdAt: { $gte: startTime, $lte: endTime }, status: "Open", shiftId: { $in: shiftIds } })
    let clock = []
    let clockObj = { 'break': 0, timeCardIds: [] }
    // let total=0
    let timeCardIds = []
    for (let i = 0; i < clockData.length; i++) {
      clockObj.timeCardIds.push(clockData[i]._id)
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
        clockObj = { 'break': 0 }
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
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    let siteData = await Site.find({}, { _id: 1, name: 1 });
    if (siteData) {
      worksheet.columns = [
        { header: 'Id', key: '_id', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
      ];
      siteData.forEach((data) => worksheet.addRow(data));
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=timesheetBySite.xlsx`
      );
      return workbook.xlsx.write(res).then(() => res.status(200));
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
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    let siteData = await Company.find({}, { _id: 1, name: 1 });
    if (siteData) {
      worksheet.columns = [
        { header: 'Id', key: '_id', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
      ];
      siteData.forEach((data) => worksheet.addRow(data));
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=timesheetByCompany.xlsx`
      );
      return workbook.xlsx.write(res).then(() => res.status(200));
    } else {
      return res.json({ code: 401, message: 'No sites found.', data: [] });
    }
  } catch (error) {
    next(error)
  }
}