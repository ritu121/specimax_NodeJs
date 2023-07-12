const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const exceljs = require('exceljs')
const moment = require("moment-timezone");
const Shift = require('../models/site.roster.model');
const MainShift = require('../models/shift.model');
const User = require('../models/user.model');
const Skills = require('../models/required.skill.and.experience.model');
const emailProvider = require('../services/emails/emailProvider');
const Duty = require('../models/key.shift.duties.model');
const controller = require('./user/user.shift.controller');
const {sentPushNotification} = require('../utils/helper.js')
const { omitBy, isNil } = require('lodash');
const uuidv4 = require("uuid/v4")

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

exports.addUserShift = async (data) => {
  try {
    const shift = new MainShift(data);
    const savedShift = await shift.save();
    return true
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    req.body.contact = req.user.phone;
    req.body.groupId = uuidv4();
    req.body.isGroup = false;
    req.body.createdBy = req.user._id;
    req.body.shiftCode = await this.generateShiftCode(req.body.user)
    const shift = new Shift(req.body);
    const savedShift = await shift.save();
    req.shift = savedShift;
    const addShiftDuties = new Duty({ 'key': req.body.key, 'shiftId': savedShift._id });
    await addShiftDuties.save()
    req.body.shiftType = "Fixed";
    req.body.status = "Unassigned";
    req.body.rosterId = savedShift._id;

    await this.addUserShift(req.body);
    let user = await User.findOne({_id : req.body.assignedUser});

    if(user){
      if(user.deviceToken !== null && user.deviceToken !== undefined && user.deviceToken !== ''){
        sentPushNotification('Shift Alert', 'Shift assign to you', user.deviceToken);
      }
    }
    // const assignedUser = await User.findById(req.body.assignedUser)
    // emailProvider.resendShiftCode(assignedUser, req.body.shiftCode);
    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Roster created successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { shift } = req.locals;
    req.body.createdBy = req.user._id;
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
    .then(async (data) =>{
      let userShift = await MainShift.updateOne({rosterId : req.locals.shift}, req.body);
      res.json({ code: 200, message: 'Shift updated successfully.', data: data.transform() })
    })
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
    // const deleteShift = await MainShift.deleteMany({rosterId : {$ne : null}});
    // res.json({ code: 200, message: 'Shift deleted successfully.', data: {} });
    const shifts = await Shift.list(req.query);
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: shifts });
  } catch (error) {
    next(error);
  }
};

exports.listRoster = async (req, res, next) => {
  try {
    const {siteId} = req.query
    const options = omitBy({ siteId }, isNil);
    const shifts = await Shift.find(options)
                   .populate([
                    {
                      path : 'role',
                      model : 'Role',
                      select : 'name'
                    },
                    {
                      path : 'createdBy',
                      model : 'User',
                      select : 'firstname lastname'
                    },
                    {
                      path : 'siteId',
                      model : 'Site',
                      select: "name",
                    },
                    {
                      path : 'createdBy',
                      model : 'User',
                      select: "firstname lastname"
                    },
                    {
                      path : 'assignedUser',
                      model : 'User',
                      select: "firstname lastname"
                    },
                   ]);
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: shifts });
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

