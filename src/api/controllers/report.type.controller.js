const httpStatus = require('http-status');
const { omit } = require('lodash');
const exceljs = require('exceljs')
const Report = require('../models/report.type.model');
const Question =require('../models/report.question.model')
const { omitBy, isNil } = require('lodash');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const report = await Report.get(id);
    req.locals = { report };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  res.json({code: 200, message: 'Report type list retrieved successfully.', data: req.locals.report.transform()})
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.report.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.siteId= req.body.sites
    const report = new Report(req.body);
    const savedReport = await report.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Report type created successfully.', data: savedReport.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { report } = req.locals;
    const newReport = new Report(req.body);
    const newReportObject = omit(newReport.toObject(), '_id');

    await report.updateOne(newReportObject, { override: true, upsert: true });
    const savedReport = await Report.findById(report._id);

    res.json({code: 200, message: 'Report type updated successfully.', data: savedReport.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedReport = omit(req.body);
  const report = Object.assign(req.locals.report, updatedReport);

  report.save()
    .then((savedReport) => res.json({code : 200, message : 'Report type updated successfully.', data: savedReport.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const {name, siteId, reportTypeId, perPage = 25 , page = 1} = req.query
    const options = omitBy({ name, siteId, reportTypeId }, isNil);
    const reports = await Report.find(options)
      .populate("siteId reportTypeId")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    res.json({code : 200, message : 'Report type list retrieved successfully.', data: reports});
  } catch (error) {
    next(error);
  }
};


exports.remove = (req, res, next) => {
  const { reportType } = req.locals;

  reportType.remove()
    .then(() => {
      res.json(200, {code : 200, message : 'Report type deleted successfully.', data : {}})
    })
    .catch((e) => next(e));
};

exports.siteInspection = async (req, res, next) => {
  try{
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { siteId } = req.params;
    const reportType = await Report.find({ siteId }).exec();
    const question = await Question.find({ reportType: { $in: reportType } }).exec();
    const exportData = [...reportType, ...question];
    worksheet.columns = [
      { header: 'Site Id', key: 'siteId', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Position', key: 'position', width: 25 },
      { header: 'Description', key: 'description', width: 25 },
      { header: 'Report Type', key: 'reportType', width: 25 },
      { header: 'Question', key: 'question', width: 25 },
      { header: 'Type', key: 'type', width: 25 },
      { header: 'Notes', key: 'notes', width: 25 },
    ];
    exportData.forEach((data) => worksheet.addRow(data));
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=siteInspection.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));
  } catch (error) {
    next(error)
  }
};
