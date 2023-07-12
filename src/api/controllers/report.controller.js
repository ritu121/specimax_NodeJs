const httpStatus = require('http-status');
const { omit } = require('lodash');
const exceljs = require('exceljs');
const multer = require('multer');
const moment = require('moment-timezone')
const Report = require('../models/report.model');
const ReportType = require('../models/report.type.model');
const User = require('../models/user.model');
const Site = require('../models/site.model');
const ReportQuestionAnswer = require('../models/report.question.answer.model');
const Question = require('../models/report.question.model')
const AllReportType = require('../models/report.reporttype.model')
const { omitBy, isNil } = require('lodash');
const { formatDate, formatAMPM } = require('../utils/helper');
const {generateCustomReport} = require('../services/reportGenerator')
var fileName = ''

exports.load = async (req, res, next, id) => {
  try {
    const report = await Report.get(id);
    req.locals = { report };
    return next();
  } catch (error) {
    return next(error);
  }
};

const storage  =   multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    fileName = `${Date.now()}-${file.originalname}`
    console.log('HURREY')
    cb(null, fileName);
  },
});

// exports.get = (req, res) => {
//   res.json({ code: 200, message: 'Report list retrieved successfully.', data: req.locals.report.transform() });
// }

exports.get = async(req, res) => {
      let answer = await ReportQuestionAnswer.find({"questionId.inspectionId" : req.body.reportId, userId : req.user._id})
                   .populate([
                    {
                      path : 'questionId',
                      model : 'ReportQuestion',
                      select : "question reportType siteId inspectionId",
                      populate : [
                        {
                          path : 'reportType',
                          model : 'AllReportType',
                          select : "name"
                        },
                        {
                          path : 'siteId',
                          model : 'Site',
                          select : "name"
                        },
                        {
                          path : 'inspectionId',
                          model : 'Report'
                        }
                      ]
                    },
                    {
                      path : 'userId',
                      model : 'User',
                      select : "firstname lastname"
                    }            
                   ]);
      if(answer){
        res.json({ code: 200, message: 'Report retrieved successfully.', data: answer });
      }
      else{
        res.json({ code: 404, message: 'Report not found.', data: {} });
      }
  // res.json({ code: 200, message: 'Report list retrieved successfully.', data: data });
}

exports.loggedIn = (req, res) => res.json(req.report.transform());