exports.reassign = async (req, res, next) => {
  try {
    req.locals.shift.assignedUser = req.body.userId;
    let shiftId = req.locals.shift
    let data = {};

      var shift = await Shift.findOne({_id : shiftId});
      console.log('aaa',shift)
      if(shift.assignedUser){
        console.log('aaa ina ')
        return this.reassignAl(req,res,next)
      }
      // return
      var ids = [];
      if(shift){
          var cData = {};
          let ranges = await getDates(new Date(shift.startDate), new Date(shift.endDate));

          let days = shift.recurrenceDay;
          let groupId = shift.groupId;
          let isGroup = true;
       
          for(var i =0; i < ranges.length; i++){
              var dynamicDate = new Date(ranges[i]);
              var dateStr = ranges[i];
              if(days.includes(dynamicDate.getDay())){
                var currentShift = await Shift.findOne({_id : shiftId});
                console.log('DYNAMIC DATE',dynamicDate);
                console.log('DYNAMIC -----',ranges[i]);
                console.log('SHIFTS', currentShift);
                cData['createdBy'] = currentShift.createdBy;
                cData['shiftCode'] = await this.generateShiftCode(req.user)
                cData['shiftDate'] = dateStr;
                cData['isGroup'] = isGroup;
                cData['groupId'] = groupId;
                cData['assignedUser'] = req.body.userId;
                cData['status'] = "In Process";
                cData['shiftType'] = 'Casual';
                cData['startTime'] = currentShift.startTime;
                cData['endTime'] = currentShift.endTime;

                cData['recurrenceType'] = currentShift.recurrenceType;
                cData['recurrenceDay'] = currentShift.recurrenceDay;
                cData['siteId'] = currentShift.siteId;
                cData['startDate'] = currentShift.startDate;
                cData['endDate'] = currentShift.endDate;
                cData['role'] = currentShift.role;
                cData['createdBy'] = currentShift.createdBy;
            
                cData['updatedAt'] = new Date();
                cData['shiftCode'] = currentShift.shiftCode;
                

                const shifts = new Shift(cData);
                const savedShift = await shifts.save();
                ids.push(savedShift);
                let duty = await Duty.findOne({shiftId : currentShift._id});
                const addShiftDuties = new Duty({ 'key': duty.key, 'shiftId': savedShift._id });
                await addShiftDuties.save()
            
                // saved shift
                let data = {}
                data.rosterId = savedShift._id;
                data.assignedUser = req.body.userId;
                data.createdBy = currentShift.createdBy;
                data.siteId = currentShift.siteId;
                data.shiftDate = dateStr;
                data.startTime = currentShift.startTime;
                data.endTime = currentShift.endTime;
                data.startDate = currentShift.startDate;
                data.endDate = currentShift.endDate;
                data.shiftCode = currentShift.shiftCode;
                data.groupId = groupId;
                data.isGroup = isGroup;
                data.status = "In Process";
              
                let addShift = await this.addUserShift(data);
                if(addShift){
                  console.log('Shift add success')
                }
                let user = await User.findOne({_id : req.body.userId})
                sentPushNotification('Shift Assigned', `Roster shift assign on date - ${dynamicDate}`, user.deviceToken);
                emailProvider.resendShiftCode(user, currentShift.shiftCode);
              }

          }
          let deleteRosterShift = await Shift.deleteOne({_id : shiftId});
          if(deleteRosterShift){
            console.log('Roster shift deleted')
          }
          let deleteShift = await MainShift.deleteOne({rosterId : shiftId});
          if(deleteShift){
            console.log('Shift deleted')
          }
          let deleteDuty = await Duty.deleteOne({shiftId : shiftId});
          if(deleteDuty){
            console.log('Duty deleted')
          }
      }
      else{
        res.status(404).send({ code: 404, message: 'Roster Shift not found.', data: {} });
      }
      
      if(ids.length > 0){
        res.status(201).send({ code: 201, message: 'Roster Shift apply and assigned successfully.', data: ids });
      }
      else{
        res.status(404).send({ code: 404, message: 'Roster Shift not found.', data: {} });
      }

    // data.rosterId = shift._id;
    // data.createdBy = shift.createdBy;
    // data.assignedUser = req.body.userId;
    // data.siteId = shift.siteId._id;
    // // data.shiftDate = shift.startDate;
    // data.startDate = shift.startDate;
    // data.startTime = shift.startTime;
    // data.endTime = shift.endTime;
    // data.endDate = shift.endDate;
    // data.contact = req.user.phone;
    // data.shiftCode = shift.shiftCode;
    // data.groupId = shift.groupId;
    // data.isGroup = true;

    // await controller.addUserShift(data);
    // const saveShift = await req.locals.shift.save();
    // const assignedUser = await User.findById(req.body.userId);
    // emailProvider.resendShiftCode(assignedUser, data.shiftCode);
    // return res.send(201, { code: 201, status: true, message: 'Roster reassigned Successfully.' , saveShift});

  } catch (error) {
    next(error)
  }
}
exports.reassignAl = async (req, res, next) => {
  try {
    req.locals.shift.assignedUser = req.body.userId;
    let shiftId = req.locals.shift
    let data = {};

      var shift = await Shift.findOne({_id : shiftId});
      
      var ids = [];
      if(shift){
        let roster = await Shift.updateMany({groupId:shift.groupId},{$set:{assignedUser:req.body.userId}})
        let ushift = await MainShift.updateMany({groupId:shift.groupId},{$set:{assignedUser:req.body.userId}})
        if(ushift){
          res.status(201).send({ code: 201, message: 'Roster Shift apply and assigned successfully.', data: [] });
        }
          // var cData = {};
          // let ranges = await getDates(new Date(shift.startDate), new Date(shift.endDate));

          // let days = shift.recurrenceDay;
          // let groupId = shift.groupId;
          // let isGroup = true;
       
          
      }
      else{
        res.status(404).send({ code: 404, message: 'Roster Shift not found.', data: {} });
      }
      
      // if(ids.length > 0){
      //   res.status(201).send({ code: 201, message: 'Roster Shift apply and assigned successfully.', data: ids });
      // }
      // else{
      //   res.status(404).send({ code: 404, message: 'Roster Shift not found.', data: {} });
      // }

    // data.rosterId = shift._id;
    // data.createdBy = shift.createdBy;
    // data.assignedUser = req.body.userId;
    // data.siteId = shift.siteId._id;
    // // data.shiftDate = shift.startDate;
    // data.startDate = shift.startDate;
    // data.startTime = shift.startTime;
    // data.endTime = shift.endTime;
    // data.endDate = shift.endDate;
    // data.contact = req.user.phone;
    // data.shiftCode = shift.shiftCode;
    // data.groupId = shift.groupId;
    // data.isGroup = true;

    // await controller.addUserShift(data);
    // const saveShift = await req.locals.shift.save();
    // const assignedUser = await User.findById(req.body.userId);
    // emailProvider.resendShiftCode(assignedUser, data.shiftCode);
    // return res.send(201, { code: 201, status: true, message: 'Roster reassigned Successfully.' , saveShift});

  } catch (error) {
    next(error)
  }
}

