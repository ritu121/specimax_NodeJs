const exceljs = require('exceljs');
const moment = require('moment-timezone');
const Report = require('../models/report.model');
const ReportType = require('../models/report.type.model');
const TenancyModel = require('../models/tenancy.check.model');
const LogsModel = require('../models/shift.logs.model');
const CasualShift = require('../models/casual.shift.model');
const RosterShift = require('../models/site.roster.model');
const Shift = require('../models/shift.model');
const ClockData = require('../models/clock.data.model');
const Support = require('../models/support.model');
const Task = require('../models/task.model');
const Alarm = require('../models/alarm.model');
const Site = require('../models/site.specific.induction.model');
const {generateTaskReport, generateSupportReport, generateAlarmReport, generateLogReport, generateTendencyReport,generateCasualShiftReport, generateRosterShiftReport, generateClockInOutReport, generateFailedReport} = require('../services/reportGenerator')
const { omitBy, isNil } = require('lodash');
const { formatDate, formatAMPM } = require('../utils/helper');

exports.exportfilterReport = async (req, res, next) => {
  try {
    // const { sites } = req.user;
    let reports;
    const { startDate, endDate , siteId} = req.query;
    const allReports = [];
    const reportType = await ReportType.find({ siteId: siteId }, { _id: 1 });
    console.log('aa',reportType)
    if (startDate !== '' && startDate !== null && startDate !== undefined && endDate !== '' && endDate !== null && endDate !== undefined) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'taskId'
          },
          {
            path: 'questions',
            populate: 'questionId'
          },
          {
            path: 'reportTypeId'
          }
        ])
        .exec();
    } 
    else if (startDate !== '' && startDate !== null && startDate !== undefined) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: startDate
          },
        })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'taskId'
          },
          {
            path: 'questions',
            populate: 'questionId'
          },
          {
            path: 'reportTypeId'
          }
        ])
        .exec();
    } 
    else if (endDate !== '' && endDate !== null && endDate !== undefined) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $lte: endDate
          },
        })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'taskId'
          },
          {
            path: 'questions',
            populate: 'questionId'
          },
          {
            path: 'reportTypeId'
          }
        ])
        .exec();
    } 
    else {
    reports = await Report.find({ reportTypeId: { $in: reportType } })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'taskId'
        },
        {
          path: 'questions',
          populate: 'questionId'
        },
        {
          path: 'reportTypeId'
        }
      ])
      .exec();
    }
    reports.map((report) => { report.transform(); allReports.push(report); });
    res.json({ code: 200, message: 'Reports retrieved successfully.', data: allReports });
  } catch (error) {
    next(error);
  }
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const allReports = [];
  //   let reports;
  //   let reportType;
  //   const { siteId, startdate, enddate } = req.query;
  //   const page = req.query.page || 1;
    
  //   if (siteId && startdate && enddate) {
  //     reportType = await ReportType.find({ siteId }, { _id: 1 });
  //     reports = await Report.find({ reportTypeId: { $in: reportType } })
  //       .where({
  //         createdAt: {
  //           $gte: moment(startdate, 'DD/MM/YYYY'),
  //           $lt: moment(enddate, 'DD/MM/YYYY'),
  //         },
  //       })
  //       // .populate('taskId questions reportTypeId')
  //       .sort({ createdAt: -1 })
  //       .exec();
  //   } else if (siteId) {
  //     reportType = await ReportType.find({ siteId }, { _id: 1 });
  //     reports = await Report.find({ reportTypeId: { $in: reportType } })
  //       // .populate('taskId questions reportTypeId')
  //       .sort({ createdAt: -1 })
  //       .exec();
  //   }else{
  //     reportType = await ReportType.find({ }, { _id: 1 });
  //     reports = await Report.find({ reportTypeId: { $in: reportType } })
  //       // .populate('taskId questions reportTypeId')
  //       .sort({ createdAt: -1 })
  //       .exec();
  //   }
  //   reports.map((report) => { report.transform(); allReports.push(report); });
  //   res.status(200).send({code : 200 , message : 'Export report successfully', data : reports})

  //   worksheet.columns = [
  //     { header: 'Report Type Id', key: 'reportTypeId', width: 25 },
  //     { header: 'Task Id', key: 'taskId', width: 25 },
  //     { header: 'Questions', key: 'questions', width: 26 },
  //     { header: 'Media', key: 'media', width: 25 },
  //     { header: 'Note', key: 'note', width: 25 },
  //   ];
  //   allReports.forEach((report) => worksheet.addRow(report));
  //   // worksheet.addRows(adminPortfolio);
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=report.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  // } catch (error) {
  //   next(error);
  // }
};

