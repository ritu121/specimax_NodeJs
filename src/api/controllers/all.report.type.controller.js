const httpStatus = require('http-status');
const { omit } = require('lodash');

const Report = require('../models/report.reporttype.model');

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


exports.create = async (req, res, next) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Report type created successfully.', data: savedReport.transform()});
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


exports.list = async (req, res, next) => {
  try {
    const reports = await Report.list(req.query);
    const transformedReports = reports.map((report) => report.transform());
    res.json({code : 200, message : 'Report type list retrieved successfully.', data: transformedReports});
  } catch (error) {
    next(error);
  }
};


exports.listSorted = async (req, res, next) => {
  try {
    const reports = await Report.find({
      _id : {$nin : ['63de643044b3381cb833abe3','63de643044b3381cb833abe4','63de643044b3381cb833abe5','63de643044b3381cb833abe6','63de643044b3381cb833abe7','63de643044b3381cb833abe8','63de643044b3381cb833abe9','63de643044b3381cb833abea','63de643044b3381cb833abeb','63de643044b3381cb833abec','63de643044b3381cb833abed','63de643044b3381cb833abee','63de643044b3381cb833abef']}
    });
    // const transformedReports = reports.map((report) => report.transform());
    res.json({code : 200, message : 'Report list retrieved successfully.', data: reports});
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

