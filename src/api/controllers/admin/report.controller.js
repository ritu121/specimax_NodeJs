const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { omit } = require('lodash');
const moment = require('moment-timezone');
const exceljs = require('exceljs')
const Report = require('../../models/report.model');
const Task = require('../../models/task.model');
const Shift = require('../../models/shift.model');
const CasualShift = require('../../models/casual.shift.model');
const Clock = require('../../models/clock.data.model');
const ReportType = require('../../models/report.type.model');
// const Report = require('../../models/report.model');
const ReportQuestionAnswer = require('../../models/report.question.answer.model')
const multer = require('multer');
const Site = require('../../models/site.model');


exports.load = async (req, res, next, id) => {
  try {
    const report = await Report.get(id);
    req.locals = { report };
    return next();
  } catch (error) {
    return next(error);
  }
};


exports.get = (req, res) => res.json({ code: 200, message: 'Report list retrieved successfully.', data: req.locals.report.transform() });


exports.loggedIn = (req, res) => res.json(req.report.transform());




/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let allReports = []
    let reportType = await ReportType.find({ siteId: req.user.sites }, { _id: 1 })
    let reports = await Report.find({ reportTypeId: { $in: reportType } })
    let tasks = await Task.find({ siteId: req.user.sites })
    // let reports = await ReportType.aggregate([
    //     {
    //         $match:{siteId:{$in:req.user.sites}}
    //     },
    //     {
    //         $lookup: {
    //             "from": "reports",
    //             "localField": "_id",
    //             "foreignField": "reportTypeId",
    //             "as": "reports",
    //         }
    //     },
    //     {"$unwind": {
    //         path: "$reports",
    //       } },
    //     {
    //         $lookup: {
    //             "from": "tasks",
    //             "localField": "siteId",
    //             "foreignField": "siteId",
    //             "as": "tasks",
    //         }
    //     },
    //     {
    //         $lookup: {
    //             "from": "tasks",
    //             "localField": "siteId",
    //             "foreignField": "siteId",
    //             "as": "tasks",
    //         }
    //     },
    //     {
    //         $project: {
    //             reports:1,
    //             tasks:1,
    //             _id:0
    //         }
    //     },

    //     // {"$unwind": {
    //     //     path: "$tasks",
    //     //     preserveNullAndEmptyArrays: true
    //     //   } },
    //     // {
    //     //     $group: {
    //     //         "_id": "$field._id",

    //     //         "tasks": {
    //     //           "$push": "$tasks"
    //     //         },
    //     //         "reports": {
    //     //             "$push": "$reports"
    //     //           }
    //     //       }
    //     // }
    // ])
    reports.map((status) => { status.transform(); allReports.push(status); });
    tasks.map((status) => { allReports.push(status); });
    // const transformedReports = reports.map((status) => {allReports.push(...status.reports);allReports.push(...status.tasks)});

    res.json({ code: 200, message: 'Report list retrieved successfully.', data: allReports });
  } catch (error) {
    next(error);
  }
};

exports.portfolioReports = async (req, res, next) => {
  let liveView = {}
  let sites = await Site.aggregate([
    { $match: { _id: { $in: req.user.sites } } },
    {
      $addFields: {
        totalFixedRosterHrs: 10,
        actualRosterHrs: 9,
        totalCasualHrs: 0,
        actualCasualHrs: 0,
        noOfShifts: 2,
        clockins: 5,
        clockouts: 5,
        forcedClockout: 2
      }
    },
    {
      $project:
      {
        checkpoints: 0
      }
    }
  ])
  res.json({ code: 201, message: 'Site list retrieved successfully.', data: sites });
}

const getHours = (start, end) => {
  const startTime = moment(start, 'h:mm A');
  let endTime = moment(end, 'h:mm A');
  if (startTime > endTime) endTime = moment(endTime).add(1, "days")
  const duration = moment.duration(endTime.diff(startTime));
  const hours = parseInt(duration.asHours());
  return hours;
}
const getDaysBetweenDates = (startDate, endDate) => {
  var now = startDate.clone(), dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('DD/MM/YYYY'));
    now.add(1, 'days');
  }
  return dates;
};

