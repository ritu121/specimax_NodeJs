const httpStatus = require('http-status');
const { omit } = require('lodash');
const Shift = require('../models/shift.model');
const Experience = require('../models/user.experience.model');
const moment = require('moment-timezone');
const casual = require('./company/casual.shift.controller')
const notController = require('./notification.controller')
exports.cities = async (req, res, next) => {
    try {
        let shiftDate = new Date();
        userId=req.user._id
        // const shifts = await Shift.list({shiftDate,assignedUser:userId});
        var condition = {$gte : new Date()}
        // console.log(condition);
        const shifts = await Shift.find({
        assignedUser : userId,
        status : ['Approved','In Process','Cancel'],
        //  shiftType : 'Casual',
        shiftDate : condition
        })
        .populate([
            {
              path : 'siteId',
              model : 'Site'
            },
            {
              path : 'assignedUser',
              model : 'User'
            },
            {
              path : 'createdBy',
              model : 'User'
            },
            {
              path : 'breaks',
              model : 'Break'
            },
            {
              path : 'casualShiftId',
              select: {'startTime':1,endTime:1,userId:1},
              populate:{
                path : 'userId',
                model:'User',
                match:{'startTime':{$gte:shiftDate}}
                // select: {'startTime':1,endTime:1}
              }
            },
            // {
            //   path : 'casualShiftId.userId',
            //   model:'User',
            //   // select: {'startTime':1,endTime:1}
            // }
          ])
        const totalCasual = await casual.getUserLength(userId);
        const total = await Shift.list(req.query);
        const exp =await Experience.find({user:req.user._id})
        const noti = await notController.listByUserCount(req.user._id)
        const transformedShifts = shifts.map((status) => status.transform());
        res.json({ code: 200, message: 'Home Api data retrieved successfully.', data: { 'currentShift': transformedShifts[0]||null, isprofile: exp.length>0, 'totalShifts': totalCasual },'notifications':noti });
    } catch (error) {
        res.json({ code: 500, message: 'Internal server error', errors: {} })

    }
};
getDates = async(startDate, stopDate)=> {
    var dateArray = []
    var currentDate = moment(startDate)
    var stopDate = moment(stopDate)
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
      currentDate = moment(currentDate).add(1, 'days')
    }
    return dateArray
}
exports.getdates = async(req,res,next)=>{
    const {shiftDate} = req.query;
    var userShifts = null;
    if(shiftDate){
        userShifts = await Shift.find({assignedUser : req.user._id , shiftDate : {$gte : new Date()}, shiftDate : new Date(shiftDate)}).populate('casualShiftId roastedId');
    }
    else{
        let dt = new Date()
        dt.setDate(dt.getDate()-1)
        userShifts = await Shift.find({assignedUser : req.user._id , shiftDate : {$gte : dt}}).populate('casualShiftId roastedId')
    }
  
    let arr = []
    for(let i=0;i < userShifts.length; i++){
        if(userShifts[i].casualShiftId !== null){
            let shift = userShifts[i].casualShiftId
            // var today = new Date();
            // var startDate = new Date(shift.startDate);
            // var endDate = new Date(shift.endDate);
            // if(today.getTime() >= startDate && today.getTime() <= endDate){
            //     let dateArr = await getDates(shift.startDate,shift.endDate);
            //     for(var d = 0; d < dateArr.length; d++){
            //         let newDate = new Date(dateArr[d]);
            //         if(shift.recurrenceDay.includes(newDate.getDay())){
            //             arr.push(dateArr[d])
            //         }
            //     }
            // }
            arr.push(moment(userShifts[i].shiftDate).format('YYYY-MM-DD'))
        }
        if(userShifts[i].rosterId !== null){
            let shift = userShifts[i].rosterId
            // var today = new Date();
            // var startDate = new Date(shift.startDate);
            // var endDate = new Date(shift.endDate);
            // if(today.getTime() >= startDate && today.getTime() <= endDate){
            //     let dateArr = await getDates(shift.startDate,shift.endDate);
            //     for(var d = 0; d < dateArr.length; d++){
            //         let newDate = new Date(dateArr[d]);
            //         if(shift.recurrenceDay.includes(newDate.getDay())){
            //             arr.push(dateArr[d])
            //         }
            //     }
            // }
            arr.push(moment(userShifts[i].shiftDate).format('YYYY-MM-DD'))
        }
        // else{
        //     let shift = userShifts[i]
        //     let today = new Date();
        //     let startDate = new Date(shift.startDate);
        //     let endDate = new Date(shift.endDate);
        //     if(today.getTime() >= startDate && today.getTime() <= endDate){
        //         if(shift[i].recurrenceDay.include(today.getDay())){
        //             var currentDate = moment(startDate)
        //             var stopDate = moment(stopDate)
        //             while (currentDate <= stopDate) {
        //             dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
        //             currentDate = moment(currentDate).add(1, 'days')
        //             }
        //         }
        //     }
        //     let dateArr = await getDates(shift.startDate,shift.endDate);
        //     arr = arr.concat(dateArr)
        // }

        arr = [...new Set(arr)];
        
    }
    res.json({ code:200, message:"Dates found successfully", data:{availableDates:arr}})
}
exports.panic = async(req,res,next)=>{
    try {
        res.json({ code: 200, message: 'Panic Notification Sent.'});
    } catch (error) {
        next(error)
    }
}

