
const httpStatus = require('http-status');
const { omit } = require('lodash');
const moment = require('moment-timezone');
const Site = require('../../models/site.model');
const exceljs = require('exceljs');
const User = require('../../models/user.model');
const Shift = require('../../models/shift.model');
const CasualShift = require('../../models/casual.shift.model');
const RoasterShift = require('../../models/site.roster.model');
const Report = require('../../models/report.model')
const ShiftLogs = require('../../models/shift.logs.model');
const ClockData = require('../../models/clock.data.model');
const Alarm = require('../../models/alarm.model')
const { ConnectionStates } = require('mongoose');
const Reports = require('../../models/report.type.model');
const Tenancy = require('../../models/tenancy.check.model');
const License = require('../../models/user.license.model');
const Timesheet = require('../../models/timesheet.model')
const Tendency = require('../../models/tenancy.check.model');
const ShiftLog = require('../../models/shift.logs.model')
const Task = require('../../models/task.model')

const {createTime, convertMsToHM} = require("../../utils/helper")
const {convertTime12to24, formatAMPM} =  require('../../utils/helper');
const notificationModel = require('../../models/notification.model');

const Dynamic = require('../../models/dynamic.site.overview.model')

exports.load = async (req, res, next, id) => {
    try {
        const site = await Site.get(id);
        req.locals = { site };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.getLiveView = async (req, res, next) => {
    let liveView = {}
    let clockins;
    let breakReport;
    let fire;
    let injury;
    let bomb;
    let hazard;
    let vandal;
    if (req.query.date) {
        const startDate = moment(req.query.date)
        const endDate = moment(req.query.date).add(1, "days")
        clockins = await Shift.find({ siteId: req.locals.site._id, 'inOut': 'IN', 'shiftDate': { '$gte': startDate, '$lte': endDate }, })
        liveView.shiftLogs = await ShiftLogs.find({ shiftId: { $in: clockins } }).count()
        // clockins.map(e=>{})
        breakReport = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^break/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        fire = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^fire/i },  }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        injury = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^injury/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        bomb = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^bomb/i },}
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        hazard = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^hazard/i }, }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        vandal = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^vandalism/i },}
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
    } else {
        clockins = await Shift.find({ siteId: req.locals.site._id, 'inOut': 'IN' })
        liveView.shiftLogs = await ShiftLogs.find({ shiftId: { $in: clockins } }).count()
        breakReport = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^break/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        fire = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^fire/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "reportTypeId",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        console.log('fire',fire)
        injury = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^injury/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        bomb = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^bomb/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        hazard = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^hazard/i }}
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
        vandal = await Reports.aggregate([
            {
                $match: { siteId: req.locals.site._id, name: { $regex: /^vandalism/i } }
            },
            {
                $lookup: {
                    "from": "reports",
                    "localField": "_id",
                    "foreignField": "reportTypeId",
                    "as": "checkpoints",
                }
            },
            {
                $addFields: { 'totalreport': { $size: "$checkpoints" } }
            }
        ])
    }

    liveView.trespassing = 0;
    liveView.lateClock = 0;
    liveView.hazards = hazard[0]?.totalreport || 0;
    liveView.vandalism = vandal[0]?.totalreport || 0;
    liveView.failedClock = 0;
    liveView.injury = injury[0]?.totalreport || 0;
    liveView.breakIns = breakReport[0]?.totalreport || 0;
    liveView.tenancyCheck = 0;
    liveView.fireAlarm = fire[0]?.totalreport || 0;
    liveView.bombThreat = bomb[0]?.totalreport || 0;;
    liveView.clockins = clockins.length
    res.json({ code: 201, message: 'Site list retrieved successfully.', data: liveView });
}