exports.adminportfolioReports = async (req, res, next) => {
  try {
    let shiftsss;
    const Clockdata = await Clock.find({});
    const adminPortfolio = [];
    shiftsss = await Shift.aggregate([{
      $group: {
        _id: {
          month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    if (req.query.siteId && req.query.type && req.query.from && req.query.to) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: { $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')) },
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: {
              $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
            },
          },
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId && req.query.from && req.query.to) {
      shiftsss = await Shift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } }},
      { $sort: { '_id.date': +1 } }]).exec();
    } else if (req.query.siteId && req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId)
          }
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec()
      }
    } else if (req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{ $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
          { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{ $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
          { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId) {
      shiftsss = await Shift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
        },
      }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    } else if (req.query.from && req.query.to) {
      shiftsss = await Shift.aggregate([{
        $match: {
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.date': +1 } }]).exec();
    }
    shiftsss.forEach((filteredShift) => {
      let fixedRosterHour = 0;
      let totalCasualHrs = 0;
      let Days = 0;
      let actualRosterHour = 0;
      let actualCasualHour = 0;
      let actualClockIns = 0;
      let actualClockOuts = 0;
      filteredShift.data.forEach((shift) => {
        Days += moment(shift.endDate).diff(moment(shift.startDate), 'days') + 1;
        if (shift.shiftType === 'Fixed') fixedRosterHour += getHours(shift.startTime, shift.endTime) * Days;
        if (shift.shiftType === 'Casual') totalCasualHrs += getHours(shift.startTime, shift.endTime) * Days;
        const clockindata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockin');
        const clockoutdata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockout');
        const shiftDates = getDaysBetweenDates(moment(shift.startDate), moment(shift.endDate));
        let perDayClockIn;
        let perDayClockOut;
        shiftDates.forEach((date) => {
          perDayClockIn = clockindata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockIn.length > 0) actualClockIns++
        });
        shiftDates.forEach((date) => {
          perDayClockOut = clockoutdata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockOut.length > 0) actualClockOuts++
        });
        if (perDayClockIn.length > 0 && perDayClockOut.length > 0) {
          if (shift.shiftType === 'Fixed') actualRosterHour += getHours(perDayClockIn[0].createdAt, perDayClockOut[perDayClockOut.length - 1].createdAt);
          if (shift.shiftType === 'Casual') actualCasualHour += getHours(shift.startTime, shift.endTime);
        }
      });
      if (filteredShift._id.month && filteredShift._id.year) {
        adminPortfolio.push({
          month: `${moment(`${filteredShift._id.month}`, 'M').format('MMMM')} ${filteredShift._id.year}`,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.year) {
        adminPortfolio.push({
          year: filteredShift._id.year,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.date) {
        adminPortfolio.push({
          date: filteredShift._id.date,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      }
    });
    const data = {
      portfolios: ['totalFixedRosterHrs', 'totalCasualHrs', 'actualRosterHrs', 'actualCasualHrs', 'noOfShifts', 'clockins', 'clockouts'],
      data: adminPortfolio,
    };
    res.json({ code: 201, message: 'Site list retrieved successfully.', data });
  } catch (error) {
    next(error);
  }
};

exports.customReports = async (req, res, next) => {
  try {
    const reports = await Report.list(req.query);
    res.json({ code: 201, message: 'Portfolio report retrieved successfully.', data : reports });
  } catch (error) {
    next(error);
  }
};


exports.adminCasualShiftReports = async (req, res, next) => {
  try {
    let shiftsss;
    const Clockdata = await Clock.find({});
    const adminPortfolio = [];
    shiftsss = await CasualShift.aggregate([{
      $group: {
        _id: {
          month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    if (req.query.siteId && req.query.type && req.query.from && req.query.to) {
      if (req.query.type === 'month') {
        shiftsss = await CasualShift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: { $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')) },
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await CasualShift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: {
              $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
            },
          },
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId && req.query.from && req.query.to) {
      shiftsss = await CasualShift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } }},
      { $sort: { '_id.date': +1 } }]).exec();
    } else if (req.query.siteId && req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await CasualShift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await CasualShift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId)
          }
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec()
      }
    } else if (req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await CasualShift.aggregate([{ $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
          { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await CasualShift.aggregate([{ $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
          { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId) {
      shiftsss = await CasualShift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
        },
      }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    } else if (req.query.from && req.query.to) {
      shiftsss = await CasualShift.aggregate([{
        $match: {
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.date': +1 } }]).exec();
    }
    shiftsss.forEach((filteredShift) => {
      let fixedRosterHour = 0;
      let totalCasualHrs = 0;
      let Days = 0;
      let actualRosterHour = 0;
      let actualCasualHour = 0;
      let actualClockIns = 0;
      let actualClockOuts = 0;
      filteredShift.data.forEach((shift) => {
        Days += moment(shift.endDate).diff(moment(shift.startDate), 'days') + 1;
        if (shift.shiftType === 'Fixed') fixedRosterHour += getHours(shift.startTime, shift.endTime) * Days;
        if (shift.shiftType === 'Casual') totalCasualHrs += getHours(shift.startTime, shift.endTime) * Days;
        const clockindata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockin');
        const clockoutdata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockout');
        const shiftDates = getDaysBetweenDates(moment(shift.startDate), moment(shift.endDate));
        let perDayClockIn;
        let perDayClockOut;
        shiftDates.forEach((date) => {
          perDayClockIn = clockindata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockIn.length > 0) actualClockIns++
        });
        shiftDates.forEach((date) => {
          perDayClockOut = clockoutdata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockOut.length > 0) actualClockOuts++
        });
        if (perDayClockIn.length > 0 && perDayClockOut.length > 0) {
          if (shift.shiftType === 'Fixed') actualRosterHour += getHours(perDayClockIn[0].createdAt, perDayClockOut[perDayClockOut.length - 1].createdAt);
          if (shift.shiftType === 'Casual') actualCasualHour += getHours(shift.startTime, shift.endTime);
        }
      });
      if (filteredShift._id.month && filteredShift._id.year) {
        adminPortfolio.push({
          month: `${moment(`${filteredShift._id.month}`, 'M').format('MMMM')} ${filteredShift._id.year}`,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.year) {
        adminPortfolio.push({
          year: filteredShift._id.year,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.date) {
        adminPortfolio.push({
          date: filteredShift._id.date,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      }
    });
    const data = {
      portfolios: ['totalFixedRosterHrs', 'totalCasualHrs', 'actualRosterHrs', 'actualCasualHrs', 'noOfShifts', 'clockins', 'clockouts'],
      data: adminPortfolio,
    };
    res.json({ code: 201, message: 'Site list retrieved successfully.', data });
  } catch (error) {
    next(error);
  }
};

exports.exportReportsIntoCsv = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Portfolio Report');
    let shiftsss;
    const Clockdata = await Clock.find({});
    const adminPortfolio = [];
    shiftsss = await Shift.aggregate([{
      $group: {
        _id: {
          month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' }
        }, data: { $push: '$$ROOT' }
      }
    },
    { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    if (req.query.siteId && req.query.type && req.query.from && req.query.to) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: { $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')) },
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
            shiftDate: {
              $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
            },
          },
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId && req.query.from && req.query.to) {
      shiftsss = await Shift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.date': +1 } }]).exec();
    } else if (req.query.siteId && req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId),
          },
        }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{
          $match: {
            siteId: mongoose.Types.ObjectId(req.query.siteId)
          }
        }, { $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec()
      }
    } else if (req.query.type) {
      if (req.query.type === 'month') {
        shiftsss = await Shift.aggregate([{ $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
      } else if (req.query.type === 'year') {
        shiftsss = await Shift.aggregate([{ $group: { _id: { year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
        { $sort: { '_id.year': +1 } }]).exec();
      }
    } else if (req.query.siteId) {
      shiftsss = await Shift.aggregate([{
        $match: {
          siteId: mongoose.Types.ObjectId(req.query.siteId),
        },
      }, { $group: { _id: { month: { $month: '$shiftDate' }, year: { $year: '$shiftDate' } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.month': 1, '_id.year': 1 } }]).exec();
    } else if (req.query.from && req.query.to) {
      shiftsss = await Shift.aggregate([{
        $match: {
          shiftDate: {
            $gte: new Date(moment(req.query.from, 'DD/MM/YYYY')), $lt: new Date(moment(req.query.to, 'DD/MM/YYYY')),
          },
        },
      }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$shiftDate' } } }, data: { $push: '$$ROOT' } } },
      { $sort: { '_id.date': +1 } }]).exec();
    }
    shiftsss.forEach((filteredShift) => {
      let fixedRosterHour = 0;
      let totalCasualHrs = 0;
      let Days = 0;
      let actualRosterHour = 0;
      let actualCasualHour = 0;
      let actualClockIns = 0;
      let actualClockOuts = 0;
      filteredShift.data.forEach((shift) => {
        Days += moment(shift.endDate).diff(moment(shift.startDate), 'days') + 1;
        if (shift.shiftType === 'Fixed') fixedRosterHour += getHours(shift.startTime, shift.endTime) * Days;
        if (shift.shiftType === 'Casual') totalCasualHrs += getHours(shift.startTime, shift.endTime) * Days;
        const clockindata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockin');
        const clockoutdata = Clockdata.filter((cl) => cl.shiftId == `${shift._id}` && cl.type === 'clockout');
        const shiftDates = getDaysBetweenDates(moment(shift.startDate), moment(shift.endDate));
        let perDayClockIn;
        let perDayClockOut;
        shiftDates.forEach((date) => {
          perDayClockIn = clockindata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockIn.length > 0) actualClockIns++
        });
        shiftDates.forEach((date) => {
          perDayClockOut = clockoutdata.filter((cl) => moment(cl.createdAt).format('DD/MM/YYYY') == date)
          if (perDayClockOut.length > 0) actualClockOuts++
        });
        if (perDayClockIn.length > 0 && perDayClockOut.length > 0) {
          if (shift.shiftType === 'Fixed') actualRosterHour += getHours(perDayClockIn[0].createdAt, perDayClockOut[perDayClockOut.length - 1].createdAt);
          if (shift.shiftType === 'Casual') actualCasualHour += getHours(shift.startTime, shift.endTime);
        }
      });
      if (filteredShift._id.month && filteredShift._id.year) {
        adminPortfolio.push({
          month: `${moment(`${filteredShift._id.month}`, 'M').format('MMMM')} ${filteredShift._id.year}`,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.year) {
        adminPortfolio.push({
          year: filteredShift._id.year,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      } else if (filteredShift._id.date) {
        adminPortfolio.push({
          date: filteredShift._id.date,
          totalFixedRosterHrs: fixedRosterHour,
          totalCasualHrs,
          actualRosterHrs: actualRosterHour,
          actualCasualHrs: actualCasualHour,
          noOfShifts: Days,
          clockins: actualClockIns,
          clockouts: actualClockOuts,
        });
      }
    });

    if (adminPortfolio[0].month) {
        worksheet.columns = [
          { header: 'Month', key: 'month', width: 25 },
          { header: 'Total Fixed Roster Hours', key: 'totalFixedRosterHrs', width: 25 },
          { header: 'Total Casual Hours', key: 'totalCasualHrs', width: 26 },
          { header: 'Actual Fixed Roster Hours', key: 'actualRosterHrs', width: 25 },
          { header: 'Actual Casual Roster Hours', key: 'actualCasualHrs', width: 25 },
          { header: 'No. of Shifts', key: 'noOfShifts', width: 12 },
          { header: 'Clockins', key: 'clockins' },
          { header: 'Clockouts', key: 'clockouts' },
        ];
    } else if (adminPortfolio[0].year) {
      worksheet.columns = [
        { header: 'Year', key: 'year', width: 25 },
        { header: 'Total Fixed Roster Hours', key: 'totalFixedRosterHrs', width: 25 },
        { header: 'Total Casual Hours', key: 'totalCasualHrs', width: 26 },
        { header: 'Actual Fixed Roster Hours', key: 'actualRosterHrs', width: 25 },
        { header: 'Actual Casual Roster Hours', key: 'actualCasualHrs', width: 25 },
        { header: 'No. of Shifts', key: 'noOfShifts', width: 12 },
        { header: 'Clockins', key: 'clockins' },
        { header: 'Clockouts', key: 'clockouts' },
      ];
    } else if (adminPortfolio[0].date) {
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 25 },
        { header: 'Total Fixed Roster Hours', key: 'totalFixedRosterHrs', width: 25 },
        { header: 'Total Casual Hours', key: 'totalCasualHrs', width: 26 },
        { header: 'Actual Fixed Roster Hours', key: 'actualRosterHrs', width: 25 },
        { header: 'Actual Casual Roster Hours', key: 'actualCasualHrs', width: 25 },
        { header: 'No. of Shifts', key: 'noOfShifts', width: 12 },
        { header: 'Clockins', key: 'clockins' },
        { header: 'Clockouts', key: 'clockouts' },
      ];
    }
    adminPortfolio.forEach((port) => worksheet.addRow(port));
    // worksheet.addRows(adminPortfolio);
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report.xlsx`
    )
    return workbook.xlsx.write(res).then(() => res.status(200));
  } catch (error) {
    next(error);
  }
};