exports.exportReportsWithToken = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { sites } = req.user;
    let reports;
    const { startdate, enddate } = req.query;
    const page = req.query.page || 1;
    const allReports = [];
    const reportType = await ReportType.find({ siteId: sites }, { _id: 1 });
    if (startdate && enddate) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        // .populate([
        //   {
        //     path: 'taskId'
        //   },
        //   {
        //     path: 'questions',
        //     populate: 'questionId'
        //   },
        //   {
        //     path: 'reportTypeId'
        //   }
        // ])
        .exec();
    } else {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        // .populate([
        //   {
        //     path: 'taskId'
        //   },
        //   {
        //     path: 'questions',
        //     populate: 'questionId'
        //   },
        //   {
        //     path: 'reportTypeId'
        //   }
        // ])
        .exec();
    }
    reports.map((report) => { report.transform(); allReports.push(report); });
    worksheet.columns = [
      { header: 'Report Type Id', key: 'reportTypeId', width: 25 },
      { header: 'Task Id', key: 'taskId', width: 25 },
      { header: 'Questions', key: 'questions', width: 26 },
      { header: 'Media', key: 'media', width: 25 },
      { header: 'Note', key: 'note', width: 25 },
    ];
    allReports.forEach((report) => worksheet.addRow(report));
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
    );
    return workbook.xlsx.write(res).then(() => res.status(200));
  } catch (error) {
    next(error);
  }
};

exports.exportTenancyCheck = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const { shiftId, startdate, enddate } = req.query;
  //   let tenencyCheck;
  //   const page = req.query.page || 1;
  //   if (startdate && enddate) {
  //     tenencyCheck = await TenancyModel.find({  })
  //       .where({
  //         createdAt: {
  //           $gte: moment(startdate, 'DD/MM/YYYY'),
  //           $lt: moment(enddate, 'DD/MM/YYYY'),
  //         },
  //       })
  //       // .populate('shiftId floors')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   } else {
  //     tenencyCheck = await TenancyModel.find({ shiftId })
  //       // .populate('shiftId floors')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   }
  //   worksheet.columns = [
  //     { header: 'Shift Id', key: 'shiftId', width: 25 },
  //     { header: 'Shift Status', key: 'shiftStatus', width: 25 },
  //     { header: 'Floors', key: 'floors', width: 26 },
  //   ];
  //   tenencyCheck.forEach((report) => worksheet.addRow(report));
  //   // worksheet.addRows(adminPortfolio);
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=tenancyCheck.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  // } catch (error) {
  //   next(error);
  // }
  const {startDate, endDate, shiftId} = req.query;
  var createdAt = {};
      if(startDate !== undefined && startDate !== null && startDate !== '' && endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {
          $gte : startDate,
          $lt : endDate
        };
      }
      else if(startDate !== undefined && startDate !== null && startDate !== ''){
        createdAt = {$gte : startDate};
      }

      else if(endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {$lte: endDate};
      }

      if(createdAt // 👈 null and undefined check
      && Object.keys(createdAt).length === 0
      && Object.getPrototypeOf(createdAt) === Object.prototype){
        createdAt = null;
      }

      const options = omitBy({ shiftId, createdAt}, isNil);

      var reports = await TenancyModel.find(options)
        .populate([
          {
            path : 'shiftId',
            model : 'Shift',
            populate : {
              path : 'siteId',
              model : 'Site'
            }
          },
          {
            path : 'floors',
            model : 'TenancyAreas'
          }
        ])
        // .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .exec();

      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : 'NA',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
      };


      let fileName = await generateTendencyReport(data);
      let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
      res.download(genratedUrl, function(err) {
        if(err) {
            console.log(err);
        }
      })
};