exports.getOverview = async (req, res, next) => {
    console.log('Param Site',req.params.locId);
    console.log('Site', req.locals.site._id);
    const {startDate, endDate} = req.query;
    var totalShifts = null;
    var casualShifts = [] ;
    var allShifts = [];
    var allReports = null;
    var licenses = null;
    var notifications = null;
    var timeSheets = null;
    var resources = await Site.findOne({_id : req.locals.site._id });
    var tendencies = null;
    var shiftLogs = null;
    var tasks = null;
    var roasterShifts = [];
    var alarms = null;
    var completedTask = null;
    if(startDate &&  endDate){
        totalShifts = await Shift.find({siteId:req.locals.site._id, startDate : {$gte : startDate},endDate : {$lte : endDate}}).populate('breaks');
        casualShifts = await Shift.find({siteId:req.locals.site._id, casualShiftId : {$ne : null}, startDate : {$gte : startDate},endDate : {$lte : endDate}});
        roasterShifts = await Shift.find({siteId:req.locals.site._id, rosterId : {$ne : null}, startDate : {$gte : startDate}, endDate : {$lte : endDate}})
        allShifts = await Shift.find({siteId:req.locals.site._id, totalFailedCheckIn : null, startDate : {$gte : startDate},endDate : {$lte : endDate}});
        allReports = await Report.find({siteId:req.locals.site._id, createdAt : {$gte : startDate, $lte : endDate}});
        licenses = await License.find({expiryDate : {$gte : startDate, $lte : endDate}});
        notifications =  await notificationModel.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}});
        timeSheets = await Timesheet.find({siteId : req.locals.site._id,createdAt : {$gte : startDate, $lte : endDate}});
        tendencies = await Tendency.find({shiftStatus : "Completed",createdAt : {$gte : startDate, $lte : endDate}});
        shiftLogs = await ShiftLog.find({createdAt : {$gte : startDate, $lte : endDate}});
        tasks = await Task.find({dueDate : {$gte : startDate, $lte : endDate}});
        alarms = await Alarm.find({sites : req.locals.site._id, dueDate : {$gte : startDate, $lte : endDate}});
    }
    else if(startDate && !endDate){
        totalShifts = await Shift.find({siteId:req.locals.site._id, startDate : {$gte : startDate}}).populate('breaks');
        casualShifts = await Shift.find({siteId:req.locals.site._id,casualShiftId : {$ne : null}, startDate: {$ne : null}, endDate: {$ne : null}, startDate : {$gte : startDate}});
        roasterShifts = await Shift.find({siteId:req.locals.site._id,rosterId : {$ne : null}, startDate : {$gte : startDate}})
        allShifts = await Shift.find({siteId:req.locals.site._id, totalFailedCheckIn : null, startDate : {$gte : startDate}});
        allReports = await Report.find({siteId:req.locals.site._id,createdAt : {$gte : startDate}});
        licenses = await License.find({expiryDate : {$gte : startDate}});
        notifications =  await notificationModel.find({startDate : {$gte : startDate}});
        timeSheets = await Timesheet.find({siteId : req.locals.site._id,createdAt : {$gte : startDate}});
        tendencies = await Tendency.find({shiftStatus : "Completed",createdAt : {$gte : startDate}});
        shiftLogs = await ShiftLog.find({createdAt : {$gte : startDate}});
        tasks = await Task.find({dueDate : {$gte : startDate}});
        alarms = await Alarm.find({sites : req.locals.site._id, dueDate : {$gte : startDate}});
    }
    else if(!startDate && endDate){
        totalShifts = await Shift.find({siteId:req.locals.site._id, endDate : {$gte : endDate}}).populate('breaks');
        casualShifts = await Shift.find({siteId:req.locals.site._id, casualShiftId : {$ne : null}, startDate: {$ne : null}, endDate: {$ne : null}, endDate : {$gte : endDate}});
        roasterShifts = await Shift.find({siteId:req.locals.site._id,rosterId : {$ne : null}, endDate : {$lte : endDate}})
        allShifts = await Shift.find({siteId:req.locals.site._id, totalFailedCheckIn : null, endDate : {$gte : endDate}});
        allReports = await Report.find({siteId:req.locals.site._id, createdAt : {$lte : endDate}});
        licenses = await License.find({expiryDate : {$lte : endDate}});
        notifications =  await notificationModel.find({endDate : {$lte : endDate}});
        timeSheets = await Timesheet.find({siteId : req.locals.site._id,createdAt : { $lte : endDate}});
        tendencies = await Tendency.find({shiftStatus : "Completed",createdAt : {$lte : endDate}});
        shiftLogs = await ShiftLog.find({createdAt : {$lte : endDate}});
        tasks = await Task.find({dueDate : {$lte : endDate}})
        alarms = await Alarm.find({sites : req.locals.site._id, dueDate : { $lte : endDate}});
    }
    else{
        totalShifts = await Shift.find({siteId:req.locals.site._id}).populate('breaks');
        casualShifts = await Shift.find({siteId:req.locals.site._id,casualShiftId : {$ne : null}, startDate: {$ne : null}, endDate: {$ne : null}});
        roasterShifts = await Shift.find({siteId:req.locals.site._id, rosterId : {$ne : null},})
        allShifts = await Shift.find({siteId:req.locals.site._id, totalFailedCheckIn : null});
        allReports = await Report.find({siteId:req.locals.site._id});
        licenses = await License.find({ expiryDate : {$lt : new Date()}});
        notifications =  await notificationModel.find({});
        timeSheets = await Timesheet.find({siteId : req.locals.site._id});
        tendencies = await Tendency.find({shiftStatus : "Completed"});
        shiftLogs = await ShiftLog.find({});
        tasks = await Task.find({siteId:req.locals.site._id})
        completedTask = await Task.find({siteId:req.locals.site._id,status:"closed"})
        // tasks = await Task.find({dueDate : {$lte : new Date()}})
        alarms = await Alarm.find({sites : req.locals.site._id});
    }
    // console.log('aa',tasks.length,completedTask.length)
    var totalCompletedHour = 0;
    var totalCompletedCasualHour = 0;
    var totalBreakTime = 0;
    var totalLostTime = 0;
    var finalMilliseconds = 0;
    var finalClockMilliseconds = 0;
    var totalFailedCheckIn = allShifts ? allShifts.length : 0;
    console.log('aaaa',allReports)
    var fireAlarmCount = allReports.filter((item) => {
        console.log('ii',item)
        if(item.reportTypeId == '63de643044b3381cb833abe3'){
            console.log('in report',item)
            return item
        }
    }).length;

    var tresPassingReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe5'){
            console.log('in report',item)
            return item
        }
    }).length;

    var hazardReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe6'){
            return item
        }
    }).length;

    var vandalismReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe7'){
            return item
        }
    }).length;

    var breakInReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe8'){
            return item
        }
    }).length;

    var incidentReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe4'){
            return item
        }
    }).length;

    var bombThreatReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abe9'){
            return item
        }
    }).length;

    var injuryReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abea'){
            return item
        }
    }).length;

    var periodicReportedCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abeb'){
            return item
        }
    }).length;

    var suspiciousActivityCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abec'){
            return item
        }
    }).length;

    var lostPropertyCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abed'){
            return item
        }
    }).length;

    var theftCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abee'){
            return item
        }
    }).length;

    var firstAidCount = allReports.filter((item) => {
        if(item.reportTypeId == '63de643044b3381cb833abef'){
            return item
        }
    }).length;

    var outOutDateCount = allReports.filter((item) => {
        let yourDate = new Date(item.createdAt);
        let today = new Date();
        if(yourDate < today){
            return item
        }
    }).length;

    var timeSubmitted = timeSheets.filter((item) => {
        if(item.statusId === '62a8eb3bfc9fbe1ba86e134d'){
            return item
        }
    }).length;

    var timePending = timeSheets.filter((item) => {
        if(item.statusId === '62e814c2049bd2e0a191399f'){
            return item
        }
    }).length;

    var timeApproved = timeSheets.filter((item) => {
        if(item.Report === '62ad8408ae2a0f2b4881335f'){
            return item
        }
    }).length;

    var inspectionReports = [
        {title : 'Fire Alarm Reports', count : fireAlarmCount},
        {title : 'Incident Reports', count : incidentReportedCount},
        {title : 'Trespassing Reports', count : tresPassingReportedCount},
        {title : 'Hazards Reports', count : hazardReportedCount},
        {title : 'Vandalism Reports', count : vandalismReportedCount},
        {title : 'Break In Reports', count : breakInReportedCount},
        {title : 'Bomb Threat Reports', count : bombThreatReportedCount},
        {title : 'Injury Reports', count : injuryReportedCount},
        {title : 'Periodic Inspection Reports', count : periodicReportedCount},
        {title : 'Suspicious Activity Reports', count : suspiciousActivityCount},
        {title : 'Lost Priority Reports', count : lostPropertyCount},
        {title : 'Theft Reports', count : theftCount},
        {title : 'First Aid Reports', count : firstAidCount}
    ];
    // console.log('on pr',fireAlarmCount,inspectionReports)

    var dynamics = [];

    if(req.user.login_as  === 'CLIENT' || req.user.login_as === 'COMPANY_CLIENT' || req.user.login_as === 'COMPANY_USER'){
        dynamics = await Dynamic.find({siteId : req.locals.site._id,role : {$in : ['CLIENT','COMPANY_CLIENT','COMPANY_USER']} })
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
    }
    else{
        dynamics = await Dynamic.find({siteId : req.locals.site._id,role : 'SUPERADMIN'} )
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
    }


    dynamics.forEach(element =>{
       var name = element.reportTypeId.name;
       var myCount = allReports.map((item) => {
            if(item.Report !== element.reportTypeId._id ){
                return item
            }
        }).length;

        inspectionReports.push({title : name, count : myCount})
    })
    // console.log('ddy',dynamics,allReports)

    var totalClockIn = 0
    var totalLateClockIn = 0;
    var totalMissClockIn = 0;
    if(totalShifts)
    {
        totalShifts.forEach(item => {
            var clockInTime = false
            if(item.clockInTime !== null && item.clockInTime !== ''){
                totalClockIn = totalClockIn + 1;
                clockInTime = true
            }
    
            if(clockInTime === true){
                let shiftDate = item.shiftDate;
                let startTime = item.startTime;
                let checkTime = formatAMPM(item.clockInTime);
                startTime = `${startTime.slice(0,4)} ${startTime.slice(-2)}`;
                let newDate = new Date(createTime(shiftDate , startTime))
                let clockInDate = new Date(createTime(shiftDate , checkTime))
                newDate = newDate.setMinutes( newDate.getMinutes() + 15 )
                if(clockInDate.getTime() > newDate){
                    totalLateClockIn = totalLateClockIn + 1;
                }
            }
    
            if(item.clockInTime === null || item.clockInTime === ''){
                totalMissClockIn = totalMissClockIn + 1;
            }        
        })
    }

    var casualClockIn = 0
    var casualLateClockIn = 0;
    var casualMissClockIn = 0;

    if(casualShifts){
        casualShifts.forEach(item => {
            var clockInTime = false
            if(item.clockInTime !== null && item.clockInTime !== ''){
                casualClockIn = casualClockIn + 1;
                clockInTime = true
            }
    
            if(clockInTime === true){
                let shiftDate = item.shiftDate;
                let startTime = item.startTime;
                let checkTime = formatAMPM(item.clockInTime);
                startTime = `${startTime.slice(0,4)} ${startTime.slice(-2)}`;
                let newDate = new Date(createTime(shiftDate , startTime))
                let clockInDate = new Date(createTime(shiftDate , checkTime))
                newDate = newDate.setMinutes( newDate.getMinutes() + 15 )

                if(clockInDate.getTime() > newDate){
                    casualLateClockIn = casualLateClockIn + 1;
                }
            }
    
            if(item.clockInTime === null || item.clockInTime === ''){
                casualMissClockIn = casualMissClockIn + 1;
            }
        })
    }
    
    var rosterClockIn = 0
    var rosterLateClockIn = 0;
    var rosterMissClockIn = 0;
  
    if(roasterShifts){
        roasterShifts.forEach(item => {
            var clockInTime = false
            if(item.clockInTime !== null && item.clockInTime !== ''){
                rosterClockIn = rosterClockIn + 1;
                clockInTime = true
            }
    
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
        })
    
    }
    let closedTask = 0
    tasks.map(e=>{
        e.status==='closed'?closedTask+=1:closedTask+=0
    })
    var data = {
        workforce : [
            {title : 'Total Rostered Shifts Created', count : roasterShifts ? roasterShifts.length : 0},
            {title : 'Total Casual Shifts Created', count : casualShifts ? casualShifts.length : 0},
            {title : 'Total Alarm Responses Created', count : alarms ? alarms.length : 0},

            {title : 'Rostered Shifts Clock Ins', count : rosterClockIn},
            {title : 'Casual Shifts Clock Ins', count : casualClockIn},
            {title : 'Alarm Response Check Ins', count : 0},

            {title : 'Rostered Shifts Late Clock Ins', count : rosterLateClockIn},
            {title : 'Casual Shifts Late Clock Ins', count : casualLateClockIn},
            {title : 'Alarm Response Late Check Ins', count : 0},

            {title : 'Rostered Shifts Missed Clock Ins', count : rosterMissClockIn},
            {title : 'Casual Shifts Missed Clock Ins', count : casualMissClockIn},
            {title : 'Alarm Response Missed Clock Ins', count : 0},

            {title : 'Rostered Shifts Incorrect Location Check Ins', count : 0},
            {title : 'Casual Shifts Incorrect Location Check Ins', count : 0},
            {title : 'Alarm Response Incorrect Location Check Ins', count : 0},
        ],
        operational : [
            {title : 'Scheduled Tasks', count : tasks ? tasks.length : 0},
            {title : 'Completed Tasks', count : completedTask? completedTask.length:0},
            {title : 'Missed Tasks', count : 0},
            {title : 'Shift Logs Received', count : shiftLogs ? shiftLogs.length : 0},
            {title : 'Tendency Check Completed', count : tendencies ? tendencies.length : 0},
            {title : 'Notifications Send', count : notifications ? notifications.length : 0},
            {title : 'TimeSheets Submitted', count : timeSubmitted},
            {title : 'TimeSheets Approved', count : timeApproved},
            {title : 'TimeSheets Pending', count : timePending}
        ],
        compliance :  [
            {title : 'Number Of Resources At This Site', count : resources ? resources.team.length : 0},
            {title : 'Out Of Date Inductions', count : outOutDateCount.length ? outOutDateCount.length : 0},
            {title : 'Out Of Date Licenses', count : licenses ? licenses.length : 0}
        ],
        inspections : inspectionReports
    };

    res.json({ code: 201, message: 'Site Overview retrieved successfully.', data : data });

}

