
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
const { ConnectionStates } = require('mongoose');
const Reports = require('../../models/report.type.model');
const Tenancy = require('../../models/tenancy.check.model');
const {createTime, convertMsToHM} = require("../../utils/helper")

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
        clockins = await Shift.find({ siteId: req.user.siteId._id, 'inOut': 'IN', 'createdAt': { '$gte': startDate, '$lte': endDate }, })
        liveView.shiftLogs = await ShiftLogs.find({ shiftId: { $in: clockins } }).count()
        breakReport = await Reports.aggregate([
            {
                $match: { siteId: req.user.siteId._id, name: { $regex: /^break/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^fire/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^injury/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^bomb/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^hazard/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^vandalism/i }, 'createdAt': { '$gte': new Date(startDate), '$lte': new Date(endDate) } }
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
        clockins = await Shift.find({ siteId: req.user.siteId._id, 'inOut': 'IN' })
        liveView.shiftLogs = await ShiftLogs.find({ shiftId: { $in: clockins } }).count()
        breakReport = await Reports.aggregate([
            {
                $match: { siteId: req.user.siteId._id, name: { $regex: /^break/i } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^fire/i } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^injury/i } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^bomb/i } }
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^hazard/i }}
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
                $match: { siteId: req.user.siteId._id, name: { $regex: /^vandalism/i } }
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

    liveView.tearpassing = 0;
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
    console.log(req.params.locId);
    console.log('Site', req.locals.site);
    const {startDate, endDate} = req.query;
    let totalShifts = await Shift.find({siteId:req.locals.site, clockInTime: {$ne : null}, clockOutTime: {$ne : null}, startDate,endDate}).populate('breaks')
    let casualShifts = await CasualShift.find({siteId:req.locals.site, startDate: {$ne : null}, endDate: {$ne : null}, startDate : startDate, endDate : endDate})
    let allShifts = await Shift.find({siteId:req.locals.site, totalFailedCheckIn : null, startDate, endDate})
    let allReports = await Report.find({startDate,endDate});
    var totalCompletedHour = 0;
    var totalCompletedCasualHour = 0;
    var totalBreakTime = 0;
    var totalLostTime = 0;
    var finalMilliseconds = 0;
    var finalClockMilliseconds = 0;
    var totalFailedCheckIn = allShifts ? allShifts.length : 0;
    var fireAlarmCount = allReports.map((item) => {
        if(item.Report === '62d1c6fdaf2af230b076ae8d'){
            return item
        }
    }).length;

    var breakInReportedCount = allReports.map((item) => {
        if(item.Report === '62d1c6edaf2af230b076ae8a'){
            return item
        }
    }).length;

    var incidentReportedCount = allReports.map((item) => {
        if(item.Report === '62d1c6d5af2af230b076ae87'){
            return item
        }
    }).length;

    var bombThreatReportedCount = allReports.map((item) => {
        if(item.Report === '62d1c6beaf2af230b076ae84'){
            return item
        }
    }).length;


    var suspiciousActivityCount = allReports.map((item) => {
        if(item.Report === '62d1c67faf2af230b076ae81'){
            return item
        }
    }).length;

    var otherProfileCount = allReports.map((item) => {
        if(item.Report !== '62d1c67faf2af230b076ae81' && item.Report !== '62d1c6beaf2af230b076ae84' && item.Report !== '62d1c6d5af2af230b076ae87' && item.Report !== '62d1c6edaf2af230b076ae8a' && item.Report !== '62d1c6fdaf2af230b076ae8d' ){
            return item
        }
    }).length;


    totalShifts.forEach(item => {
        var startTime = item.clockInTime.slice(0, -2) + ' ' + item.clockInTime.slice(-2);
        var endTime = item.clockOutTime.slice(0, -2) + ' ' + item.clockOutTime.slice(-2);
        startTime = createTime(item.shiftDate, convertTime12to24(startTime))
        endTime = createTime(item.shiftDate, convertTime12to24(endTime))
        newStartMillisecond = new Date(startTime).getTime()
        newEndMillisecond = new Date(endTime).getTime()
        totalCompletedHour += endMillisecond - startMillisecond;

        // lost time
        let lostStartTime = new Date(item.startTime).getTime()
        let lostEndTime = new Date(item.endTime).getTime()
        finalMilliseconds += lostEndTime - listStartTime;

        let lostStartClockTime = new Date(item.clockInTime).getTime()
        let lostEndClockTime = new Date(item.clockOutTime).getTime()
        finalClockMilliseconds += lostEndClockTime - lostStartClockTime;

        item.breaks.forEach(element => {
            var startBreakTime = element.startTime.slice(0, -2) + ' ' + element.startTime.slice(-2);
            var endBreakTime = element.endTime.slice(0, -2) + ' ' + element.endTime.slice(-2);
            startBreakTime = createTime(element.createdAt, convertTime12to24(startBreakTime))
            endBreakTime = createTime(element.createdAt, convertTime12to24(endBreakTime))
            newStartBreakMillisecond = new Date(startBreakTime).getTime()
            newEndBreakMillisecond = new Date(endBreakTime).getTime()
            totalBreakTime += newEndBreakMillisecond - newStartBreakMillisecond;
        })
    })
    totalShifts = totalShifts !== 0 ? convertMsToHM(totalCompletedHour) : 0;
    totalBreakTime = totalBreakTime !== 0 ? convertMsToHM(totalBreakTime) : 0;
    totalLostTime  = totalLostTime !== 0 ? ((finalMilliseconds - finalClockMilliseconds) > 0 ? convertMsToHM(finalMilliseconds - finalClockMilliseconds) : 0) : 0;

    casualShifts.forEach(item => {
        var startTime = item.startTime.slice(0, -2) + ' ' + item.startTime.slice(-2);
        var endTime = item.endTime.slice(0, -2) + ' ' + item.endTime.slice(-2);
        startTime = createTime(item.startDate, convertTime12to24(startTime))
        endTime = createTime(item.startDate, convertTime12to24(endTime))
        newStartMillisecond = new Date(startTime).getTime()
        newEndMillisecond = new Date(endTime).getTime()
        totalCompletedCasualHour += endMillisecond - startMillisecond;
    })
    totalCompletedCasualHour = totalCompletedCasualHour !== 0 ? convertMsToHM(totalCompletedCasualHour) : 0;

    var output = [];
    output.push({id : 1, title : 'Total Fixed Labour Hours', count : totalCompletedHour})
    output.push({id : 2, title : 'Total Casual Labour Hours', count : totalCompletedCasualHour})
    output.push({id : 3, title : 'Total Lost Time', count : totalLostTime})
    output.push({id : 4, title : 'Total Failed Check-Ins', count : totalFailedCheckIn})
    output.push({id : 5, title : 'Fire Alarms Reported', count : fireAlarmCount})
    output.push({id : 6, title : 'Break-Ins Reported', count : breakInReportedCount})
    output.push({id : 7, title : 'Incidents Reported', count : incidentReportedCount})
    output.push({id : 8, title : 'Bomb Threats Reported', count : bombThreatReportedCount})
    output.push({id : 9, title : 'Suspicious Activity Reported', count : suspiciousActivityCount})
    output.push({id : 10, title : 'Other Profile', count : otherProfileCount})

    var data = {
        workforce : [
            {title : 'Total Roasted Shifts Created', count : 0},
            {title : 'Total Casual Shifts Created', count : 0},
            {title : 'Total Alarm Responses Created', count : 0},
            {title : 'Roasted Shifts Clock Ins', count : 0},
            {title : 'Casual Shifts Clock Ins', count : 0},
            {title : 'Alarm Response Check Ins', count : 0},
            {title : 'Roasted Shifts Late Clock Ins', count : 0},
            {title : 'Casual Shifts Late Clock Ins', count : 0},
            {title : 'Alarm Response Late Check Ins', count : 0},
            {title : 'Roasted Shifts Missed Clock Ins', count : 0},
            {title : 'Casual Shifts Missed Clock Ins', count : 0},
            {title : 'Alarm Response Missed Clock Ins', count : 0},
            {title : 'Roasted Shifts Incorrect Location Check Ins', count : 0},
            {title : 'Casual Shifts Incorrect Location Check Ins', count : 0},
            {title : 'Alarm Response Incorrect Location Check Ins', count : 0},
        ],
        operational : [
            {title : 'Scheduled Tasks', count : 0},
            {title : 'Completed Tasks', count : 0},
            {title : 'Missed Tasks', count : 0},
            {title : 'Shift Logs Received', count : 0},
            {title : 'Tendency Check Completed', count : 0},
            {title : 'Notifications Send', count : 0},
            {title : 'TimeSheets Submitted', count : 0},
            {title : 'TimeSheets Approved', count : 0},
            {title : 'TimeSheets Pending', count : 0}
        ],
        compliance :  [
            {title : 'Number Of Resources At This Site', count : 0},
            {title : 'Out Of Date Inductions', count : 0},
            {title : 'Out Of Date Licenses', count : 0}
        ],
        inspections : [
            {title : 'Fire Alarm Reports', count : 0},
            {title : 'Incident Reports', count : 0},
            {title : 'Trespassing Reports', count : 0},
            {title : 'Hazards Reports', count : 0},
            {title : 'Vandalism Reports', count : 0},
            {title : 'Break In Reports', count : 0},
            {title : 'Bomb Threat Reports', count : 0},
            {title : 'Injury Reports', count : 0},
            {title : 'Periodic Inspection Reports', count : 0},
            {title : 'Suspicious Activity Reports', count : 0},
            {title : 'Lost Priority Reports', count : 0},
            {title : 'Theft Reports', count : 0},
            {title : 'First Aid Reports', count : 0}
        ]
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
