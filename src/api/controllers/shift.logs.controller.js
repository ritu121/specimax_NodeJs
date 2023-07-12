const httpStatus = require('http-status');
const { omit } = require('lodash');
const exceljs = require('exceljs');
const multer = require('multer');
const moment = require('moment-timezone');
const LogsModel = require('../models/shift.logs.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const logs = await LogsModel.get(id);
    req.locals = { logs };
    return next();
  } catch (error) {
    return next(error);
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({ code: 200, message: 'Shift Logs retrieved successfully.', data: req.locals.logs.transform() });

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.logs.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const log = new LogsModel(req.body);
    const savedLog = await log.save();
    const upload = multer({ storage }).single('picture');
    upload(req, res, (err) => {
      if (req.files) {
        if (req.fileValidationError) {
          return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
        }
        if (!req.files) {
          return res.send(400, { code: 400, message: 'Please select an image to upload' });
        }
        if (err instanceof multer.MulterError) {
          return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
        }
        else {
          const baseUrl = `${req.protocol}://${req.headers.host}`;
          const updateData = {
            media: `${baseUrl}/uploads/${req.files.picture[0].filename}`,
          };
          LogsModel.updateOne({ _id: savedLog._id }, updateData, (err, update) => {
            if (err) res.json(500, { code: 200, message: 'Internal server error' })
            if (update) {
              LogsModel.findOne({ _id: savedLog._id })
                .then((one) => {
                  res.status(httpStatus.CREATED);
                  res.json({ code: 201, message: 'Logs created successfully.', data: one });
                })
                .catch((errors) => {
                  res.send(500, { code: 500, message: 'INternet server error.', errors: errors });
                })

            }
            else {
              res.send(500, { code: 500, message: 'INternet server error.' });
            }
          })
        }
      } else {
        res.json({ code: 201, message: 'Logs created successfully.', data: savedLog });
      }
    });
    //  res.status(httpStatus.CREATED);
    //  res.json({code: 201, message: 'Shift logs created successfully.', data: savedDuty.transform()});
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
    const { logs } = req.locals;
    const newLogs = new LogsModel(req.body);
    const newLogObject = omit(newLogs.toObject(), '_id');

    await logs.updateOne(newLogObject, { override: true, upsert: true });
    const savedLogs = await logs.findById(logs._id);

    res.json({ code: 200, message: 'Logs updated successfully.', data: savedDuty.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedDuty = omit(req.body);
  const log = Object.assign(req.locals.logs, updatedDuty);

  // log.save()
  //   .then((duty) => res.json({ code: 200, message: 'Key shift duties updated successfully.', data: log.transform() }))
  //   .catch((e) => next(e));

    const upload = multer({ storage }).single('picture');
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
      }
      if (!req.files) {
        return res.send(400, { code: 400, message: 'Please select an image to upload' });
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
      }
      
      const baseUrl = `${req.protocol}://${req.headers.host}`;
      
      if(log.picture==""){
        delete log.picture
      }else if(req.files.picture){
        log.media=`${baseUrl}/uploads/${req.files.picture[0].filename}`
      }
      // console.log('license update',log,req.files)
      log.save()
    .then((data) => res.send({ code: 200, message: 'Key shift duties successfully.', data: data.transform() }))
    .catch((e) => next(e));
    });
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const logs = await LogsModel.list(req.query);
    const transformedLogs = logs.map((log) => log.transform());
    res.json({ code: 200, message: 'Shift logs list retrieved successfully.', data: transformedLogs });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { duty } = req.locals;
  duty.remove()
    .then(() => res.json({ code: 200, message: 'Key shift duties deleted successfully.', data: null }))
    .catch((e) => next(e));
};

exports.filterShiftLogs = async (req, res, next) => {
  try {
    const { shiftId, startdate, enddate } = req.query;
    let shiftLogs;
    const page = req.query.page || 1;
    if (startdate && enddate) {
      shiftLogs = await LogsModel.find({ shiftId })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        .populate('shiftId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
      shiftLogs = await LogsModel.find({ shiftId })
        .populate('shiftId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    res.json({ code: 200, message: 'Shift Logs retrieved successfully.', data: shiftLogs });
  } catch (error) {
    next(error);
  }
};

exports.exportShiftLogs = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { shiftId, startdate, enddate } = req.query;
    let shiftLogs;
    const page = req.query.page || 1;
    if (startdate && enddate) {
      shiftLogs = await LogsModel.find({ shiftId })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        // .populate('shiftId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
      shiftLogs = await LogsModel.find({ shiftId })
        // .populate('shiftId')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    worksheet.columns = [
      { header: 'Shift Id', key: 'shiftId', width: 25 },
      { header: 'Media', key: 'media', width: 25 },
      { header: 'Log', key: 'log', width: 26 },
    ];
    shiftLogs.forEach((report) => worksheet.addRow(report));
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
      `attachment; filename=shiftLog.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));
  } catch (error) {
    next(error);
  }
};
