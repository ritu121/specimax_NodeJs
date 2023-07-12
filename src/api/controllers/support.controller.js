const httpStatus = require('http-status');
const { omit } = require('lodash');
const Support = require('../models/support.model');
const exceljs = require('exceljs');
var moment = require('moment-timezone');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const support = await Support.get(id);
    req.locals = { support };
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
  res.json({code: 200, message: 'Support list retrieved successfully.', data: req.locals.support.transform()})
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.support.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const support = new Support(req.body);
    const savedSupport = await support.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Support created successfully.', data: savedSupport.transform()});
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
    const { support } = req.locals;
    const newSupport = new Support(req.body);
    const newSupportObject = omit(newSupport.toObject(), '_id');

    await support.updateOne(newSupportObject, { override: true, upsert: true });
    const savedSupport = await Support.findById(support._id);

    res.json({code: 200, message: 'Support query updated successfully.', data: savedSupport.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedSupport = omit(req.body);
  const support = Object.assign(req.locals.support, updatedSupport);
  if(updatedSupport.statusId=='62c79ba8775e494440db0fe9'){
    support.closeDate=new Date()
  }
  support.save()
    .then((savedSupport) => res.json({code : 200, message : 'Support query updated successfully.', data: savedSupport.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
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
    // await list.then((supports) => {
      res.json({code : 200, message : 'Support list retrieved successfully.', data: list});
    // })
    // .catch((error) => {
    //   res.json(500, {code : 500, message : 'Internal server error.', errors : error});
    // })
    // const supports = await Support.list(req.query);
    // const transformedSupports = supports.map((status) => status.transform());
    // res.json({code : 200, message : 'Support list retrieved successfully.', data: transformedSupports});
    
  } catch (error) {
    next(error);
  }
};

exports.exportSupport = async(req,res,next)=>{
  let support = await Support.find({}).populate([
    {
      path : "userId",
      model : "User"
    },
    {
      path : "statusId",
      model: "SupportStatus"
    }
  ])
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  worksheet.columns = [
    { header: 'Email', key: 'userName', width: 25 },
    { header: 'Status', key: 'statusName', width: 25 },
    { header: 'Title', key: 'title', width: 25 },
    { header: 'Issue', key: 'issue', width: 25 },
    { header: 'Tikit Id', key: 'ticketId', width: 25 },
  ];
  support.forEach((data) => {
    data.statusName = data.statusId?.name
    data.userName = data.userId?.email
    worksheet.addRow(data)
  });
  worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
  });
  res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  );
  res.setHeader(
      'Content-Disposition',
      `attachment; filename=SupportRequests.xlsx`
  );
  return workbook.xlsx.write(res).then(() => res.status(200));
}

exports.listForUser = async (req, res, next) => {
  try {
    Support.find({userId:req.user._id }).populate([
      {
        path : "userId",
        model : "User"
      },
      {
        path : "statusId",
        model: "SupportStatus"
      }
    ])
    .then((supports) => {
      res.json({code : 200, message : 'Support request list retrieved successfully.', data: supports});
    })
    .catch((error) => {
      res.json(500, {code : 500, message : 'Internal server error.', errors : error});
    })
  } catch (error) {
    next(error);
  }
};

exports.createRequestForUser = async (req, res, next) => {
  try {
    let support = new Support({
      userId : req.user._id,
      title : req.body.title,
      issue : req.body.issue
    });
    support.save(function(err, data){
      if(err){
        res.json(500, { code : 500, message : 'Internal server error', errors : err})
      }
      if(data){
        Support.findOne({_id : data._id}).populate([
          {
            path : "userId",
            model : "User"
          },
          {
            path : "statusId",
            model: "SupportStatus"
          }
        ])
        .then((getSupport) => {
          res.json({code : 200, message : 'Support request created successfully.', data: getSupport});
        })
        .catch((error) => {
          res.json(500, {code : 500, message : 'Internal server error.', errors : error});
        })
      }
    })
    
  } catch (error) {
    next(error);
  }
};

exports.updateRequestForUser = async (req, res, next) => {
  try {
    let support = {
      userId : req.user._id,
      title : req.body.title,
      issue : req.body.issue
    };
    await Support.updateOne({_id : req.params.supportId, userId : req.user._id}, support, function(err, data){
      if(err){
        res.json(500, { code : 500, message : 'Internal server error', errors : err})
      }
      if(data){
        Support.findOne({_id : req.params.supportId}).populate([
          {
            path : "userId",
            model : "User"
          },
          {
            path : "statusId",
            model: "SupportStatus"
          }
        ])
        .then((getSupport) => {
          res.json({code : 200, message : 'Support request retrieve successfully.', data: getSupport});
        })
        .catch((error) => {
          res.json(500, {code : 500, message : 'Internal server error.', errors : error});
        })
      }
    })
    
  } catch (error) {
    next(error);
  }
};


exports.remove = (req, res, next) => {
  const { support } = req.locals;
  support.remove()
    .then(() => res.json(200, { message : 'Support deleted successfully.'}))
    .catch((e) => next(e));
};