exports.addTeamMember = async (req, res, next) => {
    try {
        let user = await User.findOne({ 'email': req.body.email })
        if (!user) {
            return res.json({ code: 404, message: "User not found." })
        }
        req.locals.site.team.push(user)
        req.locals.site.save()
        res.json({ code: 201, message: 'User added successfully.' });
    } catch (error) {
        next(error)
    }
}

exports.getSiteTeam = async (req, res, next) => {
    try {
        let users = await Site.findById(req.params.locId).populate([
            {
                path: 'team',
                select: '-password'
            }
        ])
        res.json({ code: 201, message: 'Site list retrieved successfully.', data: users.team });

    } catch (error) {
        next(error)
    }


}
const lateClockInOut = (startEndTime, clockinOut) => {
    var time = moment(startEndTime, 'h:mma');
    var inOutTime = moment(clockinOut, 'h:mma');
    return moment(inOutTime).isAfter(time);
}

exports.allClockInOut = async (req, res, next) => {
    try {
        var allLateClockInOut = [];
        const {startDate, endDate, siteId} = req.query
        var list = null;
        if(startDate && endDate && siteId){
            console.log('ONE')
            list = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && endDate && !siteId){
            console.log('TWO')
            list = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && !endDate && siteId){
            console.log('THREE')
            list = await Shift.find({startDate : {$gte : startDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && endDate && siteId){
            console.log('FOUR')
            list = await Shift.find({endDate : {$lte : endDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && !endDate && !siteId){
            console.log('FIVE')
            list = await Shift.find({startDate : {$gte : startDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && endDate && !siteId){
            console.log('SIX')
           list = await Shift.find({ endDate : {$lte : endDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && !endDate && siteId){
           console.log('SEVEN')
           list = await Shift.find({siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else{
           console.log('EIGHT')
           list = await Shift.find({}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        var inClock = [];
        var outClock = [];
        const clock = await ClockData.find({}).populate('userId');
        list.forEach((data) => {
            const lateClockIn = clock.filter((cl) => {
                const startTime = moment(data.startTime, 'HH:mm a').format('hh:mm').toString();
                const clockinTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
                const isLateIn = lateClockInOut(startTime, clockinTime);
                if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateIn && (cl.type === 'clockout' || cl.type === 'clockin')) {
                    var obj = {};
                    obj.siteId = data.siteId;
                    obj.shiftId = data.shiftCode;
                    obj._id = cl._id;
                    obj.breakDuration = cl.breakDuration;
                    obj.status = cl.status;
                    obj.userId = cl.userId;
                    obj.type = cl.type;
                    obj.startDate = data.startDate;
                    obj.endDate = data.endDate;
                    obj.createdAt = cl.createdAt;
                    obj.updatedAt = cl.updatedAt;
                    allLateClockInOut.push(obj)
                    // inClock.push(obj)
                    return cl;
                }
            });
            // const lateClockOut = clock.filter( (cl) => {
            //     const clockinOutTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
            //     const endTime = moment(data.endTime, 'HH:mm a').format('hh:mm').toString();
            //     const isLateOut = lateClockInOut(endTime, clockinOutTime);
            //     if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateOut && cl.type === 'clockout') {
            //         var obj = cl;
            //         obj.siteId = data.siteId;
            //         obj.shift =  Shift.findOne({roasterId : cl.shiftId});
            //         outClock.push(obj)
            //         return cl;
            //     }
            // });
        });
        // allLateClockInOut.push(...[...inClock, ...outClock]);
        res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut});
    } catch (err) {
        next(err);
    }
}

exports.exportAllClockInOut = async (req, res, next) => {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        const allLateClockInOut = [];
        const list = await Shift.find({});
        const clock = await ClockData.find({})
        list.forEach((data) => {
            const lateClockIn = clock.filter((cl) => {
                const startTime = moment(data.startTime, 'HH:mm a').format('hh:mm').toString();
                const clockinTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
                const isLateIn = lateClockInOut(startTime, clockinTime);
                if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateIn && cl.type === 'clockin') {
                    return cl;
                }
            });
            const lateClockOut = clock.filter((cl) => {
                const clockinOutTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
                const endTime = moment(data.endTime, 'HH:mm a').format('hh:mm').toString();
                const isLateOut = lateClockInOut(endTime, clockinOutTime);
                if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateOut && cl.type === 'clockout') {
                    return cl;
                }
            });
            allLateClockInOut.push(...[...lateClockIn, ...lateClockOut]);
        });
        worksheet.columns = [
            { header: 'User Id', key: 'userId', width: 25 },
            { header: 'Shift Id', key: 'shiftId', width: 25 },
            { header: 'Break Duration', key: 'breakDuration', width: 25 },
            { header: 'Status', key: 'status', width: 25 },
            { header: 'Type', key: 'type', width: 25 },
        ];
        allLateClockInOut.forEach((data) => worksheet.addRow(data));
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=LateClockInOut.xlsx`
        );
        return workbook.xlsx.write(res).then(() => res.status(200));

        // res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut });
    } catch (err) {
        next(err);
    }
}

getDates = async (startDate, stopDate) => {
    var dateArray = []
    var currentDate = moment(startDate)
    var stopDate = moment(stopDate)
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'days')
    }
    return dateArray
}

exports.failedCheckin = async (req, res, next) => {
    try {
        const allLateClockInOut = [];
        var list = null ;
        const {startDate, endDate, siteId} = req.query
        if(startDate && endDate && siteId){
            console.log('ONE')
            list = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && endDate && !siteId){
            console.log('TWO')
            list = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && !endDate && siteId){
            console.log('THREE')
            list = await Shift.find({startDate : {$gte : startDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && endDate && siteId){
            console.log('FOUR')
            list = await Shift.find({endDate : {$lte : endDate}, siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(startDate && !endDate && !siteId){
            console.log('FIVE')
            list = await Shift.find({startDate : {$gte : startDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && endDate && !siteId){
            console.log('SIX')
           list = await Shift.find({ endDate : {$lte : endDate}}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else if(!startDate && !endDate && siteId){
           console.log('SEVEN')
           list = await Shift.find({siteId : siteId}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        else{
           console.log('EIGHT')
           list = await Shift.find({}).populate('role userId siteId assignedUser').sort({ createdAt: -1 });
        }
        // const list = await Shift.find({}).populate('rosterId userId siteId');
        for (let i = 0; i < list.length; i++) {
            let data = list[i]
            if (data.startDate) {
                let dateArr = await getDates(data.startDate, data.endDate);
                const clock = await ClockData.aggregate([
                    {
                        '$match': {
                            'createdAt': { '$gte': data.startDate, '$lte': data.endDate },
                            'type': 'clockin'
                        }
                    },
                    {
                        '$group': {
                            '_id': null,
                            'dates': { '$push': { '$dateToString': { 'date': '$createdAt', 'format': '%Y-%m-%d' } } }
                        }
                    },
                    {
                        '$project': {
                            'missingDates': { '$setDifference': [dateArr, '$dates'] },
                            'shiftId': 1
                        }
                    }
                ])
                if (clock[0]?.missingDates)
                    allLateClockInOut.push({ shift: data, failedDate: clock[0]?.missingDates })
            }
        }
        res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut });
    } catch (err) {
        next(err);
    }
}

exports.exportFailedCheckin = async (req, res, next) => {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        const allLateClockInOut = [];
        const list = await Shift.find({}).populate('rosterId userId siteId');
        for (let i = 0; i < list.length; i++) {

            let data = list[i]

            if (data.startDate) {
                let dateArr = await getDates(data.startDate, data.endDate);
                const clock = await ClockData.aggregate([
                    {
                        '$match': {
                            'createdAt': { '$gte': data.startDate, '$lte': data.endDate },
                            'type': 'clockin'
                        }
                    },
                    {
                        '$group': {
                            '_id': null,
                            'dates': { '$push': { '$dateToString': { 'date': '$createdAt', 'format': '%Y-%m-%d' } } }
                        }
                    },
                    {
                        '$project': {
                            'missingDates': { '$setDifference': [dateArr, '$dates'] },
                            'shiftId': 1
                        }
                    }
                ])
                if (clock[0]?.missingDates)
                    allLateClockInOut.push({ shift: data._id, failedDate: clock[0]?.missingDates })
            }
        }
        worksheet.columns = [
            { header: 'Shift Id', key: 'shift', width: 30 },
            { header: 'Failed Date', key: 'failedDate', width: 50 },
        ];
        allLateClockInOut.forEach((data) => worksheet.addRow(data));
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=failedClockedIn.xlsx`
        );
        return workbook.xlsx.write(res).then(() => res.status(200));
    } catch (err) {
        next(err);
    }
}

exports.exportMe = async (req, res, next) => {
    res.json({ code: 201, message: 'Testing', data: {} });
    // res.pdf(`
    //     <img src="https://cdn.firstcry.com/education/2022/04/29104112/1115777186.jpg />
    // `, {
    //     waitForNetworkIdle: true,
    // });
}
