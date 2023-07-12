const httpStatus = require('http-status');
const { omitBy } = require('lodash');
const Shift = require('../models/shift.model');
const ShiftLog = require('../models/shift.logs.model');
const Alarm = require('../models/alarm.model');
const Task = require('../models/task.model');
const Report = require('../models/report.model');
const mongoose = require('mongoose');
const {convertTime12to24, formatAMPM} = require('../utils/helper');
const {createTime, convertMsToHM} = require("../utils/helper")


exports.rosterShiftOverview = async (req, res, next) => {
    try {
        var { siteId,stateId, vendorId, role, userId , year} = req.query;
        var options = {};
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }
        if(vendorId){
            options['vendorId'] = mongoose.Types.ObjectId(vendorId);
        }
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(vendorId){
            options['role'] = mongoose.Types.ObjectId(role);
        }
        if(stateId){
            options['stateId'] = mongoose.Types.ObjectId(stateId);
        }
        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['assignedUser'] = {$ne : null};
        options['rosterId'] = {$ne : null};
    
        let currentYear = year.getFullYear();
        let loop = ['01','02','03','04','05','06','07','08','09','10','11','12']
        var monthArr = loop.map((item) => {
            let newDate =  currentYear + '-' + item + '-01';
            newDate =  new Date (newDate);
            return newDate;
        })

        options['shiftDate'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };
        options['shiftDate'] = {$ne : null};
    

        // let totalShift = await Shift.aggregate([{$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}])
        // let missedClockShift = await Shift.aggregate([
        //     {$match:{"clockInTime":null}},
        //     {$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}
        // ])
        // let lateClockShift = await Shift.aggregate([
        //     {$addFields:{"newDate":"$shiftDate"}},
        //     {$match:{$expr:{$gt:["$clockInTime", "$shiftDate"]}}},
        //     // {$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}
        // ])
        // console.log('aaa',totalShift,lateClockShift)
        // for(let i=0;i<shift.length;i++){
        //     if(shift[i]["_id"]["month"]==3){
        //         console.log('in 3')
        //     }
        // }
        let shifts = await Shift.find(options)
                    .populate(
                        [
                            {
                                path : 'siteId',
                                model : 'Site',
                                select :'name'
                              },
                              {
                                path : 'assignedUser',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'createdBy',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'breaks',
                                model : 'Break'
                              },
                              {
                                path : 'casualShiftId',
                                model : 'CasualShift'
                              },
                          ]
                    )

          var janArr = {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var febArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var marArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var aprArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var mayArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var junArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var julArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var augArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var sepArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var octArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var novArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var decArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          console.log('aa',shifts, options)
          for(var r = 0; r < shifts.length; r++){
            let rosterLateClockIn=0
            let rosterMissClockIn=0
            let currentDate = new Date(shifts[r].shiftDate);
            let item = shifts[r]
            var clockInTime = false
            if(item.clockInTime !== null && item.clockInTime !== ''){
                // rosterClockIn = rosterClockIn + 1;
                clockInTime = true
            }
            let month = currentDate.getMonth();
            if(clockInTime === true){
                let shiftDate = item.shiftDate;
                let startTime = item.startTime;
                let checkTime = formatAMPM(item.clockInTime);
                startTime = `${startTime.slice(0,4)} ${startTime.slice(-2)}`;
                let newDate = new Date(createTime(shiftDate , startTime))
                let clockInDate = new Date(createTime(shiftDate , checkTime))
                newDate = newDate.setMinutes( newDate.getMinutes() + 15 )

                if(clockInDate.getTime() > newDate){
                    rosterLateClockIn = rosterLateClockIn + 1;
                }
            }
    
            if(item.clockInTime === null || item.clockInTime === ''){
                rosterMissClockIn = rosterMissClockIn + 1;
            }
            console.log('month',month)
            if(month === 1){
                // janArr.push(shifts[r]);
                janArr.shifts+=1
                janArr.lateClock+=rosterLateClockIn
                janArr.missedClock+=rosterMissClockIn
                if(clockInTime)janArr.clockIn+=1
            }
            else if(month === 2){
                febArr.shifts+=1
                febArr.lateClock+=rosterLateClockIn
                febArr.missedClock+=rosterMissClockIn
                if(clockInTime)febArr.clockIn+=1
            }
            else if(month === 3){
                marArr.shifts+=1
                marArr.lateClock+=rosterLateClockIn
                marArr.missedClock+=rosterMissClockIn
                if(clockInTime)marArr.clockIn+=1
            }
            else if(month === 4){
                aprArr.shifts+=1
                aprArr.lateClock+=rosterLateClockIn
                aprArr.missedClock+=rosterMissClockIn
                if(clockInTime)aprArr.clockIn+=1
            }
            else if(month === 5){
                mayArr.shifts+=1
                mayArr.lateClock+=rosterLateClockIn
                mayArr.missedClock+=rosterMissClockIn
                if(clockInTime)mayArr.clockIn+=1
            }
            else if(month === 6){
                junArr.shifts+=1
                junArr.lateClock+=rosterLateClockIn
                junArr.missedClock+=rosterMissClockIn
                if(clockInTime)junArr.clockIn+=1
            }
            else if(month === 7){
                julArr.shifts+=1
                julArr.lateClock+=rosterLateClockIn
                julArr.missedClock+=rosterMissClockIn
                if(clockInTime)julArr.clockIn+=1
            }
            else if(month === 8){
                augArr.shifts+=1
                augArr.lateClock+=rosterLateClockIn
                augArr.missedClock+=rosterMissClockIn
                if(clockInTime)augArr.clockIn+=1
            }
            else if(month === 9){
                sepArr.shifts+=1
                sepArr.lateClock+=rosterLateClockIn
                sepArr.missedClock+=rosterMissClockIn
                if(clockInTime)sepArr.clockIn+=1
            }
            else if(month === 10){
                octArr.shifts+=1
                octArr.lateClock+=rosterLateClockIn
                octArr.missedClock+=rosterMissClockIn
                if(clockInTime)octArr.clockIn+=1
            }
            else if(month === 11){
                novArr.shifts+=1
                novArr.lateClock+=rosterLateClockIn
                novArr.missedClock+=rosterMissClockIn
                if(clockInTime)novArr.clockIn+=1
            }
            else if(month === 1){
                decArr.shifts+=1
                decArr.lateClock+=rosterLateClockIn
                decArr.missedClock+=rosterMissClockIn
                if(clockInTime)decArr.clockIn+=1
            }
          }

        let response = {
            january : janArr,// {'shifts':janArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            february : febArr,// {'shifts':febArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            march : marArr,// {'shifts':marArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            april : aprArr,// {'shifts':aprArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            may : mayArr,// {'shifts':mayArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            june : junArr,// {'shifts':janArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            july : julArr, //{'shifts':julArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            august : augArr,// {'shifts':augArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            september : sepArr,// {'shifts':sepArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            october : octArr,// {'shifts':octArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            november : novArr,// {'shifts':novArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            december : decArr,// {'shifts':decArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Roaster shift report retrieve successfully.', data: response});
      } catch (error) {
        next(error);
      }
};

exports.casualShiftOverview = async (req, res, next) => {
    try {
        var { siteId,stateId, vendorId, role, userId , year} = req.query;
        var options = {};
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }
        if(vendorId){
            options['vendorId'] = mongoose.Types.ObjectId(vendorId);
        }
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(vendorId){
            options['role'] = mongoose.Types.ObjectId(role);
        }
        if(stateId){
            options['stateId'] = mongoose.Types.ObjectId(stateId);
        }
        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['assignedUser'] = {$ne : null};
        options['casualShiftId'] = {$ne : null};
    
        let currentYear = year.getFullYear();
        let loop = ['01','02','03','04','05','06','07','08','09','10','11','12']
        var monthArr = loop.map((item) => {
            let newDate =  currentYear + '-' + item + '-01';
            newDate =  new Date (newDate);
            return newDate;
        })

        options['shiftDate'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };
        options['shiftDate'] = {$ne : null};
    

        // let totalShift = await Shift.aggregate([{$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}])
        // let missedClockShift = await Shift.aggregate([
        //     {$match:{"clockInTime":null}},
        //     {$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}
        // ])
        // let lateClockShift = await Shift.aggregate([
        //     {$addFields:{"newDate":"$shiftDate"}},
        //     {$match:{$expr:{$gt:["$clockInTime", "$shiftDate"]}}},
        //     // {$group:{_id:{month:{$month:"$startDate"}},count:{$sum:1}}}
        // ])
        // console.log('aaa',totalShift,lateClockShift)
        // for(let i=0;i<shift.length;i++){
        //     if(shift[i]["_id"]["month"]==3){
        //         console.log('in 3')
        //     }
        // }
        let shifts = await Shift.find(options)
                    .populate(
                        [
                            {
                                path : 'siteId',
                                model : 'Site',
                                select :'name'
                              },
                              {
                                path : 'assignedUser',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'createdBy',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'breaks',
                                model : 'Break'
                              },
                              {
                                path : 'casualShiftId',
                                model : 'CasualShift'
                              },
                          ]
                    )

          var janArr = {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var febArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var marArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var aprArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var mayArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var junArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var julArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var augArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var sepArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var octArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var novArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          var decArr =  {'shifts':0,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0};
          console.log('aa',shifts, options)
          for(var r = 0; r < shifts.length; r++){
            let rosterLateClockIn=0
            let rosterMissClockIn=0
            let currentDate = new Date(shifts[r].shiftDate);
            let item = shifts[r]
            var clockInTime = false
            if(item.clockInTime !== null && item.clockInTime !== ''){
                // rosterClockIn = rosterClockIn + 1;
                clockInTime = true
            }
            let month = currentDate.getMonth();
            if(clockInTime === true){
                let shiftDate = item.shiftDate;
                let startTime = item.startTime;
                let checkTime = formatAMPM(item.clockInTime);
                startTime = `${startTime.slice(0,4)} ${startTime.slice(-2)}`;
                let newDate = new Date(createTime(shiftDate , startTime))
                let clockInDate = new Date(createTime(shiftDate , checkTime))
                newDate = newDate.setMinutes( newDate.getMinutes() + 15 )

                if(clockInDate.getTime() > newDate){
                    rosterLateClockIn = rosterLateClockIn + 1;
                }
            }
    
            if(item.clockInTime === null || item.clockInTime === ''){
                rosterMissClockIn = rosterMissClockIn + 1;
            }
            console.log('month',month)
            if(month === 1){
                // janArr.push(shifts[r]);
                janArr.shifts+=1
                janArr.lateClock+=rosterLateClockIn
                janArr.missedClock+=rosterMissClockIn
                if(clockInTime)janArr.clockIn+=1
            }
            else if(month === 2){
                febArr.shifts+=1
                febArr.lateClock+=rosterLateClockIn
                febArr.missedClock+=rosterMissClockIn
                if(clockInTime)febArr.clockIn+=1
            }
            else if(month === 3){
                marArr.shifts+=1
                marArr.lateClock+=rosterLateClockIn
                marArr.missedClock+=rosterMissClockIn
                if(clockInTime)marArr.clockIn+=1
            }
            else if(month === 4){
                aprArr.shifts+=1
                aprArr.lateClock+=rosterLateClockIn
                aprArr.missedClock+=rosterMissClockIn
                if(clockInTime)aprArr.clockIn+=1
            }
            else if(month === 5){
                mayArr.shifts+=1
                mayArr.lateClock+=rosterLateClockIn
                mayArr.missedClock+=rosterMissClockIn
                if(clockInTime)mayArr.clockIn+=1
            }
            else if(month === 6){
                junArr.shifts+=1
                junArr.lateClock+=rosterLateClockIn
                junArr.missedClock+=rosterMissClockIn
                if(clockInTime)junArr.clockIn+=1
            }
            else if(month === 7){
                julArr.shifts+=1
                julArr.lateClock+=rosterLateClockIn
                julArr.missedClock+=rosterMissClockIn
                if(clockInTime)julArr.clockIn+=1
            }
            else if(month === 8){
                augArr.shifts+=1
                augArr.lateClock+=rosterLateClockIn
                augArr.missedClock+=rosterMissClockIn
                if(clockInTime)augArr.clockIn+=1
            }
            else if(month === 9){
                sepArr.shifts+=1
                sepArr.lateClock+=rosterLateClockIn
                sepArr.missedClock+=rosterMissClockIn
                if(clockInTime)sepArr.clockIn+=1
            }
            else if(month === 10){
                octArr.shifts+=1
                octArr.lateClock+=rosterLateClockIn
                octArr.missedClock+=rosterMissClockIn
                if(clockInTime)octArr.clockIn+=1
            }
            else if(month === 11){
                novArr.shifts+=1
                novArr.lateClock+=rosterLateClockIn
                novArr.missedClock+=rosterMissClockIn
                if(clockInTime)novArr.clockIn+=1
            }
            else if(month === 1){
                decArr.shifts+=1
                decArr.lateClock+=rosterLateClockIn
                decArr.missedClock+=rosterMissClockIn
                if(clockInTime)decArr.clockIn+=1
            }
          }

          let response = {
            january : janArr,// {'shifts':janArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            february : febArr,// {'shifts':febArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            march : marArr,// {'shifts':marArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            april : aprArr,// {'shifts':aprArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            may : mayArr,// {'shifts':mayArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            june : junArr,// {'shifts':janArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            july : julArr, //{'shifts':julArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            august : augArr,// {'shifts':augArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            september : sepArr,// {'shifts':sepArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            october : octArr,// {'shifts':octArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            november : novArr,// {'shifts':novArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0},
            december : decArr,// {'shifts':decArr.length,'clockIn':0,'lateClock':0,'missedClock':0,'clockOut':0,'forcedClockout':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Casual shift report retrieved successfully.', data: response});
      } catch (error) {
        next(error);
      }
};

exports.alarmResponseOverview = async (req, res, next) => {
    try {
        var { userId,companyId, dueDate, startTime, endTime, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['user'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['sites'] = {$in : [siteId]};
        }
        if(companyId){
            options['company'] = mongoose.Types.ObjectId(companyId);
        }
        if(dueDate){
            options['dueDate'] = {$lte : dueDate, $gte : dueDate};
        }
        if(startTime){
            options['startTime'] = startTime;
        }
        if(endTime){
            options['endTime'] = endTime;
        }

        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        console.log('FIltered  ------', options)
        let currentYear = year.getFullYear();

        options['dueDate'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let alarms = await Alarm.find(options)
                    .populate(
                        [
                              {
                                path : 'user',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'company',
                                model : 'Company',
                                select : 'name'
                              }
                          ]
                    )

          var janArr = [];
          var febArr = [];
          var marArr = [];
          var aprArr = [];
          var mayArr = [];
          var junArr = [];
          var julArr = [];
          var augArr = [];
          var sepArr = [];
          var octArr = [];
          var novArr = [];
          var decArr = [];
          
          for(var r = 0; r < alarms.length; r++){
            let currentDate = new Date(alarms[r].dueDate);
            let month = currentDate.getMonth();
            if(month === 1){
                janArr.push(alarms[r]);
            }
            else if(month === 2){
                febArr.push(alarms[r]);
            }
            else if(month === 3){
                marArr.push(alarms[r]);
            }
            else if(month === 4){
                aprArr.push(alarms[r]);
            }
            else if(month === 5){
                mayArr.push(alarms[r]);
            }
            else if(month === 6){
                junArr.push(alarms[r]);
            }
            else if(month === 7){
                julArr.push(alarms[r]);
            }
            else if(month === 8){
                augArr.push(alarms[r]);
            }
            else if(month === 9){
                sepArr.push(alarms[r]);
            }
            else if(month === 10){
                octArr.push(alarms[r]);
            }
            else if(month === 11){
                novArr.push(alarms[r]);
            }
            else if(month === 1){
                decArr.push(alarms[r]);
            }
          }

        let response = {
            january : {'alarm':janArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            february : {'alarm':febArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            march : {'alarm':marArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            april : {'alarm':aprArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            may : {'alarm':mayArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            june : {'alarm':junArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            july : {'alarm':julArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            august : {'alarm':augArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            september : {'alarm':sepArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            october : {'alarm':octArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            november : {'alarm':novArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            december : {'alarm':decArr.length,'totalResp':0,'lateResp':0,'missedResp':0,'closedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Alarm repose overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};

exports.taskOverview = async (req, res, next) => {
    try {
        var { userId, companyId, taskDate, timeDue, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['assignedUser'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['siteId'] = {$in : [siteId]};
        }
        if(companyId){
            options['companyId'] = mongoose.Types.ObjectId(companyId);
        }
        if(taskDate){
            options['taskDate'] = {$lte : taskDate, $gte : taskDate};
        }
        if(timeDue){
            options['timeDue'] = timeDue;
        }


        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['isGroup'] = true;

        console.log('FIltered  ------', options)
        let currentYear = year.getFullYear();

        options['taskDate'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let tasks = await Task.find(options)
                    .populate(
                        [
                              {
                                path : 'assignedUser',
                                model : 'User',
                                select : 'firstname lastname'
                              },
                              {
                                path : 'siteTd',
                                model : 'Site',
                                select : 'name'
                              },
                              {
                                path : 'companyId',
                                model : 'Company',
                                select : 'name'
                              }
                          ]
                    )

          var janArr = [];
          var febArr = [];
          var marArr = [];
          var aprArr = [];
          var mayArr = [];
          var junArr = [];
          var julArr = [];
          var augArr = [];
          var sepArr = [];
          var octArr = [];
          var novArr = [];
          var decArr = [];

          
          for(var r = 0; r < tasks.length; r++){
            let currentDate = new Date(tasks[r].taskDate);
            let month = currentDate.getMonth();
            if(month === 1){
                janArr.push(tasks[r]);
            }
            else if(month === 2){
                febArr.push(tasks[r]);
            }
            else if(month === 3){
                marArr.push(tasks[r]);
            }
            else if(month === 4){
                aprArr.push(tasks[r]);
            }
            else if(month === 5){
                mayArr.push(tasks[r]);
            }
            else if(month === 6){
                junArr.push(tasks[r]);
            }
            else if(month === 7){
                julArr.push(tasks[r]);
            }
            else if(month === 8){
                augArr.push(tasks[r]);
            }
            else if(month === 9){
                sepArr.push(tasks[r]);
            }
            else if(month === 10){
                octArr.push(tasks[r]);
            }
            else if(month === 11){
                novArr.push(tasks[r]);
            }
            else if(month === 1){
                decArr.push(tasks[r]);
            }
          }

        let response = {
            january : {'task':janArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            february : {'task':febArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            march : {'task':marArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            april : {'task':aprArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            may : {'task':mayArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            june : {'task':junArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            july : {'task':julArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            august : {'task':augArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            september : {'task':sepArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            october : {'task':octArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            november : {'task':novArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0},
            december : {'task':decArr.length,'updatedTask':0,'lateResp':0,'missedResp':0,'completedResp':0,'onHold':0,'respPercent':0,'missedPercent':0,'holdPercent':0,'compPercent':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Task report overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};


exports.defectInjuryOverview = async (req, res, next) => {
    try {
        var { userId, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }


        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['reportTypeId'] = mongoose.Types.ObjectId('63de643044b3381cb833abea');


        let currentYear = year.getFullYear();

        options['createdAt'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let reports = await Report.find(options);

          var janArr = [];
          var febArr = [];
          var marArr = [];
          var aprArr = [];
          var mayArr = [];
          var junArr = [];
          var julArr = [];
          var augArr = [];
          var sepArr = [];
          var octArr = [];
          var novArr = [];
          var decArr = [];

          
          for(var r = 0; r < reports.length; r++){
            let currentDate = new Date(reports[r].createdAt);
            let month = currentDate.getMonth();
            if(month === 1){
                janArr.push(reports[r]);
            }
            else if(month === 2){
                febArr.push(reports[r]);
            }
            else if(month === 3){
                marArr.push(reports[r]);
            }
            else if(month === 4){
                aprArr.push(reports[r]);
            }
            else if(month === 5){
                mayArr.push(reports[r]);
            }
            else if(month === 6){
                junArr.push(reports[r]);
            }
            else if(month === 7){
                julArr.push(reports[r]);
            }
            else if(month === 8){
                augArr.push(reports[r]);
            }
            else if(month === 9){
                sepArr.push(reports[r]);
            }
            else if(month === 10){
                octArr.push(reports[r]);
            }
            else if(month === 11){
                novArr.push(reports[r]);
            }
            else if(month === 1){
                decArr.push(reports[r]);
            }
          }

        let response = {
            january : {'critical':janArr.length,'nonCritical':0,'injuries':0},
            february : {'critical':febArr.length,'nonCritical':0,'injuries':0},
            march : {'critical':marArr.length,'nonCritical':0,'injuries':0},
            april : {'critical':aprArr.length,'nonCritical':0,'injuries':0},
            may : {'critical':mayArr.length,'nonCritical':0,'injuries':0},
            june : {'critical':junArr.length,'nonCritical':0,'injuries':0},
            july : {'critical':julArr.length,'nonCritical':0,'injuries':0},
            august : {'critical':augArr.length,'nonCritical':0,'injuries':0},
            september : {'critical':sepArr.length,'nonCritical':0,'injuries':0},
            october : {'critical':octArr.length,'nonCritical':0,'injuries':0},
            november : {'critical':novArr.length,'nonCritical':0,'injuries':0},
            december : {'critical':decArr.length,'nonCritical':0,'injuries':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Defect & Injury report overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};

checkMonth = ()=>{

}

exports.shiftLogOverview = async (req, res, next) => {
    try {
        var {siteId, year} = req.query;
        var options = {};

        if(siteId){
            options['siteId'] = mongoose.mongo.ObjectId(siteId);
        }

        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

       

        let currentYear = year.getFullYear();
        
        // options['createdAt'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };
        
        console.log('FIltered  ------', options)
        var janArr = {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var febArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var marArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var aprArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var mayArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var junArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var julArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var augArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var sepArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var octArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var novArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        var decArr =   {'shifts':0,'clockIn':0,'logs':0,'missed':0};
        let totalShifts = await Shift.aggregate([
            {$match:options},
            {$group:{_id:{month:{$month:"$shiftDate"}},count:{$sum:1}}}
        ])
        let clockIns = await Shift.aggregate([
            {$match:{"clockInTime":{$ne:null}}},
            {$group:{_id:{month:{$month:"$shiftDate"}},count:{$sum:1}}}
        ])

        let logs = await ShiftLog.aggregate([
            // {$match:{'createdAt': { '$gte': '2023-01-01', '$lte': '2023-12-31' }}},
            {$match:{options}},
            {$group:{_id:{month:{$month:"$createdAt"}},count:{$sum:1}}}
        ])

        totalShifts.map(e=>{
            if(e['_id']['month']==1){
                janArr.shifts=e.count
            }
            else if(e['_id']['month']==2){
                febArr.shifts=e.count
            }
            else if(e['_id']['month']==3){
                marArr.shifts=e.count
            }
            else if(e['_id']['month']==4){
                aprArr.shifts=e.count
            }
            else if(e['_id']['month']==5){
                mayArr.shifts=e.count
            }
            else if(e['_id']['month']==6){
                junArr.shifts=e.count
            }
            else if(e['_id']['month']==7){
                julArr.shifts=e.count
            }
            else if(e['_id']['month']==8){
                augArr.shifts=e.count
            }
            else if(e['_id']['month']==9){
                sepArr.shifts=e.count
            }
            else if(e['_id']['month']==10){
                octArr.shifts=e.count
            }
            else if(e['_id']['month']==11){
                novArr.shifts=e.count
            }
            else if(e['_id']['month']==12){
                decArr.shifts=e.count
            }
        })
        clockIns.map(e=>{
            if(e['_id']['month']==1){
                janArr.clockIn=e.count
            }
            else if(e['_id']['month']==2){
                febArr.clockIn=e.count
            }
            else if(e['_id']['month']==3){
                marArr.clockIn=e.count
            }
            else if(e['_id']['month']==4){
                aprArr.clockIn=e.count
            }
            else if(e['_id']['month']==5){
                mayArr.clockIn=e.count
            }
            else if(e['_id']['month']==6){
                junArr.clockIn=e.count
            }
            else if(e['_id']['month']==7){
                julArr.clockIn=e.count
            }
            else if(e['_id']['month']==8){
                augArr.clockIn=e.count
            }
            else if(e['_id']['month']==9){
                sepArr.clockIn=e.count
            }
            else if(e['_id']['month']==10){
                octArr.clockIn=e.count
            }
            else if(e['_id']['month']==11){
                novArr.clockIn=e.count
            }
            else if(e['_id']['month']==12){
                decArr.clockIn=e.count
            }
        })
        logs.map(e=>{
            if(e['_id']['month']==1){
                janArr.logs=e.count
            }
            else if(e['_id']['month']==2){
                febArr.logs=e.count
            }
            else if(e['_id']['month']==3){
                marArr.logs=e.count
            }
            else if(e['_id']['month']==4){
                aprArr.logs=e.count
            }
            else if(e['_id']['month']==5){
                mayArr.logs=e.count
            }
            else if(e['_id']['month']==6){
                junArr.logs=e.count
            }
            else if(e['_id']['month']==7){
                julArr.logs=e.count
            }
            else if(e['_id']['month']==8){
                augArr.logs=e.count
            }
            else if(e['_id']['month']==9){
                sepArr.logs=e.count
            }
            else if(e['_id']['month']==10){
                octArr.logs=e.count
            }
            else if(e['_id']['month']==11){
                novArr.logs=e.count
            }
            else if(e['_id']['month']==12){
                decArr.logs=e.count
            }
        })

        // let logs = await ShiftLog.find(options)
        //             .populate(
        //                 [
        //                       {
        //                         path : 'shiftId',
        //                         model : 'Shift'
        //                       }
        //                   ]
        //             )
        console.log('LOGS', logs,clockIns,totalShifts)
        

          
        //   for(var r = 0; r < logs.length; r++){
        //     let currentDate = new Date(logs[r].createdAt);
        //     let month = currentDate.getMonth();
        //     if(month === 1){
        //         janArr.push(logs[r]);
        //     }
        //     else if(month === 2){
        //         febArr.push(logs[r]);
        //     }
        //     else if(month === 3){
        //         marArr.push(logs[r]);
        //     }
        //     else if(month === 4){
        //         aprArr.push(logs[r]);
        //     }
        //     else if(month === 5){
        //         mayArr.push(logs[r]);
        //     }
        //     else if(month === 6){
        //         junArr.push(logs[r]);
        //     }
        //     else if(month === 7){
        //         julArr.push(logs[r]);
        //     }
        //     else if(month === 8){
        //         augArr.push(logs[r]);
        //     }
        //     else if(month === 9){
        //         sepArr.push(logs[r]);
        //     }
        //     else if(month === 10){
        //         octArr.push(logs[r]);
        //     }
        //     else if(month === 11){
        //         novArr.push(logs[r]);
        //     }
        //     else if(month === 1){
        //         decArr.push(logs[r]);
        //     }
        //   }

        let response = {
            january : janArr,
            february : febArr,
            march : marArr,
            april : aprArr,
            may : mayArr,
            june : junArr,
            july : julArr,
            august : augArr,
            september : sepArr,
            october : octArr,
            november : novArr,
            december : decArr
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Shift logs report overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};


exports.tenancyOverview = async (req, res, next) => {
    try {
        var { userId, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }


        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['reportTypeId'] = mongoose.Types.ObjectId('63c7ebdc0634271fc4aab9af');


        let currentYear = year.getFullYear();

        options['createdAt'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let reports = await Report.find(options);

          var janArr = [];
          var febArr = [];
          var marArr = [];
          var aprArr = [];
          var mayArr = [];
          var junArr = [];
          var julArr = [];
          var augArr = [];
          var sepArr = [];
          var octArr = [];
          var novArr = [];
          var decArr = [];

          
          for(var r = 0; r < reports.length; r++){
            let currentDate = new Date(reports[r].createdAt);
            let month = currentDate.getMonth();
            if(month === 1){
                janArr.push(reports[r]);
            }
            else if(month === 2){
                febArr.push(reports[r]);
            }
            else if(month === 3){
                marArr.push(reports[r]);
            }
            else if(month === 4){
                aprArr.push(reports[r]);
            }
            else if(month === 5){
                mayArr.push(reports[r]);
            }
            else if(month === 6){
                junArr.push(reports[r]);
            }
            else if(month === 7){
                julArr.push(reports[r]);
            }
            else if(month === 8){
                augArr.push(reports[r]);
            }
            else if(month === 9){
                sepArr.push(reports[r]);
            }
            else if(month === 10){
                octArr.push(reports[r]);
            }
            else if(month === 11){
                novArr.push(reports[r]);
            }
            else if(month === 1){
                decArr.push(reports[r]);
            }
          }

        let response = {
            january : {'check':janArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            february : {'check':febArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            march : {'check':marArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            april : {'check':aprArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            may : {'check':mayArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            june : {'check':junArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            july : {'check':julArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            august : {'check':augArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            september : {'check':sepArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            october : {'check':octArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            november : {'check':novArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0},
            december : {'check':decArr.length,'missedResp':0,'completedResp':0,'missedPercent':0,'compPercent':0}

        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Tenancy check report overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};


exports.complienceOverview = async (req, res, next) => {
    try {
        var { userId, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }


        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        options['reportTypeId'] = mongoose.Types.ObjectId('64293e6d58bceaa7b05aa504');


        let currentYear = year.getFullYear();

        options['createdAt'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let reports = await Report.find(options);
        console.log('repr',reports)
          var janArr = {outInduction:0,total:0,outLicense:0,location:0};
          var febArr = {outInduction:0,total:0,outLicense:0,location:0};
          var marArr = {outInduction:0,total:0,outLicense:0,location:0};
          var aprArr = {outInduction:0,total:0,outLicense:0,location:0};
          var mayArr = {outInduction:0,total:0,outLicense:0,location:0};
          var junArr = {outInduction:0,total:0,outLicense:0,location:0};
          var julArr = {outInduction:0,total:0,outLicense:0,location:0};
          var augArr = {outInduction:0,total:0,outLicense:0,location:0};
          var sepArr = {outInduction:0,total:0,outLicense:0,location:0};
          var octArr = {outInduction:0,total:0,outLicense:0,location:0};
          var novArr = {outInduction:0,total:0,outLicense:0,location:0};
          var decArr = {outInduction:0,total:0,outLicense:0,location:0};

          
          for(var r = 0; r < reports.length; r++){
            let outInduction=0
            let outLicense=0
            let out=0
            let yourDate = new Date(reports[r].createdAt);
            let today = new Date();
            if(yourDate < today){
                out+=1
            }
            let currentDate = new Date(reports[r].createdAt);
            let month = currentDate.getMonth();
            if(month === 1){
                // janArr.push(reports[r]);
                janArr.total+=1
                janArr.outInduction+=outInduction
                janArr.outLicense+= outLicense
            }
            else if(month === 2){
                febArr.total+=1
                febArr.outInduction+=outInduction
                febArr.outLicense+= outLicense
            }
            else if(month === 3){
                marArr.total+=1
                marArr.outInduction+=outInduction
                marArr.outLicense+= outLicense
            }
            else if(month === 4){
                aprArr.total+=1
                aprArr.outInduction+=outInduction
                aprArr.outLicense+= outLicense
            }
            else if(month === 5){
                mayArr.total+=1
                mayArr.outInduction+=outInduction
                mayArr.outLicense+= outLicense
            }
            else if(month === 6){
                junArr.total+=1
                junArr.outInduction+=outInduction
                junArr.outLicense+= outLicense
            }
            else if(month === 7){
                julArr.total+=1
                julArr.outInduction+=outInduction
                julArr.outLicense+= outLicense
            }
            else if(month === 8){
                augArr.total+=1
                augArr.outInduction+=outInduction
                augArr.outLicense+= outLicense
            }
            else if(month === 9){
                sepArr.total+=1
                sepArr.outInduction+=outInduction
                sepArr.outLicense+= outLicense
            }
            else if(month === 10){
                octArr.total+=1
                octArr.outInduction+=outInduction
                octArr.outLicense+= outLicense
            }
            else if(month === 11){
                novArr.total+=1
                novArr.outInduction+=outInduction
                novArr.outLicense+= outLicense
            }
            else if(month === 1){
                decArr.total+=1
                decArr.outInduction+=outInduction
                decArr.outLicense+= outLicense
            }
          }

        let response = {
            january : janArr,
            february : febArr,
            march : marArr,
            april : aprArr,
            may : mayArr,
            june : junArr,
            july : julArr,
            august : augArr,
            september : sepArr,
            october : octArr,
            november : novArr,
            december : decArr
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Compliance overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};


exports.inspectionOverview = async (req, res, next) => {
    try {
        var { userId, siteId, year} = req.query;
        var options = {};
        if(userId){
            options['userId'] = mongoose.Types.ObjectId(userId);
        }
        if(siteId){
            options['siteId'] = mongoose.Types.ObjectId(siteId);
        }


        if(year){
            year = new Date(year + '-01-01');
        }
        else{
            year = new Date();
        }

        // options['reportTypeId'] = mongoose.Types.ObjectId('64293e6d58bceaa7b05aa504');


        let currentYear = year.getFullYear();

        options['createdAt'] = { $gte : `${currentYear}-01-01` , $lte : `${currentYear}-12-31` };


        let reports = await Report.find(options);

          var janArr = [];
          var febArr = [];
          var marArr = [];
          var aprArr = [];
          var mayArr = [];
          var junArr = [];
          var julArr = [];
          var augArr = [];
          var sepArr = [];
          var octArr = [];
          var novArr = [];
          var decArr = [];

          
          for(var r = 0; r < reports.length; r++){
            let currentDate = new Date(reports[r].createdAt);
            let month = currentDate.getMonth();
            if(month === 1){
                janArr.push(reports[r]);
            }
            else if(month === 2){
                febArr.push(reports[r]);
            }
            else if(month === 3){
                marArr.push(reports[r]);
            }
            else if(month === 4){
                aprArr.push(reports[r]);
            }
            else if(month === 5){
                mayArr.push(reports[r]);
            }
            else if(month === 6){
                junArr.push(reports[r]);
            }
            else if(month === 7){
                julArr.push(reports[r]);
            }
            else if(month === 8){
                augArr.push(reports[r]);
            }
            else if(month === 9){
                sepArr.push(reports[r]);
            }
            else if(month === 10){
                octArr.push(reports[r]);
            }
            else if(month === 11){
                novArr.push(reports[r]);
            }
            else if(month === 1){
                decArr.push(reports[r]);
            }
          }

          let response = {
            january : {'incident':janArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            february : {'incident':febArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            march : {'incident':marArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            april : {'incident':aprArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            may : {'incident':mayArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            june : {'incident':junArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            july : {'incident':julArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            august : {'incident':augArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            september : {'incident':sepArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            october : {'incident':octArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            november : {'incident':novArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0},
            december : {'incident':decArr.length,'fireAlarm':0,'tearPass':0,'hazard':0,'vandalism':0,'breakIn':0,'bomb':0,'injury':0,'periodic':0,'suspecious':0,'loss':0,'theft':0,'firstAid':0}
        }
        
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Inspection & report overview retrieved successfully.', data: response});
    } catch (error) {
        next(error);
    }
};