exports.create = async (req, res, next) => {
  var answers = new Array();
  for (var i = 0; i < req.body.questions.length; i++) {
    req.body.questions[i]['userId'] = req.user._id;
    // console.log('QUESTIONS -----',req.body.questions[i])
    // console.log('USER ID',req.user._id)
    // console.log('USER ID',req.user._id)
    // console.log('USER ID',req.user._id)
    // console.log('USER ID',req.user._id)
    // console.log('USER ID',req.user._id)
    let answer = new ReportQuestionAnswer(req.body.questions[i]);
    await answer.save()
      .then((ans) => {
        let id = ans._id;
        // console.log('IDS------', ans)
        answers.push(id.toString());
      })
      .catch((error) => {
        res.json(500, { code: 500, message: 'Internal server error!', errors: error });
      })
  }

  let data = {
    reportTypeId: req.body.reportTypeId,
    note: req.body.note,
    userId : req.user._id,
    siteId : req.body.siteId,
    questions: answers
  }
  try {
    const report = new Report(data);
    const savedReport = await report.save();
    const upload = await multer({ storage }).single('picture');
    // console.log('FILENAME',fileName)
    await upload(req, res, async(err) => {
      // console.log('I am in')
      if (req.file) {
        if (req.fileValidationError) {
          return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
        }
        if (!req.file) {
          return res.send(400, { code: 400, message: 'Please select an image to upload' });
        }
        if (err instanceof multer.MulterError) {
          return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
        }
        else {
         
          const baseUrl = `${req.protocol}://${req.headers.host}`;
          const updateData = {
            media: `${baseUrl}/uploads/${req.file.filename}`,
          };
          await Report.updateOne({ _id: savedReport._id }, updateData, (err, update) => {
            if (err) res.json(500, { code: 200, message: 'Internal server error' })
            if (update) {
              Report.findOne({ _id: savedReport._id })
                .populate([
                  {
                    path: 'reportTypeId',
                    model: 'AllReportType'
                  },
                  {
                    path: 'siteId',
                    model: 'Site'
                  },
                  {
                    path: 'userId',
                    model: 'User'
                  },
                  {
                    path: 'questions',
                    model: 'ReportQuestionAnswer'
                  }
                ])

                .then((one) => {
                  res.status(httpStatus.CREATED);
                  res.json({ code: 201, message: 'Report created successfully.' });
                })
                .catch((errors) => {
                  res.send(500, { code: 500, message: 'Internet server error.', errors: errors });
                })

            }
            else {
              res.send(500, { code: 500, message: 'Internet server error.' });
            }
          })
        }
      }
      else{
        return Report.findOne({ _id: savedReport._id })
                .populate([
                  {
                    path: 'reportTypeId',
                    model: 'AllReportType'
                  },
                  {
                    path: 'siteId',
                    model: 'Site'
                  },
                  {
                    path: 'userId',
                    model: 'User'
                  },
                  {
                    path: 'questions',
                    model: 'ReportQuestionAnswer',
                    populate :{
                      path :'questionId',
                      model : 'ReportQuestion'
                    }
                  }
                ])

                .then((one) => {
                  res.status(httpStatus.CREATED);
                  res.json({ code: 201, message: 'Report created successfully.' });
                })
                .catch((errors) => {
                  res.send(500, { code: 500, message: 'Internet server error.', errors: errors });
                })
      }
    })
    // res.status(httpStatus.CREATED);
    // res.json({ code: 201, message: 'Report created successfully.', data: savedReport.transform() });
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { report } = req.locals;
    const newReport = new Report(req.body);
    const newReportObject = omit(newReport.toObject(), '_id');

    await report.updateOne(newReportObject, { override: true, upsert: true });
    const savedReport = await report.findById(report._id);

    res.json({ code: 200, message: 'Report updated successfully.', data: savedReport.transform() });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  var answers = new Array();
  const updateId = req.params.reportId;
  await Report.findOne({ _id: updateId }, (err, up) => {
    if (err) res.send(500, { code: 500, message: 'Internal server error.' });
    for (var j = 0; j < up.questions.length; j++) {
      ReportQuestionAnswer.deleteOne({ _id: up.questions[i] }, (er, d) => {
        if (er) res.send(500, { code: 500, message: 'Internal server error.' });
      })
    }
  })

  for (var i = 0; i < req.body.questions.length; i++) {
    let answer = new ReportQuestionAnswer(req.body.questions[i]);
    await answer.save()
      .then((ans) => {
        let id = ans._id;
        answers.push(id.toString());
      })
      .catch((error) => {
        res.json(500, { code: 500, message: 'Internal server error!', errors: error });
      })
  }

  let data = {
    reportTypeId: req.body.reportTypeId,
    note: req.body.note,
    userId : req.user._id,
    siteId : req.body.siteId,
    questions: answers
  }


  try {
    await Report.updateOne({ _id: updateId }, data, (err, ups) => {
      Report.findOne({ _id: updateId }).then((newData) => {
        const upload = multer({ storage }).single('picture');
        upload(req, res, (err) => {
          if (req.file) {
            if (req.fileValidationError) {
              return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
            }
            if (!req.file) {
              return res.send(400, { code: 400, message: 'Please select an image to upload' });
            }
            if (err instanceof multer.MulterError) {
              return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
            }
            else {
              const baseUrl = `${req.protocol}://${req.headers.host}`;
              const updateData = {
                media: `${baseUrl}/uploads/${req.file.filename}`,
              };
              Report.updateOne({ _id: newData._id }, updateData, (err, update) => {
                if (err) res.json(500, { code: 200, message: 'Internal server error' })
                if (update) {
                  Report.findOne({ _id: newData._id })
                    .populate([
                      {
                        path: 'reportTypeId',
                        model: 'AllReportType'
                      },
                      {
                        path: 'siteId',
                        model: 'Site'
                      },
                      {
                        path: 'userId',
                        model: 'User'
                      },
                      {
                        path: 'questions',
                        model: 'ReportQuestionAnswer',
                        populate :{
                          path :'questionId',
                          model : 'ReportQuestion'
                        }
                      }
                    ])
                    .then((one) => {
                      res.status(httpStatus.CREATED);
                      res.json({ code: 201, message: 'Report updated successfully.', data: one });
                    })
                    .catch((errors) => {
                      res.send(500, { code: 500, message: 'Internet server error.', errors: errors });
                    })

                }
                else {
                  res.send(500, { code: 500, message: 'Internet server error.' });
                }
              })
            }
          }
        })
      })


    })


  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    req.query.userId = req.user._id;

    // const reports = await Report(req.query);
    const reports = await ReportQuestionAnswer.list(req.query);
    // const transformedReports = reports.map((status) => status.transform());
    res.json({ code: 200, message: 'Report list retrieved successfully.', data: reports });
  } catch (error) {
    next(error);
  }
};


exports.listReport = async (req, res, next) => {
  try {
    
    const {siteId, startDate, endDate, reportTypeId, page = 1, perPage = 25, userId =  req.user._id} = req.query;
    var options = {};

    if(siteId && reportTypeId && startDate && endDate){
      options = omitBy({ reportTypeId, userId, siteId, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
    }
    else if(!siteId && reportTypeId && startDate && endDate){
      options = omitBy({ reportTypeId, userId, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
    }
    else if(siteId && !reportTypeId && startDate && endDate){
      options = omitBy({  userId, siteId, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
    }
    else if(siteId && reportTypeId && !startDate && endDate){
      options = omitBy({ reportTypeId, userId, siteId, createdAt : {$lte : endDate} }, isNil);
    }
    else if(siteId && reportTypeId && startDate && !endDate){
      options = omitBy({ reportTypeId, userId, siteId, createdAt : {$gte : startDate} }, isNil);
    }
    else if(!siteId && !reportTypeId && startDate && endDate){
      options = omitBy({ userId, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
    }
    else if(siteId && !reportTypeId && !startDate && endDate){
      options = omitBy({ userId, siteId, createdAt : {$lte : endDate} }, isNil);
    }
    else if(siteId && reportTypeId && !startDate && !endDate){
      options = omitBy({ reportTypeId, userId, siteId}, isNil);
    }
    else if(!siteId && reportTypeId && startDate && !endDate){
      options = omitBy({ reportTypeId, userId, createdAt : {$gte : startDate} }, isNil);
    }
    else if(!siteId && !reportTypeId && !startDate && endDate){
      options = omitBy({  userId,  createdAt : { $lte : endDate} }, isNil);
    }
    else if(siteId && !reportTypeId && !startDate && !endDate){
      options = omitBy({  userId, siteId}, isNil);
    }
    else if(!siteId && reportTypeId && !startDate && !endDate){
      options = omitBy({ reportTypeId, userId}, isNil);
    }
    else if(!siteId && !reportTypeId && startDate && !endDate){
      options = omitBy({  userId,  createdAt : {$gte : startDate} }, isNil);
    }
    else if(siteId && !reportTypeId && startDate && !endDate){
      options = omitBy({  userId, siteId, createdAt : {$gte : startDate} }, isNil);
    }
    else if(siteId && !reportTypeId && !startDate && endDate){
      options = omitBy({  userId, siteId, createdAt : {$lte : endDate} }, isNil);
    }



    console.log('OPTIONS ###################################################',options)
    // options = omitBy({ reportTypeId, _id, questions,userId,siteId, media, note }, isNil);

    const reports = await Report.find(options)
                    .populate([
                      {
                        path: 'reportTypeId',
                        model: 'AllReportType',
                        select : 'name'
                      },
                      {
                        path: 'siteId',
                        model: 'Site',
                        select : 'name'
                      },
                      {
                        path: 'userId',
                        model: 'User',
                        select : 'firstname lastname'
                      },
                      {
                        path: 'questions',
                        model: 'ReportQuestionAnswer',
                        select : 'questionId answer',
                        populate :{
                          path :'questionId',
                          model : 'ReportQuestion',
                          select : 'question'
                        }
                      }
                    ])
                    .sort({ createdAt: -1 })
                    .skip(perPage * (page - 1))
                    .limit(perPage)
                    .exec();
    // const reports = await ReportQuestionAnswer.list(req.query);
    // const transformedReports = reports.map((status) => status.transform());
    res.json({ code: 200, message: 'Report list retrieved successfully.', data: reports });
  } catch (error) {
    next(error);
  }
};

exports.availableReport = async (req, res, next) =>{
  let reports = await AllReportType.find({}, "name");
  res.status(201).send({code : 201, message : 'Report retrieve successfully.', data : reports});
}

exports.download = async (req, res, next) => {
  try {
    // const reports = await Report.list(req.query);
    // const workbook = new exceljs.Workbook();
    // const worksheet = workbook.addWorksheet('Custom Report');
    // worksheet.columns = [
    //   { header: 'Report Type', key: 'reportTypeId', width: 25 },
    //   { header: 'Site Name', key: 'siteId', width: 25 },
    //   { header: 'User', key: 'userId', width: 25 },
    //   { header: 'Report Date', key: 'createdAt', width: 26 },
    //   { header: 'Note', key: 'note', width: 25 },
    //   { header: 'Question', key: 'questionId', width: 25 },
    //   { header: 'Answer', key: 'answer', width: 25 },
    //   { header: 'Comment', key: 'comment', width: 25 },
    // ];
    
    // reports.forEach((report) => {
    //   for(var i = 0; i < report.questions.length; i++){
    //     worksheet.addRow({
    //       reportTypeId : report?.reportTypeId?.name,
    //       siteId : report?.siteId?.name,
    //       userId : report?.userId?.firstname + ' ' + report?.userId?.lastname,
    //       createdAt : formatDate(report?.createdAt),
    //       note : report?.note,
    //       questionId : report.questions[i]?.questionId?.question,
    //       answer : report.questions[i]?.answer,
    //       comment : report.questions[i]?.comment
    //     })
    //   }
    // });
    // // worksheet.addRows(adminPortfolio);
    // worksheet.getRow(1).eachCell((cell) => {
    //   cell.font = { bold: true };
    // });
    // res.setHeader(
    //   'Content-Type',
    //   'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    // );
    // res.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename=report.xlsx`
    // );
    // return workbook.xlsx.write(res).then(() => res.status(200));
    const {_id,reportTypeId,userId, siteId, questions, media, note, startDate, endDate} = req.query;
    var reports = [];
    if(_id){
      const options = omitBy({ reportTypeId, _id, questions,'questions.userId' : userId,siteId, media, note, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
      reports = await Report.find({_id:_id})
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          },
          // populate :{
          //   path :'userId',
          //   model : 'User'
          // }
        }
      ])
      .sort({ createdAt: -1 })
      
      .exec();
    }
    else if(startDate && endDate && userId){
      const options = omitBy({ reportTypeId, _id, questions,'questions.userId' : userId,siteId, media, note, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
      reports = await Report.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          },
          // populate :{
          //   path :'userId',
          //   model : 'User'
          // }
        }
      ])
      .sort({ createdAt: -1 })
      
      .exec();
    }

    else if(startDate && !endDate && userId){
      const options = omitBy({ reportTypeId, _id, questions,userId,siteId,'questions.userId' : userId, media, note, createdAt : {$gte : startDate} }, isNil);
      reports = await Report.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          },
          // populate :{
          //   path :'userId',
          //   model : 'User'
          // }
        }
      ])
      .sort({ createdAt: -1 })
      
      .exec();
    }

    else if(!startDate && endDate && userId){
      const options = omitBy({ reportTypeId,_id, questions,userId,siteId, 'questions.userId' : userId,media, note, createdAt : {$lte : endDate} }, isNil);
      reports = await Report.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          },
          // populate :{
          //   path :'userId',
          //   model : 'User'
          // }
        }
      ])
      .sort({ createdAt: -1 })
      .exec();
    }

    else if(!startDate && !endDate && userId){
      // console.log('I AM IN')
      var options = omitBy({ reportTypeId,_id, questions,userId,siteId,media,userId, note}, isNil);
      // options['questions.userId'] = userId
      // console.log('OPTIONS', options)
      reports = await Report.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          },
          // populate :{
          //   path :'userId',
          //   model : 'User'
          // }
        }
      ])
      .sort({ createdAt: -1 })
      .exec();

      // console.log('Results', reports)
    }

    else{
      const options = omitBy({ reportTypeId, _id, questions,userId,siteId, media, note }, isNil);

        reports = await Report.find(options)
        .populate([
          {
            path: 'reportTypeId',
            model: 'AllReportType'
          },
          {
            path: 'siteId',
            model: 'Site'
          },
          {
            path: 'userId',
            model: 'User'
          },
          {
            path: 'questions',
            model: 'ReportQuestionAnswer',
            populate :{
              path :'questionId',
              model : 'ReportQuestion'
            }
          }
        ])
        .sort({ createdAt: -1 })
        .exec();
    }
    console.log('reports',reports)

    //  console.log('DATA COUNT', reports.length)
    //  for(var i = 0; i < reports.length; i++){
    //   for(var j = 0; j < reports[i].questions.length; j++){
    //     // console.log('REPORTS', reports[i].questions[j])
    //     console.log('QUESTIONS', reports[i].questions[j].questionId)
    //   }
    //  }

    //  res.send({data : {}});
    //  return;

    var data = {}
    const imagePath = `${req.protocol}://${req.headers.host}/images/logo.png`;
    if(siteId && userId && reportTypeId){
      let site = await Site.findOne({_id : siteId});
      let user = await User.findOne({_id : userId});
      let type = await AllReportType.findOne({_id : reportTypeId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType : type.name ?? 'Custom All Report',
        site : site?.name,
        submmitedBy : `${user?.firstname} ${user?.lastname}`,
        guard : `${user?.firstname} ${user?.lastname}`,
        imagePath : imagePath
      };
    }
    else if(!siteId && userId && reportTypeId){
      let user = await User.findOne({_id : userId});
      let type = await AllReportType.findOne({_id : reportTypeId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType : type.name ?? 'Custom All Report',
        site : 'NA',
        submmitedBy : `${user?.firstname} ${user?.lastname}`,
        guard : `${user?.firstname} ${user?.lastname}`,
        imagePath : imagePath
      };
    }
    else if(siteId && !userId && reportTypeId){
      let site = await Site.findOne({_id : siteId});
      let type = await AllReportType.findOne({_id : reportTypeId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        site : site?.name,
        reportType : type.name ?? 'Custom All Report',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : imagePath
      };
    }
    else  if(!siteId && !userId && reportTypeId){
      let type = await AllReportType.findOne({_id : reportTypeId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType : type.name ?? 'Custom All Report',
        site : 'NA',
        submmitedBy : 'NA',
        guard : 'NA',
        imagePath : imagePath
      };
    }
    else  if(siteId && !userId && !reportTypeId){
      let site = await Site.findOne({_id : siteId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType : 'Custom All Report',
        site : site?.name,
        submmitedBy : 'NA',
        guard : 'NA',
        imagePath : imagePath
      };
    }
    else  if(!siteId && userId && !reportTypeId){
      let user = await User.findOne({_id : userId});
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType :  'Custom All Report',
        site : 'NA',
        submmitedBy : `${user?.firstname} ${user?.lastname}`,
        guard : `${user?.firstname} ${user?.lastname}`,
        imagePath : imagePath
      };
    }
    else{
      data = {
        reports : reports,
        date : formatDate(new Date()),
        time : formatAMPM(new Date()),
        reportType :  'Custom All Report',
        site : 'NA',
        submmitedBy : "NA",
        guard : 'NA',
        imagePath : imagePath
      };
    }
    data.reports.note = reports[0]?.note

    

    // data.reports = reports;
    let fileName = await generateCustomReport(data);
    // let fileName = await generateCustomReport(reports);
    // const baseUrl = `${req.protocol}://${req.headers.host}`;
    let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
    // res.send({success : true, data : genratedUrl})
    res.download(genratedUrl, function(err) {
      if(err) {
          console.log(err);
      }
    })
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  const { report } = req.locals;
  Report.findOne({ _id: req.params.reportId }, (err, report) => {
    if (err) {
      res.send(500, { code: 500, message: 'Internet server error.', errors: err });
    }
    for (var i = 0; i < report.questions.length; i++) {
      ReportQuestionAnswer.deleteOne({ _id: report.questions[i] }, (errors, suc) => {
        if (err) {
          res.send(500, { code: 500, message: 'Internet server error.', errors: err });
        }
      })
    }
  })
  report.remove()
    .then(() => {
      res.json({ code: 200, message: 'Report deleted successfully.', data: {} });
    })
    .catch((e) => next(e));
};

exports.filterReport = async (req, res, next) => {
  try {
    const allReports = [];
    let reports;
    const { siteId, startdate, enddate } = req.query;
    const page = req.query.page || 1;
    const reportType = await ReportType.find({ siteId }, { _id: 1 });
    if (startdate && enddate){
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        .populate('taskId questions reportTypeId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
    reports = await Report.find({ reportTypeId: { $in: reportType } })
      .populate('taskId questions reportTypeId')
      .sort({ createdAt: -1 })
      .skip(30 * (page - 1))
      .limit(30)
      .exec();
    }
    reports.map((report) => { report.transform(); allReports.push(report); });
    res.json({ code: 200, message: 'Reports retrieved successfully.', data: allReports });
  } catch (error) {
    next(error);
  }
};


exports.customReport = async (req, res, next) => {
  try {
    let reports;
    const { name, userId, siteId, startdate, enddate, reportTypeId } = req.query;
    const options = omitBy({ name, siteId, reportTypeId }, isNil);
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 25
    if (startdate && enddate){
      reports = await ReportType.find(options)
        .where({
          createdAt: {
            $gte: startdate,
            $lte: enddate,
          },
        })
        .populate("siteId reportTypeId")
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    else if (startdate && !enddate){
      reports = await ReportType.find(options)
        .where({
          createdAt: {
            $gte: startdate
          },
        })
        .populate("siteId reportTypeId")
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    else if (!startdate && enddate){
      reports = await ReportType.find(options)
        .where({
          createdAt: {
            $lte: enddate
          },
        })
        .populate("siteId reportTypeId")
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    else {
    reports = await ReportType.find(options)
      .populate("siteId reportTypeId")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    var allData = [];
    for (const iteration of reports) {
      var obj = {
        _id : iteration._id,
        name : iteration.name,
        reportTypeId : iteration.reportTypeId,
        // userId : iteration.userId,
        siteId : iteration.siteId,
        description : iteration.description,
        questions :   await Question.find({ inspectionId : iteration._id}),
        createdAt : iteration.createdAt,
        updatedAt : iteration.updatedAt
      };
      allData.push(obj)
    };
    res.json({ code: 200, message: 'Custom report retrieved successfully.', data: allData });
  } catch (error) {
    next(error);
  }
};

exports.getReportsWithToken = async (req, res, next) => {
  try {
    // const { sites } = req.user;
    let reports;
    const { startDate, endDate ,siteId } = req.query;
    const page = req.query.page || 1;
    const allReports = [];
    // const reportType = await ReportType.find({ siteId: sites }, { _id: 1 });
    const reportType = await ReportType.find({ siteId: siteId }, { _id: 1 });

    if (startDate !== '' && startDate !== null && startDate !== undefined && endDate !== '' && endDate !== null && endDate !== undefined) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
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
        .skip(30 * (page - 1))
        .limit(30)
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
        .skip(30 * (page - 1))
        .limit(30)
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
      .skip(30 * (page - 1))
      .limit(30)
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
};

exports.exportfilterReport = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const allReports = [];
    let reports;
    const { siteId, startdate, enddate } = req.query;
    const page = req.query.page || 1;
    const reportType = await ReportType.find({ siteId }, { _id: 1 });
    console.log('rp',reportType)
    if (startdate && enddate) {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        // .populate('taskId questions reportTypeId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
      reports = await Report.find({ reportTypeId: { $in: reportType } })
        // .populate('taskId questions reportTypeId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    console.log('rr',reports)
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

exports.exportReportsWithToken = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { sites } = req.user;
    let reports;
    const { startdate, enddate } = req.query;
    const page = req.query.page || 1;
    const allReports = [];
    const reportType = await ReportType.find({},{ _id: 1 });
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
