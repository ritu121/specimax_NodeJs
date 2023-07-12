const httpStatus = require('http-status');
const { omit } = require('lodash');
const exceljs = require('exceljs')
const moment = require('moment-timezone');
const multer = require('multer');
const TenancyModel = require('../models/tenancy.check.model');
const AreaModel = require('../models/tenancy.areas.model');
const Checkpoint = require('../models/site.checkpoints.model');

exports.load = async (req, res, next, id) => {
  try {
    const tenancy = await TenancyModel.get(id);
    req.locals = { tenancy };
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

exports.get = (req, res) => res.json({ code: 200, message: 'Tenancy Check retrieved successfully.', data: req.locals.tenancy.transform() });

exports.addArea = async (req, res, next) => {
  try {
    // AreaModel
    let check;
    try {
      check = await Checkpoint.findById(req.body.floor)
      if(!check){
        return res.send(500, { code: 500, message: 'Invalid Checkpoint.' });

      }
    } catch (error) {
      let err = new Error('Invalid Scan code')
      next(err)
      return 
    }
    TenancyModel.findById(req.body.tenancyId).populate('floors')
      .exec(async (err, data1) => {
        if (err) {
          return res.json({ code: 500, message: 'Internal server error.' });
        }
        if (data1) {
          let data = data1.floors;
          for (let i = 0; i < data.length; i++) {
            if (data[i].floor == req.body.floor) {
              data[i].endTime = req.body.startTime;
              data[i].save((e, d) => {
                if (e) {
                  return res.json({ code: 500, message: 'Internal server error.' });
                } else {
                  return res.json({ code: 200, message: 'Check updated successfully.' });
                }
              })
            }
          }

          let area = new AreaModel(req.body);
          let savedData = await area.save();
          data1.floors.push(savedData._id);
          data1.notes = req.body.notes;
          data1.save();
          return res.json({ code: 200, message: 'Check updated successfully.' });
        }
      })

    // let area = new AreaModel(req.body)
    // let savedData = await area.save()
    // const updateArea = await TenancyModel.updateOne({_id:req.body.tenancyId},{$push:{floors:savedData._id}})
    // const tenancyData = await TenancyModel.findById(req.body.tenancyId);

    // res.json({code: 200, message: 'Floor added successfully.', data: tenancyData.transform()});
  } catch (error) {
    next(error);
  }
}

exports.submitTenancy = async (req, res, next) => {
  try {
    const updateArea = await TenancyModel.updateOne({ _id: req.body.tenancyId }, { $set: { shiftStatus: "Submitted" } })
    if (updateArea.nModified > 0) {
      res.json({ code: 200, message: 'Floor added successfully.' });
    } else {
      res.json({ code: 500, message: 'Error Submitting Report, Please try again' });
    }
  } catch (error) {
    next(error);
  }
};


exports.update = (req, res, next) => {
  const updatedDuty = omit(req.body);
  const log = Object.assign(req.locals.logs, updatedDuty);

  log.save()
    .then((duty) => res.json({ code: 200, message: 'Checks updated successfully.', data: log.transform() }))
    .catch((e) => next(e));
};

exports.list = async (req, res, next) => {
  try {
    const logs = await LogsModel.list(req.query);
    const transformedLogs = logs.map((log) => log.transform());
    res.json({ code: 200, message: 'Tenancy Check retrieved successfully.', data: transformedLogs });
  } catch (error) {
    next(error);
  }
};


exports.remove = (req, res, next) => {
  const { duty } = req.locals;
  duty.remove()
    .then(() => res.json({ code: 200, message: 'Tenancy Check deleted successfully.', data: null }))
    .catch((e) => next(e));
};

exports.filterTenencyCheck = async (req, res, next) => {
  try {
    const { shiftId, startdate, enddate } = req.query;
    let tenencyCheck;
    const page = req.query.page || 1;
    if (startdate && enddate) {
      tenencyCheck = await TenancyModel.find({ shiftId })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
      tenencyCheck = await TenancyModel.find({ shiftId })
        .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    res.json({ code: 200, message: 'Tenancy Checks retrieved successfully.', data: tenencyCheck });
  } catch (error) {
    next(error);
  }
};

exports.AllTenencyCheck = async (req, res, next) => {
  try {
    // const { shiftId } = req.params;
    const tenencyCheck = await TenancyModel.list(req.query);
    res.json({ code: 200, message: 'Tenancy Checks retrieved successfully.', data: tenencyCheck });
  } catch (error) {
    next(error);
  }
};

exports.exportTenancyCheck = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { shiftId, startdate, enddate } = req.query;
    let tenencyCheck;
    const page = req.query.page || 1;
    if (startdate && enddate) {
      tenencyCheck = await TenancyModel.find({ shiftId })
        .where({
          createdAt: {
            $gte: moment(startdate, 'DD/MM/YYYY'),
            $lt: moment(enddate, 'DD/MM/YYYY'),
          },
        })
        // .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    } else {
      tenencyCheck = await TenancyModel.find({ shiftId })
        // .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .skip(30 * (page - 1))
        .limit(30)
        .exec();
    }
    worksheet.columns = [
      { header: 'Shift Id', key: 'shiftId', width: 25 },
      { header: 'Shift Status', key: 'shiftStatus', width: 25 },
      { header: 'Floors', key: 'floors', width: 26 },
    ];
    tenencyCheck.forEach((report) => worksheet.addRow(report));
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
      `attachment; filename=tenancyCheck.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));
  } catch (error) {
    next(error);
  }
};