exports.releaseShift = async (req, res, next) => {
  try {
    const shift = await Shift.get(req.body.shiftId);

    const ind = shift.intrestedUsers.indexOf(req.user._id)
    if (ind < 0) {
      return res.send(400, { code: 400, status: true, message: 'User newer applied.' });
    }
    shift.intrestedUsers.splice(ind, 1);
    if (shift.status == 'Assigned' && shift.assignedUser == req.user._id) {
      shift.status = 'Unassigned'
    }
    const saveShift = await shift.save()
    return res.send(201, { code: 201, status: true, message: 'Shift Released Successfully.' });

  } catch (error) {
    next(error)
  }
}

// exports.cancelIntrest = async(req,res,next)=>{
//     try {
//         return res.send(201, { code: 201,status:true, message: 'Subscription Successfully.' });

//     } catch (error) {
//         next(error)
//     }
// }

exports.accpetInterest = async (req, res, next) => {

  try {
    let data = {};
    data.rosterId = req.shift._id;
    data.userId = req.body.assignedUser;
    data.siteId = req.body.siteId;
    data.shiftDate = req.body.startDate;
    data.startDate = req.body.startDate;
    data.startTime = req.body.startTime;
    data.endTime = req.body.endTime;
    data.endDate = req.body.endDate;
    data.contact = req.body.contact;
    data.shiftCode = req.body.shiftCode;
    await controller.addUserShift(data);
    // return res.send(201, { code: 201,status:true, message: 'Shift Accepted Successfully.' });
    return
  } catch (error) {
    next(error)
  }
}

exports.remove = (req, res, next) => {
  const { shift } = req.locals;
  Shift.remove({_id : req.params.shiftId})
    .then(() => {
      MainShift.remove({rosterId : req.params.shiftId})
      .then(() => {
        Duty.remove({shiftId : req.params.shiftId}).then(() => {
          res.json(200, { code: 200, message: 'Shift delete successfully.' })
        })
        .catch((err) => {
          console.log('Deleted Error')
          next(err)
        })
      })
      .catch((ern) => next(ern));
      
    })
    .catch((e) => next(e));
};