exports.exportShiftLogs = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const { shiftId, startdate, enddate } = req.query;
  //   let shiftLogs;
  //   const page = req.query.page || 1;
  //   if (startdate && enddate) {
  //     shiftLogs = await LogsModel.find({  })
  //       .where({
  //         createdAt: {
  //           $gte: moment(startdate, 'DD/MM/YYYY'),
  //           $lt: moment(enddate, 'DD/MM/YYYY'),
  //         },
  //       })
  //       // .populate('shiftId')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   } else {
  //     shiftLogs = await LogsModel.find({  })
  //       // .populate('shiftId')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   }
  //   worksheet.columns = [
  //     { header: 'Shift Id', key: 'shiftId', width: 25 },
  //     { header: 'Media', key: 'media', width: 25 },
  //     { header: 'Log', key: 'log', width: 26 },
  //   ];
  //   shiftLogs.forEach((report) => worksheet.addRow(report));
  //   // worksheet.addRows(adminPortfolio);
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=shiftLog.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  // } catch (error) {
  //   next(error);
  // }
      const {startDate, endDate} = req.query;
      req.body.endDate = endDate ? endDate() : new Date();
      var createdAt = {};
      if(startDate !== undefined && startDate !== null && startDate !== '' && endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {
          $gte : startDate,
          $lt : endDate
        };
      }
      else if(startDate !== undefined && startDate !== null && startDate !== ''){
        createdAt = {$gte : startDate};
      }

      else if(endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {$lte: endDate};
      }

      if(createdAt // 👈 null and undefined check
      && Object.keys(createdAt).length === 0
      && Object.getPrototypeOf(createdAt) === Object.prototype){
        createdAt = null;
      }

      const options = omitBy({createdAt}, isNil);
      var reports = await LogsModel.find(options)
        .populate([
          {
            path : 'shiftId',
            model : 'Shift',
            populate : {
              path : 'siteId',
              model : 'Site',
            }
          }
        ])
        .sort({ createdAt: -1 })
        .exec();

        const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;
          data = {
            reports : reports,
            date : formatDate(new Date()),
            time : formatAMPM(new Date()),
            site : 'NA',
            submmitedBy : "NA",
            guard : 'NA',
            imagePath : imagePath
          };
        
    
        let fileName = await generateLogReport(data);
        let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
        res.download(genratedUrl, function(err) {
          if(err) {
              console.log(err);
          }
        })
    
};
exports.exportTasks = async (req, res, next) => {

    // const {companyId,siteId, workOrderNo,title,dueDate, timeDue } = req.query;
    // const options = omitBy({ companyId,siteId, workOrderNo,title,dueDate }, isNil);
    // var tasks = [];
    // if(timeDue){
    //   tasks = await  Task.find(options)
    //   .populate([
    //     {
    //       path : 'siteId',
    //       model : 'Site'
    //     },
    //     {
    //       path : 'companyId',
    //       model : 'Company'
    //     },
    //     {
    //       path : 'user',
    //       model : 'User'
    //     }
    //   ])
    //   .sort({ createdAt: -1 })
    //   .exec().map((item) => {
    //     let time = timeDue.slice(0, -2);
    //     let amPm = timeDue.slice(-2);
    //     let newTime = `${time} ${amPm}`;
    //     var str1 = convertTime12to24(item.timeDue);
    //     var str2 = convertTime12to24(newTime);
    //     if(str1 >= str2)
    //     {
    //       return item;
    //     }
    //   })
    // }
    // else{
    //   tasks = await Task.find(options)
    //   .populate([
    //     {
    //       path : 'siteId',
    //       model : 'Site'
    //     },
    //     {
    //       path : 'companyId',
    //       model : 'Company'
    //     },
    //     {
    //       path : 'user',
    //       model : 'User'
    //     }
    //   ])
    //   .sort({ createdAt: -1 })
    //   .exec();
    // } 

    // var data = {}
    // if(siteId ){
    //   let site = await Site.findOne({_id : siteId});
    //   data = {
    //     reports : tasks,
    //     date : formatDate(new Date()),
    //     time : formatAMPM(new Date()),
    //     site : site?.name,
    //     submmitedBy : 'NA',
    //     guard : 'NA',
    //     imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
    //   };
    // }
    // else{
    //   data = {
    //     reports : tasks,
    //     date : formatDate(new Date()),
    //     time : formatAMPM(new Date()),
    //     site : 'NA',
    //     submmitedBy : "NA",
    //     guard : 'NA',
    //     imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
    //   };
    // }

    // let fileName = await generateTaskReport(data);
    // let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
    // res.download(genratedUrl, function(err) {
    //   if(err) {
    //       console.log(err);
    //   }
    // })


    const {startDate, endDate,siteId} = req.query;
    var taskDate = null;
    if(startDate && endDate){
      let newEndDate = new Date(endDate);
      let today =  new Date();
      taskDate = {$gte : startDate, $lte : newEndDate < today ? newEndDate : today };
    }
    else if(startDate && !endDate){
      let today =  new Date();
      taskDate = {$gte : startDate, $lte : today };
    }
    else if(!startDate && endDate){
      let newEndDate = new Date(endDate);
      let today =  new Date();
      taskDate = { $lte : newEndDate < today ? newEndDate : today };
    }
    else{
      taskDate = {$lte : new Date()};
    }

    const options = omitBy({ taskDate, isGroup : true, assignedUser : {$ne : null}, siteId}, isNil);
    let tasks =  await Task.find(options)
    .populate([
      {
        path : 'siteId',
        model : 'Site',
        select : 'name'
      },
      {
        path : 'companyId',
        model : 'Company',
        select : 'name'
      },
      {
        path : 'assignedUser',
        model : 'User',
        select : 'firstname lastname'
      }
    ]);


    var data = {}
    if(siteId ){
      let site = await Site.findOne({_id : siteId});
      data = {
        reports : tasks,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : site?.name,
        submmitedBy : 'NA',
        guard : 'NA',
        imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
      };
    }
    else{
      data = {
        reports : tasks,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : 'NA',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
      };
    }

    let fileName = await generateTaskReport(data);
    let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
    res.download(genratedUrl, function(err) {
      if(err) {
          console.log(err);
      }
    })


};
exports.exportAlarms = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Alarms');
  //   const { shiftId, startdate, enddate } = req.query;
  //   let shiftLogs;
  //   const page = req.query.page || 1;
  //   if (startdate && enddate) {
  //     shiftLogs = await Alarm.find({  })
  //       .where({
  //         createdAt: {
  //           $gte: moment(startdate, 'DD/MM/YYYY'),
  //           $lt: moment(enddate, 'DD/MM/YYYY'),
  //         },
  //       })
  //       // .populate('shiftId')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   } else {
  //     shiftLogs = await Alarm.find({  })
  //       // .populate('shiftId')
  //       .sort({ createdAt: -1 })
  //       .skip(30 * (page - 1))
  //       .limit(30)
  //       .exec();
  //   }
  //   worksheet.columns = [
  //     { header: 'User Id', key: 'userId', width: 25 },
  //     // { header: 'Site Id', key: 'siteId', width: 25 },
  //     { header: 'Status', key: 'status', width: 25 },
  //     { header: 'Start Date', key: 'startDate', width: 25 },
  //     { header: 'End Date', key: 'endDate', width: 25 },
  //     { header: 'Start Time', key: 'startTime', width: 25 },
  //     { header: 'End Time', key: 'endTime', width: 25 },
  //     { header: 'Shift Recurrence', key: 'shiftRecurrence', width: 25 },
  //     { header: 'Mobile Number', key: 'mobileNumber', width: 25 },
  //     { header: 'Assigned User', key: 'assignedUser', width: 25 },
  //   ];
  //   shiftLogs.forEach((report) => worksheet.addRow(report));
  //   // worksheet.addRows(adminPortfolio);
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=schedularAlarms.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  // } catch (error) {
  //   next(error);
  // }

  const {status, createdAt, startDate, endDate,siteId } = req.query
  const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;

  var options = {}
    if(startDate && endDate){
       options = omitBy({ status, createdAt, startDate : {$gte : startDate} ,endDate : {$lte : endDate}, "sites.siteId" : siteId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, createdAt, startDate : {$gte : startDate}, "sites.siteId" : siteId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, createdAt, endDate : {$lte : endDate}, "sites.siteId" : siteId }, isNil);
    }
    else{
      options = omitBy({ status, createdAt,"sites.siteId" : siteId }, isNil);
    }
    
    var reports = await Alarm.find(options)
      .populate([
        {
          path : 'sites',
          model : 'Site',
          select : 'name'
        },
        {
          path : 'company',
          model : 'Company',
          select : 'name'
        },
        {
          path : 'userId',
          model : 'User',
          select :'firstname lastname'
        },
        {
          path : 'shiftRecurrence',
        }
      ])
      .sort({ createdAt: -1 })
      .exec();


      // res.send(201, {code : 201, message :'check', data : reports })

      if(siteId ){
        let site = await Site.findOne({_id : siteId});
        data = {
          reports : reports,
          date : formatDate(new Date()),
          time : formatAMPM(new Date()),
          site : site?.name,
          submmitedBy : 'NA',
          guard : 'NA',
          imagePath : imagePath
        };
      }
      else{
        data = {
          reports : reports,
          date : formatDate(new Date()),
          time : formatAMPM(new Date()),
          site : 'NA',
          submmitedBy : "NA",
          guard : 'NA',
          imagePath : imagePath
        };
      }
  
      let fileName = await generateAlarmReport(data);
      let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
      res.download(genratedUrl, function(err) {
        if(err) {
            console.log(err);
        }
      })
};

