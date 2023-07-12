const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Shift = require('../../models/shift.model');
const Checkpoint = require('../../models/site.checkpoints.model');
const Breaks = require('../../models/breaks.model');
const ClockData = require('../../models/clock.data.model');
const User = require('../../models/user.model');
const emailProvider = require('../../services/emails/emailProvider');
const moment = require('moment-timezone');
const CasualShift = require('../../models/casual.shift.model');
const Duty = require('../../models/key.shift.duties.model');
const {sentPushNotification} = require('../../utils/helper');

exports.load = async (req, res, next, id) => {
  try {
    const shift = await Shift.get(id);
    req.locals = { shift };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => {
  res.json({code: 200, message: 'Shift retrieved successfully.', data: req.locals.shift.transform()})
};

exports.loggedIn = (req, res) => res.json(req.shift.transform());

exports.create = async (req, res, next) => {
  try {
    // const data = {
    //   userId : req.user._id,
    //   cardType : req.body.cardType,
    //   bankName : req.body.bankName,
    //   cardHolderName : req.body.cardHolderName,
    //   cardNumber : req.body.cardNumber,
    //   expiryDate : req.body.expiryDate,
    //   cvv : req.body.cvv
    // }
    req.body.userId = req.user._id;
    const shift = new Shift(req.body);
    const savedShift = await shift.save();
    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Shift created successfully.', data: savedShift.transform() });
  } catch (error) {
    next(error);
  }
};

exports.addUserShift = async (data) => {
  try {
    // req.body.userId = req.user._id;
    // console.log('DATA -----', data)
    const shift = new Shift(data);
    const savedShift = await shift.save();
    return true
  } catch (error) {
    console.log(error)
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
  Shift.findOne({_id : id}, function(err, shift){
    if(err){
      res.send(500, { code: 500, message: 'Internal server error.', errors : err });
    }

    if(shift){
      res.send(200 ,{ code: 200, message: 'Shift updated successfully.', data: shift});
    }

    res.send(404, { code: 404, message: 'Shift updated successfully.', data: []});
  })
};

exports.getDates = async (startDate, stopDate) => {
  var dateArray = []
  var currentDate = moment(startDate)
  var stopDate = moment(stopDate)
  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
    currentDate = moment(currentDate).add(1, 'days')
  }
  return dateArray
}

exports.list = async (req, res, next) => {
  try {
    // console.log(req.user);
    // let user = await User.find({phone : req.user.mob})
    // let shiftDate = new Date();
    // userId = req.user._id
    // const shifts = await Shift.list({ shiftDate, userId });
    // const transformedShifts = shifts.map((status) => { data = status.transform(req.query.shiftDate);return {...data,'breakDurationMin':90,totalDuration:getShiftTotal(data)}});
    // res.json({ code: 200, message: 'Shift list retrieved successfully.', data: transformedShifts });
    const {shiftDate, page = 1, perPage = 25} = req.query;
    var condition = shiftDate ? new Date(shiftDate) : {$gte : new Date()};

    // console.log(condition);
    const shifts = await Shift.find({
     assignedUser : req.user._id,
     status : ['Approved','In Process','Cancel'],
    //  shiftType : 'Casual',
     shiftDate : condition
    })
    .sort({shiftDate : 1, createdAt:-1})
    .populate([{
      path : 'siteId',
      
    },{path: 'breaks'}])
    .exec()
    // .map(async(item) =>{
    //   let dates = await getDates(new Date(item.startDate), new Date(item.endDate));
    //   var currentDate = moment(new Date()).format('YYYY-MM-DD');
    //   if(shiftDate){
    //     currentDate = shiftDate
    //   }
    //   if(dates.includes(currentDate)){
    //     return item
    //   }
    // })
    // if(shifts[0]){
    //   shifts[0]['breakDurationMin']=90
    //   shifts[0]['totalDuration']=await getShiftTotal(shifts?.[0])
    // }
    const transformedShifts = shifts.map((status) => { data = status.transform(req.query.shiftDate);return {...data,'breakDurationMin':90,totalDuration:getShiftTotal(data)}});

    res.json({ code: 200, message: 'Shift list retrieved successfully.', data: transformedShifts });
  } catch (error) {
    next(error);
  }
};

exports.listApplied = async (req, res, next) => {
  try {
    const shifts = await Shift.find({
     assignedUser : req.user._id
    })
    .sort({createdAt : -1})
    .exec();

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

exports.apply = async(req,res,next) => {
  try{
    if(req.params.shiftId){
      var getShift = await Shift.findOne({_id : req.params.shiftId});
      var casualShift = null;
      if(getShift){
        if(getShift.casualShiftId){
          casualShift = await CasualShift.findOne({_id : getShift.casualShiftId});
        }
        var ids = [];
        if(casualShift !== null){
            var cData = {};
            let ranges = await getDates(new Date(casualShift.startDate), new Date(casualShift.endDate));

            let days = casualShift.recurrenceDay;
            let groupId = casualShift.groupId;
            let isGroup = true;
            console.log('RANGE DATE', ranges)
            for(var i =0; i < ranges.length; i++){
                var dynamicDate = new Date(ranges[i]);
                var dateStr = ranges[i];
                if(days.includes(dynamicDate.getDay().toString())){
                  console.log('DYNAMIC DATE',dynamicDate)
                  console.log('DYNAMIC -----',ranges[i])
                  // saved casual shift
                  cData['createdBy'] = casualShift.createdBy;
                  cData['shiftCode'] = await this.generateShiftCode(req.user)
                  cData['shiftDate'] = dateStr;
                  cData['isGroup'] = isGroup;
                  cData['groupId'] = groupId;
                  cData['assignedUser'] = req.user._id;
                  cData['status'] = "In Process";
                  cData['shiftType'] = 'Casual';
                  cData['startTime'] = casualShift.startTime;
                  cData['endTime'] = casualShift.endTime;

                  cData['recurrenceType'] = casualShift.recurrenceType;
                  cData['allowedBreaks'] = casualShift.allowedBreaks;
                  cData['reportAt'] = casualShift.reportAt;
                  cData['parkingRequired'] = casualShift.parkingRequired;
                  cData['intrestedUsers'] = casualShift.intrestedUsers;
                  cData['recurrenceDay'] = casualShift.recurrenceDay;
                  cData['companyId'] = casualShift.companyId;
                  cData['siteId'] = casualShift.siteId;
                  cData['woNumber'] = casualShift.woNumber;
                  cData['startDate'] = casualShift.startDate;
                  cData['endDate'] = casualShift.endDate;
                  cData['price'] = casualShift.price;
                  cData['createdBy'] = casualShift.createdBy;
                  cData['priceIn'] = casualShift.priceIn;
                  cData['updatedAt'] = new Date();
                  cData['shiftCode'] = casualShift.shiftCode;
                  cData['licenseType'] = casualShift.licenseType;

                  const shift = new CasualShift(cData);
                  const savedShift = await shift.save();
                  ids.push(savedShift);
                  let duty = await Duty.findOne({shiftId : casualShift._id});
                  const addShiftDuties = new Duty({ 'key': duty.key, 'shiftId': savedShift._id });
                  await addShiftDuties.save()
              
                  // saved shift
                  let data = {}
                  data.casualShiftId = savedShift._id;
                  data.userId = casualShift.assignedUser;
                  data.siteId = casualShift.siteId;
                  data.shiftDate = dateStr;
                  data.startTime = casualShift.startTime;
                  data.endTime = casualShift.endTime;
                  data.startDate = casualShift.startDate;
                  data.endDate = casualShift.endDate;
                  data.groupId = groupId;
                  data.isGroup = isGroup;
                  data.status = "In Process";
                  data.assignedUser = req.user._id;

                  let addShift = await this.addUserShift(data);
                  if(addShift){
                    console.log('SHift add success')
                  }
                  sentPushNotification('Shift Assigned', `Casual shift assign on date - ${dynamicDate}`, req.user.deviceToken);
                  emailProvider.resendShiftCode(req.user, casualShift.shiftCode);
                }

            }
            let deleteCasualShift = await CasualShift.deleteOne({_id : getShift.casualShiftId});
            if(deleteCasualShift){
              console.log('Casual shift deleted')
            }
            let deleteShift = await Shift.deleteOne({_id : req.params.shiftId});
            if(deleteShift){
              console.log('Shift deleted')
            }
            let deleteDuty = await Duty.deleteOne({shiftId : getShift.casualShiftId});
            if(deleteDuty){
              console.log('Duty deleted')
            }
        }
        else{
          res.status(404).send({ code: 404, message: 'Casual Shift not found.', data: {} });
        }
      }
      if(getShift){
        res.status(201).send({ code: 201, message: 'Casual Shift apply and assigned successfully.', data: ids });
      }
      else{
        res.status(404).send({ code: 404, message: 'Casual Shift not found.', data: {} });
      }
    }
    else{
      res.status(404).send({code : 404, message : 'Shift is required!', data : {}})
    }
  }
  catch(error){
    console.log(error);
    next(error)
  }
}

getShiftTotal = (data)=>{
  let time =  data.clockOutTime?data.clockOutTime-data.clockInTime:new Date()-data.clockInTime
  return (new Date(time).getHours()*60) + (new Date(time).getMinutes())
}

exports.clockIn = async (req,res,next) => {
  try{
    const id = req.locals.shift;
    // let check;
    // try {
    //   check = await Checkpoint.findById(req.body.scanId)
    //   if(!check){
    //     return res.send(500, { code: 500, message: 'Invalid Checkpoint.' });
    //   }
    // } catch (error) {
    //   let err = new Error('Invalid Scan code')
    //   next(err)
    //   return 
    // }

    // if(String(check.siteId) != String(id.siteId?._id)){
    //   return res.send(500, { code: 500, message: 'Invalid Site Location.' });
      
    // }
    // if(id.inOut=='IN'){
    //   return res.send(401, { code: 401, message: 'User Already Clocked In.' });
    // }
    // let clockin = new ClockData({type:'clockin',userId:req.user._id,shiftId:id})
    // await clockin.save()
    // const updateShift = await Shift.updateOne({_id:id},{'inOut':'IN',clockInTime:req.body.clockInTime})
    // if(updateShift){
    //   res.send(200 ,{ code: 200, message: 'Clocked In successfully.'});
    // }else{
    //   res.send(500, { code: 500, message: 'Internal server error.' });

    // }

    // checkpoint concept missing
    const shift = await Shift.findOne({_id : id}).populate('assignedUser');

    if(shift){
      if(shift.inOut === 'OUT' || shift.inOut===null){
        const updateShift = await Shift.updateOne({_id:id},{clockInTime:req.body.clockInTime,'inOut':'IN'}, async function(err, update){
          if(err){
            next(err)
          }
          else{
            let clockin = new ClockData({type:'clockin',userId:req.user._id,shiftId:id, siteId : shift._id})
            await clockin.save()
            let latestShift = await Shift.findOne({_id : id});
            sentPushNotification('Clock in', `Casual shift clock in at - ${req.body.clockInTime}`, shift.assignedUser.deviceToken);
            res.send(200 ,{ code: 200, message: 'Clocked In successfully.', data : latestShift});
          }
        })
      }
      else{
        res.send(400 ,{ code: 400, message: 'Already Clocked In.', data : {}});
      }
    }
    else{
      res.send(404,{code : 404, message : 'Shift not found', data : {}})
    }
  }
  catch(errors){
    console.log(errors)
    next(errors)
  }
}

exports.clockOut = async (req,res,next) => {
  const id = req.locals.shift;
  const shift = await Shift.findOne({_id : id}).populate('assignedUser');
  try{
    if(shift){
      console.log('aaa',shift)
      if(shift.inOut === 'IN'){
        const updateShift = await Shift.updateOne({_id:id},{clockOutTime:req.body.clockOutTime,'inOut':'OUT'}, async function(err, update){
          if(err){
            next(err)
          }
          else{
            let clockin = new ClockData({type:'clockout',userId:req.user._id,shiftId:id, siteId : shift._id})
            await clockin.save()
            let latestShift = await Shift.findOne({_id : id});
            sentPushNotification('Clock in', `Casual shift clock out at - ${req.body.clockOutTime}`, shift.assignedUser.deviceToken);
            res.send(200 ,{ code: 200, message: 'Clocked Out successfully.', data : latestShift});
          }
        })
      }
      else{
        res.send(400 ,{ code: 400, message: 'Already Clocked Out.', data : {}});
      }
    }
    else{
      res.send(404,{code : 404, message : 'Shift not found', data : {}})
    }
  }
  catch(errors){
    console.log(errors)
    next(errors);
  }
  
  // if(id.inOut=='OUT'){
  //   return res.send(401, { code: 401, message: 'User Already Clocked Out.' });
  // }
  // let check;
  //   try {
  //     check = await Checkpoint.findById(req.body.scanId)
  //     if(!check){
  //       return res.send(500, { code: 500, message: 'Invalid Checkpoint.' });

  //     }
  //   } catch (error) {
  //     let err = new Error('Invalid Scan code')
  //     next(err)
  //     return 
  //   }

  //   if(String(check.siteId) != String(id.siteId?._id)){
  //     return res.send(401, { code: 401, message: 'Invalid Site Location.' });
  //   }
  // let clockin = new ClockData({type:'clockout',userId:req.user._id,shiftId:id})
  // await clockin.save()
  // const updateShift = await Shift.updateOne({_id:id},{'inOut':'OUT',clockOutTime:req.body.clockOutTime})
  // if(updateShift){
  //   res.send(200 ,{ code: 200, message: 'Clocked Out successfully.'});
  // }else{
  //   res.send(500, { code: 500, message: 'Internal server error.' });
  // }
}

exports.verifyShiftCode = async (req,res,next)=>{
  try {
    const data = await Shift.findOne({ _id: req.locals.shift })
    if (data.shiftCode==req.query.shiftCode){
      return res.send(201, { code: 201,status:true, message: 'Shift Code Validated Successfully.' });
    }else{
      return res.send(401, { code: 401, message: 'Invalid Shift Code.' });
    }
  } catch (error) {
    next(error)
  }
}

exports.resendShiftCode = async(req,res,next)=>{
  try {
    const data = await Shift.findOne({ _id: req.locals.shift })
    emailProvider.resendShiftCode(req.user, data.shiftCode);

    return res.send(201, { code: 201,status:true, message: 'Shift Code Emailed Successfully.' });
  } catch (error) {
    next(error)
  }
}

exports.addBreak = async(req,res,next)=>{
  try {
    let addBreak = new Breaks(req.body);
    let saveData = await addBreak.save()
    const id = req.locals.shift;
    let duration = (new Date(req.body.endTime)-new Date(req.body.startTime))/60000
    let clockBreak = new ClockData({type:'break',userId:req.user._id,breakDuration:duration,shiftId:id})
    await clockBreak.save()
    const updateShift = await Shift.updateOne({_id:id},{$push:{'breaks':saveData._id}})
    const savedShift = await Shift.findById(id);

    res.send(200 ,{ code: 200, message: 'Break added successfully.', data: savedShift.transform()});
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
