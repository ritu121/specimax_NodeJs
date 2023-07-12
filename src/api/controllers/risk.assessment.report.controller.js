const httpStatus = require('http-status');
const { omit } = require('lodash');
const Report = require('../models/risk.assessment.report.model');
const multer = require('multer');
const { formatDate, formatAMPM } = require('../utils/helper');
const { generateCustomReport, generateRiskAssessmentReport } = require('../services/reportGenerator');
const exceljs = require('exceljs');
const flat = require('flat')

exports.load = async (req, res, next, id) => {
  try {
    const report = await Report.get(id);
    req.locals = { report };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async(req, res) => {
    let report = await Report.findOne({_id : req.params.reportId})
                 .populate([
                  {
                    path : 'userId',
                    select : 'firstname lastname'
                  },
                  {
                    path : 'siteId',
                    select : 'name'
                  },
                  {
                    path : 'riskAssessmentCategoryId',
                    select : 'name'
                  },
                  {
                    path : 'riskAssessmentQuestionId',
                    select : 'question' 
                  },
                  {
                    path : 'choiceId.choice',
                    select : 'name'
                  },
                  {
                    path : 'choiceId.optionId',
                    select : 'name'
                  }
                 ])
    res.json({code: 200, message: 'Risk assessment report retrieved successfully.', data: report.transform()})
};

const storage = multer.diskStorage({
destination(req, file, cb) {
    cb(null, 'uploads/');
},

// By default, multer removes file extensions so let's add them back
filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
},
});


exports.create = async (req, res, next) => {
  try {
    const { riskAssessmentCategoryId, questions, siteId} = req.body;
    if(!riskAssessmentCategoryId){
        res.send(404, {code: 404, message: 'Risk assessment category required!', data: {}});
    }
    else if(!siteId){
        res.send(404 ,{code: 404, message: 'Site id is required!', data: {}});
    }
    else if(questions.length === 0){
        res.send(404 ,{code: 404, message: 'Question parameter is required!', data: {}});
    }
    // else if(questions.length > 0){
    //   for(var i  = 0; i < questions.length ; i++){
    //     if(!questions[i].questionId){
    //       res.send(404 ,{code: 404, message: 'Question id is required!', data: {}});
    //     }
    //     else if(!questions[i].answer){
    //       res.send(404 ,{code: 404, message: 'Answer is required!', data: {}});
    //     }
    //     else if(!questions[i].choiceId){
    //       res.send(404 ,{code: 404, message: 'Choice id is required!', data: {}});
    //     }
    //     else if(!questions[i].optionId){
    //       res.send(404 ,{code: 404, message: 'Option id is required!', data: {}});
    //     }
    //   }
    // }
    else{
      req.body.userId = req.user._id;
      const report = new Report(req.body);
      const savedReport = await report.save();
      res.status(httpStatus.CREATED);
      res.json({code: 201, message: 'Risk assessment report created successfully.', data: savedReport.transform()});
      // var options = {};
      // req.body.userId = req.user._id;
      // var payload = req.body
  
      
      // const upload = multer({ storage }).single('picture');
  
      // if(req.files !== undefined || req.files !== null){
      //     const report = new Report(payload);
      //     const savedReport = await report.save();
      //     upload(req, res, async (err) => {
      //       if (req.fileValidationError) {
      //         return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
      //       }
      //       else if (!req.files) {
      //         return res.send(400, { code: 400, message: 'Please select an image to upload' });
      //       }
      //       else if (err instanceof multer.MulterError) {
      //         return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
      //       }
      //       else{
      //         const baseUrl = `${req.protocol}://${req.headers.host}`;
      //          var media = `${baseUrl}/uploads/${req.files.picture[0].filename}`
            
             
      
      //         let report = await Report.updateOne({_id : savedReport._id}, {media : media});
      //         let getReport = await Report.findOne({_id : savedReport._id});
  
      //         res.status(httpStatus.CREATED);
      //         res.json({code: 201, message: 'Risk assessment report created successfully.', data: getReport.transform()});
      //       }
      //     });
      // }
      // else{
      //    res.status(httpStatus.CREATED);
      //    res.json({code: 201, message: 'Risk assessment report created successfully.', data: savedReport.transform()});
      // }
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const report = await Report.updateOne({_id : req.params.reportId}, req.body)
    .then(async(report) => {
        let newReport = await Question.findOne({_id : req.params.reportId})
        res.json({code : 200, message : 'Risk assessment report updated successfully.', data: newReport.transform()})
    })
    .catch((e) => next(e));
};


exports.list = async (req, res, next) => {
  try {
    if(req.user.login_as === 'user'){
        req.body.userId = req.user._id;
    }
    const reports = await Report.list(req.query);
    // const transformedReports = reports.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment question list retrieved successfully.', data: reports});
  } catch (error) {
    next(error);
  }
};
restruct = (data)=>{
  data.question = data.questionId.question
  data.caregory = data.category.name
  data.subcategory = data.subCategory?.name
  data.risk = data.riskIdentified?.name
  data.likelyhood = data.likelihood?.name
  data.impac = data.impact?.name
  data.rat = data.rating?.name
  console.log('aa',data)
  return data
}
// exports.exportRiskAssessment = async (req, res, next) => {
//   try {
//     if (req.user.login_as === 'user') {
//       req.body.userId = req.user._id;
//     }
//     const { reportId } = req.query
//     let report = await Report.findOne({ _id: reportId })
//     .populate([
//       {
//         path: 'userId',
//         select: 'firstname lastname'
//       },
//       {
//         path: 'siteId',
//         select: 'name'
//       },
//       {
//         path: 'riskAssessmentCategoryId',
//         select: 'name'
//       },
//       {

//         path: 'questions',
//         select: 'questionId comment choiceId optionId media',
//         populate: [
//           {
//             path: 'questionId',
//             select: 'question'
//           },
//           {
//             path: 'category',
//             select: 'name'
//           },
//           {
//             path: 'subCategory',
//             select: 'name'
//           },
//           {
//             path: 'riskIdentified',
//             select: 'name'
//           },
//           {
//             path: 'likelihood',
//             select: 'name'
//           },
//           {
//             path: 'impact',
//             select: 'name'
//           },
//           {
//             path: 'rating',
//             select: 'name'
//           },
//         ]
//       }
//     ])
//     data = {
//       reports: report,
//       date: formatDate(new Date()),
//       time: formatAMPM(new Date()),
//       reportType: report.riskAssessmentCategoryId.name,
//       site: report.siteId.name,
//       submmitedBy: report.userId.firstname,
//       guard: 'NA',
//       // imagePath: imagePath
//     };
//     let fileName = await generateRiskAssessmentReport(data);
//     // let fileName = await generateCustomReport(reports);
//     // const baseUrl = `${req.protocol}://${req.headers.host}`;
//     let genratedUrl = path.join(__dirname, `../../../src/public/report/${fileName}.pdf`);
//     // res.send({success : true, data : genratedUrl})
//     res.download(genratedUrl, function(err) {
//       if(err) {
//           console.log(err);
//       }
//     })
//     // const transformedReports = reports.map((status) => status.transform());
//     // res.json({ code: 200, message: 'Risk assessment question list retrieved successfully.', data: report });
//   } catch (error) {
//     next(error);
//   }
// };
exports.exportRiskAssessment = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    let allReports = [];
    let reports;
    const { siteId, startdate, enddate } = req.query;
    const page = req.query.page || 1;

    if (req.user.login_as === 'user') {
      req.body.userId = req.user._id;
    }
    const { reportId } = req.query
    let report = await Report.findOne({ _id: reportId })
    .populate([
      {
        path: 'userId',
        select: 'firstname lastname'
      },
      {
        path: 'siteId',
        select: 'name'
      },
      {
        path: 'riskAssessmentCategoryId',
        select: 'name'
      },
      {

        path: 'questions',
        select: 'questionId comment choiceId optionId media',
        populate: [
          {
            path: 'questionId',
            select: 'question'
          },
          {
            path: 'category',
            select: 'name'
          },
          {
            path: 'subCategory',
            select: 'name'
          },
          {
            path: 'riskIdentified',
            select: 'name'
          },
          {
            path: 'likelihood',
            select: 'name'
          },
          {
            path: 'impact',
            select: 'name'
          },
          {
            path: 'rating',
            select: 'name'
          },
        ]
      }
    ])
    // allReports.push(report)
    allReports = report.questions.map(r=>{return restruct(r)})
    // report.questions.map((r) => { allReports.push(restruct(r)); });
    console.log('rep',allReports)
    worksheet.columns = [

      { header: 'Questions', key: 'question', width: 26 },
      { header: 'Category', key: 'caregory', width: 26 },
      { header: 'Sub-category', key: 'subcategory', width: 26 },
      { header: 'Risk Identified', key: 'risk', width: 26 },
      { header: 'Likelyhood', key: 'likelyhood', width: 26 },
      { header: 'Impact', key: 'impac', width: 26 },
      { header: 'Rating', key: 'rat', width: 26 },
      { header: 'Media', key: 'media', width: 25 },
      { header: 'Note', key: 'note', width: 25 },
    ];
    allReports.forEach((report) => worksheet.addRow(restruct(report)));
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

exports.remove = async(req, res, next) => {
    Report.deleteOne({_id : req.params.reportId})
    .then(async () => {
        res.json({code : 200, message : 'Risk assessment report delete successfully.', data : {}})
    })
    .catch((e) => next(e));
};