exports.exportCasualShift = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const shiftList = await CasualShift.find({})
  //   const result = shiftList.map((data) => {
  //     var startTime = moment(data.startTime, 'HH:mm a');
  //     var endTime = moment(data.endTime, 'HH:mm a');
  //     if (startTime > endTime) endTime = moment(endTime).add(1, "days")
  //     var duration = moment.duration(endTime.diff(startTime));
  //     var hours = parseInt(duration.asHours());
  //     var minutes = parseInt(duration.asMinutes()) % 60;
  //     let tempData = { ...data._doc }
  //     tempData.totalHours = hours + ' hour and ' + minutes + ' minutes.'
  //     return tempData;
  //   })
  //   worksheet.columns = [
  //     { header: 'User Id', key: 'userId', width: 25 },
  //     { header: 'Site Id', key: 'siteId', width: 25 },
  //     { header: 'Status', key: 'status', width: 25 },
  //     { header: 'shiftType', key: 'shiftType', width: 25 },
  //     { header: 'Price', key: 'price', width: 25 },
  //     { header: 'Start Date', key: 'startDate', width: 25 },
  //     { header: 'End Date', key: 'endDate', width: 25 },
  //     { header: 'Start Time', key: 'startTime', width: 25 },
  //     { header: 'End Time', key: 'endTime', width: 25 },
  //     { header: 'Total hours', key: 'totalHours', width: 25 },
  //     { header: 'Shift Recurrence', key: 'shiftRecurrence', width: 25 },
  //     { header: 'Shift Code', key: 'shiftCode', width: 25 },
  //     { header: 'Wo Number', key: 'woNumber', width: 25 },
  //     { header: 'Allowed Breaks', key: 'allowedBreaks', width: 25 },
  //     { header: 'Report At', key: 'reportAt', width: 25 },
  //     { header: 'Parking Required', key: 'parkingRequired', width: 25 },
  //     { header: 'Intrested Users', key: 'intrestedUsers', width: 25 },
  //     { header: 'Assigned User', key: 'assignedUser', width: 25 },
  //   ];
  //   result.forEach((data) => worksheet.addRow(data));
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=casualShift.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  //   // res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  // } catch (error) {
  //   next(error);
  // }


  const {startDate, endDate, siteId} = req.query
    var shiftList = null;
    if(endDate){
      endDate = endDate ? endDate : new Date();
    }
   
    const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;
    if(startDate && endDate)
    {
      shiftList = await CasualShift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate} })
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers')
                      .sort({ createdAt: -1 });
    }
    else if(startDate)
    {
      shiftList = await CasualShift.find({startDate : {$gte : startDate}})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers')
                      .sort({ createdAt: -1 });
    }
    else if(endDate)
    {
      shiftList = await CasualShift.find({endDate : {$lte : endDate}})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers')
                      .sort({ createdAt: -1 });
    }
    else{
      shiftList = await CasualShift.find({})
                      .populate('shiftRecurrence siteId shiftType userId assignedUser intrestedUsers')
                      .sort({ createdAt: -1 });
    }

    const reports = shiftList.map((data) => {
      var startTime = moment(data.startTime, 'HH:mm a');
      var endTime = moment(data.endTime, 'HH:mm a');
      if (startTime > endTime) endTime = moment(endTime).add(1, "days")
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

    if(siteId ){
      let site = await Site.findOne({_id : siteId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : site?.name,
        submmitedBy : 'NA',
        guard : 'NA',
        imagePath : imagePath
      };
    }
    else{
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : 'NA',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : imagePath
      };
    }

    let fileName = await generateCasualShiftReport(data);
    let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
    res.download(genratedUrl, function(err) {
      if(err) {
          console.log(err);
      }
    })

}

exports.exportRosters = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   var allRosterShift = await RosterShift.find({})
  //   const result = allRosterShift.map((data) => {
  //     var startTime = moment(data.startTime, 'HH:mm a');
  //     var endTime = moment(data.endTime, 'HH:mm a');
  //     if (startTime > endTime) endTime = moment(endTime).add(1, "days")
  //     var duration = moment.duration(endTime.diff(startTime));
  //     var hours = parseInt(duration.asHours());
  //     var minutes = parseInt(duration.asMinutes()) % 60;
  //     let tempData = { ...data._doc }
  //     tempData.totalHours = hours + ' hour and ' + minutes + ' minutes.'
  //     return tempData;
  //   })
  //   worksheet.columns = [
  //     { header: 'User Id', key: 'userId', width: 25 },
  //     { header: 'Site Id', key: 'siteId', width: 25 },
  //     { header: 'Role', key: 'role', width: 25 },
  //     { header: 'Shift Code', key: 'shiftCode', width: 25 },
  //     { header: 'Shift Dates', key: 'shiftDates', width: 25 },
  //     { header: 'Start Date', key: 'startDate', width: 25 },
  //     { header: 'End Date', key: 'endDate', width: 25 },
  //     { header: 'Start Time', key: 'startTime', width: 25 },
  //     { header: 'End Time', key: 'endTime', width: 25 },
  //     { header: 'Total hours', key: 'totalHours', width: 25 },
  //     { header: 'Assigned User', key: 'assignedUser', width: 25 },
  //   ];
  //   result.forEach((data) => worksheet.addRow(data));
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=Rosters.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));

  //   res.json({ code: 200, message: 'Shift list retrieved successfully.', data: result });
  // } catch (error) {
  //   next(error);
  // }

  var {startDate, endDate, siteId} = req.query
    var allRosterShift = null;
    if(!endDate){
      endDate = new Date();
    }
    if(startDate && endDate && siteId){
      console.log('ONE')
      allRosterShift = await RosterShift.find({shiftDate : {$gte : new Date(startDate), $lte : new Date(endDate)}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(startDate && endDate && !siteId){
      console.log('TWO')
      allRosterShift = await RosterShift.find({shiftDate : {$gte : startDate,  $lte : new Date(endDate)}, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
      
    }
    else if(startDate && !endDate && siteId){
      console.log('THREE')
      allRosterShift = await RosterShift.find({shiftDate : {$gte : startDate,  $lte : new Date(endDate)}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && endDate && siteId){
      console.log('FOUR')
      allRosterShift = await RosterShift.find({shiftDate : {$lte : endDate}, siteId : siteId, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
      
    }
    else if(startDate && !endDate && !siteId){
      console.log('FIVE')
      allRosterShift = await RosterShift.find({shiftDate : {$gte : startDate, $lte : new Date(endDate)}, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && endDate && !siteId){
      console.log('SIX')
      allRosterShift = await RosterShift.find({ shiftDate : {$lte : endDate}, assignedUser : {$ne : null}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else if(!startDate && !endDate && siteId){
      console.log('SEVEN')
      allRosterShift = await RosterShift.find({siteId : siteId, assignedUser : {$ne : null}, shiftDate : {$lte : endDate}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    else{
      console.log('EIGHT')
      allRosterShift = await RosterShift.find({assignedUser : {$ne : null}, shiftDate : {$lte : endDate}})
      .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    }
    // var allRosterShift = await Shift.find({startDate : {$gte : startDate}, endDate : {$lte : endDate}, siteId : siteId})
    //   .populate('role userId siteId assignedUser').sort({ createdAt: -1 });
    const reports = allRosterShift.map((data) => {
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

  var today = new Date();
  var myDay = ['Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;
  if(siteId ){
    let site = await Site.findOne({_id : siteId});
    data = {
      reports : reports,
      date : formatDate(new Date()),
      time : formatAMPM(new Date()),
      site : site?.name,
      submmitedBy : 'NA',
      guard : 'NA',
      today : today.getDay(),
      myDay : myDay,
      imagePath : imagePath
    };
  }
  else{
    data = {
      reports : reports,
      date : formatDate(new Date()),
      time : formatAMPM(new Date()),
      site : 'NA',
      submmitedBy : "NA",
      guard : 'NA',
      today : today.getDay(),
      myDay : myDay,
      imagePath : imagePath
    };
  }

  let fileName = await generateRosterShiftReport(data);
  let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
  res.download(genratedUrl, function(err) {
    if(err) {
        console.log(err);
    }
  })
};

const lateClockInOut = (startEndTime, clockinOut) => {
  var time = moment(startEndTime, 'h:mma');
  var inOutTime = moment(clockinOut, 'h:mma');
  return moment(inOutTime).isAfter(time);
}

exports.exportAllClockInOut = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const allLateClockInOut = [];
  //   const list = await Shift.find({});
  //   const clock = await ClockData.find({})
  //   list.forEach((data) => {
  //     const lateClockIn = clock.filter((cl) => {
  //       const startTime = moment(data.startTime, 'HH:mm a').format('hh:mm').toString();
  //       const clockinTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
  //       const isLateIn = lateClockInOut(startTime, clockinTime);
  //       if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateIn && cl.type === 'clockin') {
  //         return cl;
  //       }
  //     });
  //     const lateClockOut = clock.filter((cl) => {
  //       const clockinOutTime = moment(cl.createdAt, 'HH:mm a').format('hh:mm').toString();
  //       const endTime = moment(data.endTime, 'HH:mm a').format('hh:mm').toString();
  //       const isLateOut = lateClockInOut(endTime, clockinOutTime);
  //       if ((cl.shiftId == `${data.rosterId}` || cl.shiftId == `${data._id}`) && isLateOut && cl.type === 'clockout') {
  //         return cl;
  //       }
  //     });
  //     allLateClockInOut.push(...[...lateClockIn, ...lateClockOut]);
  //   });
  //   worksheet.columns = [
  //     { header: 'User Id', key: 'userId', width: 25 },
  //     { header: 'Shift Id', key: 'shiftId', width: 25 },
  //     { header: 'Break Duration', key: 'breakDuration', width: 25 },
  //     { header: 'Status', key: 'status', width: 25 },
  //     { header: 'Type', key: 'type', width: 25 },
  //   ];
  //   allLateClockInOut.forEach((data) => worksheet.addRow(data));
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=LateClockInOut.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));

  //   // res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut });
  // } catch (err) {
  //   next(err);
  // }

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
    });
    const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;

    if(siteId ){
      let site = await Site.findOne({_id : siteId});
      data = {
        reports : allLateClockInOut,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : site?.name,
        submmitedBy : 'NA',
        guard : 'NA',
        imagePath : imagePath
      };
    }
    else{
      data = {
        reports : allLateClockInOut,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : 'NA',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : imagePath
      };
    }

    let fileName = await generateClockInOutReport(data);
    let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
    res.download(genratedUrl, function(err) {
      if(err) {
          console.log(err);
      }
    })
    // allLateClockInOut.push(...[...inClock, ...outClock]);
    // res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut});
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

exports.exportFailedCheckin = async (req, res, next) => {
  // try {
  //   const workbook = new exceljs.Workbook();
  //   const worksheet = workbook.addWorksheet('Report');
  //   const allLateClockInOut = [];
  //   const list = await Shift.find({}).populate('rosterId userId siteId');
  //   for (let i = 0; i < list.length; i++) {

  //     let data = list[i]

  //     if (data.startDate) {
  //       let dateArr = await getDates(data.startDate, data.endDate);
  //       const clock = await ClockData.aggregate([
  //         {
  //           '$match': {
  //             'createdAt': { '$gte': data.startDate, '$lte': data.endDate },
  //             'type': 'clockin'
  //           }
  //         },
  //         {
  //           '$group': {
  //             '_id': null,
  //             'dates': { '$push': { '$dateToString': { 'date': '$createdAt', 'format': '%Y-%m-%d' } } }
  //           }
  //         },
  //         {
  //           '$project': {
  //             'missingDates': { '$setDifference': [dateArr, '$dates'] },
  //             'shiftId': 1
  //           }
  //         }
  //       ])
  //       if (clock[0]?.missingDates)
  //         allLateClockInOut.push({ shift: data._id, failedDate: clock[0]?.missingDates })
  //     }
  //   }
  //   worksheet.columns = [
  //     { header: 'Shift Id', key: 'shift', width: 30 },
  //     { header: 'Failed Date', key: 'failedDate', width: 50 },
  //   ];
  //   allLateClockInOut.forEach((data) => worksheet.addRow(data));
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //   });
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=failedClockedIn.xlsx`
  //   );
  //   return workbook.xlsx.write(res).then(() => res.status(200));
  // } catch (err) {
  //   next(err);
  // }


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

     var data = {}
     const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;
        if(siteId ){
          let site = await Site.findOne({_id : siteId});
          data = {
            reports : allLateClockInOut,
            date : formatDate(new Date()),
            time : formatAMPM(new Date()),
            site : site?.name,
            submmitedBy : 'NA',
            guard : 'NA',
            imagePath : imagePath
          };
        }
        else{
           data = {
            reports : allLateClockInOut,
            date : formatDate(new Date()),
            time : formatAMPM(new Date()),
            site : 'NA',
            submmitedBy : "NA",
            guard : 'NA',
            imagePath : imagePath
          };
        }
    
        let fileName = await generateFailedReport(data);
        let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
        res.download(genratedUrl, function(err) {
          if(err) {
              console.log(err);
          }
        })
    // res.json({ code: 201, message: 'late clockin/out shift retrieved successfully.', data: allLateClockInOut });
} catch (err) {
    next(err);
}
}

exports.exportSupport = async (req, res, next) => {
  // let support = await Support.find({}).populate([
  //   {
  //     path: "userId",
  //     model: "User"
  //   },
  //   {
  //     path: "statusId",
  //     model: "SupportStatus"
  //   }
  // ])
  // const workbook = new exceljs.Workbook();
  // const worksheet = workbook.addWorksheet('Report');
  // worksheet.columns = [
  //   { header: 'Email', key: 'userName', width: 25 },
  //   { header: 'Status', key: 'statusName', width: 25 },
  //   { header: 'Title', key: 'title', width: 25 },
  //   { header: 'Issue', key: 'issue', width: 25 },
  //   { header: 'Tikit Id', key: 'ticketId', width: 25 },
  // ];
  // support.forEach((data) => {
  //   data.statusName = data.statusId?.name
  //   data.userName = data.userId?.email
  //   worksheet.addRow(data)
  // });
  // worksheet.getRow(1).eachCell((cell) => {
  //   cell.font = { bold: true };
  // });
  // res.setHeader(
  //   'Content-Type',
  //   'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  // );
  // res.setHeader(
  //   'Content-Disposition',
  //   `attachment; filename=SupportRequests.xlsx`
  // );
  // return workbook.xlsx.write(res).then(() => res.status(200));

  var list = null;
        const {startDate, endDate} = req.query
        if(startDate  && endDate ){
            list = await Support.find({issueDate : {$gte : startDate, $lte : endDate}})
                  .populate([
                    {
                      path : "userId",
                      model : "User"
                    },
                    {
                      path : "statusId",
                      model: "SupportStatus"
                    }
                  ]).sort({ createdAt: -1 });
        }
  
        else if(startDate && !endDate){
            console.log('THREE')
            list = await Support.find({issueDate:{$gte : startDate}})               
                  .populate([
                    {
                      path : "userId",
                      model : "User"
                    },
                    {
                      path : "statusId",
                      model: "SupportStatus"
                    }
                  ]).sort({ createdAt: -1 });
        }
        else if(!startDate && endDate){
            console.log('FOUR')
            list = await Support.find({issueDate : {$lte : endDate}})
                  .populate([
                    {
                      path : "userId",
                      model : "User"
                    },
                    {
                      path : "statusId",
                      model: "SupportStatus"
                    }
                  ]).sort({ createdAt: -1 });
        }
        else{
           console.log('EIGHT')
           list = await Support.find({})
                  .populate([
                    {
                      path : "userId",
                      model : "User"
                    },
                    {
                      path : "statusId",
                      model: "SupportStatus"
                    }
                  ]).sort({ createdAt: -1 });
        }

        // var data = {}
        // if(siteId ){
        //   let site = await Site.findOne({_id : siteId});
        //   data = {
        //     reports : list,
        //     date : formatDate(new Date()),
        //     time : formatAMPM(new Date()),
        //     site : site?.name,
        //     submmitedBy : 'NA',
        //     guard : 'NA',
        //   };
        // }
        // else{
        var   data = {
            reports : list,
            date : formatDate(new Date()),
            time : formatAMPM(new Date()),
            site : 'NA',
            submmitedBy : "NA",
            guard : 'NA',
            imagePath : `${req.protocol}://${req.headers.host}/images/logo.png`
          };
        // }
    
        let fileName = await generateSupportReport(data);
        let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
        res.download(genratedUrl, function(err) {
          if(err) {
              console.log(err);
          }
        })
    
    
}

exports.exportDocument = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { siteId } = req.query;
    const sites = await Site.find({ siteId });
    const transformedSites = sites.map((status) => status.transform());
    worksheet.columns = [
      { header: 'Site Id', key: 'siteId', width: 25 },
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Keyword', key: 'keyword', width: 25 },
      { header: 'Document', key: 'document', width: 25 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Visibility', key: 'visibility', width: 25 },
    ];
    transformedSites.forEach((data) => worksheet.addRow(data));
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=siteDocument.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));

    // res.send({ code: 200, message: 'Site specific induction list retrieved successfully.', data: transformedSites });
  } catch (error) {
    next(error);
  }
}