exports.removeGroup = (req, res, next) => {
  // sentPushNotification('Sample','This is test notification','cooqAbMcUkoltWORe-Vf0c:APA91bEJHfPi0wYoGV21xbvezjDMttis6LSafSQ31R2ntAHdGp2irut8yQc_76OdXyZGWdZgWivHCMalXB1JKoo7dWbGP8nAOJPmxFcHWlU5QpxiN2QNnLPJlHqghUfuT56ebuLV3qkZ');
  // res.json(200, { code: 200, message: 'Shift delete successfully.' })
  Shift.deleteMany({groupId : req.params.groupId})
    .then(() => {
      MainShift.deleteMany({groupId : req.params.groupId})
      .then(() => {
        // Duty.deleteMany({shiftId : req.params.shiftId}).then(() => {
          res.json(200, { code: 200, message: 'Shift delete successfully.' })
        // })
        // .catch((err) => {
        //   console.log('Deleted Error')
        //   next(err)
        // })
      })
      .catch((ern) => next(ern));
    })
    .catch((e) => next(e));
};

exports.ShiftList = async (req, res, next) => {
  try {
    var {startDate, endDate, siteId} = req.query
    var allRosterShift = null;
    if(!endDate){
      endDate = new Date();
    }
    if(startDate && endDate && siteId){
      console.log('ONE')
      allRosterShift = await Shift.find({shiftDate : {$gte : new Date(startDate), $lte : new Date(endDate)}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(startDate && endDate && !siteId){
      console.log('TWO')
      allRosterShift = await Shift.find({shiftDate : {$gte : startDate, $lte : new Date(endDate)} , assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
      
    }
    else if(startDate && !endDate && siteId){
      console.log('THREE')
      allRosterShift = await Shift.find({shiftDate : {$gte : startDate,  $lte : new Date(endDate)}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && endDate && siteId){
      console.log('FOUR')
      allRosterShift = await Shift.find({shiftDate : {$lte : endDate}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
      
    }
    else if(startDate && !endDate && !siteId){
      console.log('FIVE')
      allRosterShift = await Shift.find({shiftDate : {$gte : startDate, $lte : new Date(endDate)}, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && endDate && !siteId){
      console.log('SIX')
      allRosterShift = await Shift.find({ shiftDate : {$lte : endDate}, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && !endDate && siteId){
      console.log('SEVEN')
      allRosterShift = await Shift.find({siteId : siteId, assignedUser : {$ne : null}, shiftDate : {$lte : endDate}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else{
      console.log('EIGHT')
      allRosterShift = await Shift.find({assignedUser : {$ne : null}, shiftDate : {$lte : endDate}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    // var allRosterShift = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}, siteId : siteId})
    //   .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    const result = allRosterShift.map((data) => {
      var startTime = moment(data.startTime, 'HH:mm a');
      var endTime = moment(data.endTime, 'HH:mm a');
      if (startTime > endTime) endTime = moment(endTime).add(1, "days")
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) % 60;
      let tempData = { ...data._doc }
      tempData.totalHours = hours + ' hour and ' + minutes +' minutes.'
      return tempData;
    })
    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  } catch (error) {
    next(error);
  }
};

exports.exportRosters = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    var allRosterShift = await Shift.find({})
    const result = allRosterShift.map((data) => {
      var startTime = moment(data.startTime, 'HH:mm a');
      var endTime = moment(data.endTime, 'HH:mm a');
      if (startTime > endTime) endTime = moment(endTime).add(1, "days")
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) % 60;
      let tempData = { ...data._doc }
      tempData.totalHours = hours + ' hour and ' + minutes +' minutes.'
      return tempData;
    })
    worksheet.columns = [
      { header: 'User Id', key: 'userId', width: 25 },
      { header: 'Site Id', key: 'siteId', width: 25 },
      { header: 'Role', key: 'role', width: 25 },
      { header: 'Shift Code', key: 'shiftCode', width: 25 },
      { header: 'Shift Dates', key: 'shiftDates', width: 25 },
      { header: 'Start Date', key: 'startDate', width: 25 },
      { header: 'End Date', key: 'endDate', width: 25 },
      { header: 'Start Time', key: 'startTime', width: 25 },
      { header: 'End Time', key: 'endTime', width: 25 },
      { header: 'Total hours', key: 'totalHours', width: 25 },
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
      `attachment; filename=Rosters.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));

    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  } catch (error) {
    next(error);
  }
};
