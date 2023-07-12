const httpStatus = require('http-status');
const { omit } = require('lodash');
const Task = require('../models/task.model');
const Site = require('../models/site.model');
const TaskLogs = require('../models/usertask.logs.model');
const uuidv4 = require("uuid/v4");
const {getDateRange} = require('../utils/helper');
const TaskActivity = require('../models/task.activity.model')
const { omitBy, isNil } = require('lodash');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const task = await Task.get(id);
    req.locals = { task };
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
  Task.findOne({_id : req.params.taskId})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'siteId',
        model : 'Site'
      },
      {
        path : 'user',
        model : 'User'
      }
    ])
    .then((task) => {
      res.json({code: 201, message: 'Task retrieved successfully.', data: task});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.task.transform());


exports.create = async (req, res, next) => {
  try {
    req.body.groupId = uuidv4();
    var dateRange = await getDateRange(new Date(req.body.startDate), new Date(req.body.endDate));
    var ids = [];
    var days = req.body.recurrenceDay;
    for(var i = 0; i < dateRange.length; i++){
      if(days.includes(dateRange[i].getDay())){
    // if(days.includes(dateRange[i].getDay())){
        req.body.taskDate = dateRange[i];
        req.body.vendor = `${req.user.firstname} ${req.user.lastname}`;
        const task = new Task(req.body);
        const savedTask = await task.save();

        let work = {};
        work.userId = null;
        work.taskId = savedTask._id;
        work.status = 'Open';
        work.note = 'Task Created';
        const activity = new TaskActivity(work);
        const saveActivity = activity.save();
        ids.push(savedTask._id)
      }
    }
    if(ids.length > 0){
      res.status(201).send({code: 201, message: 'Task created successfully.', data: ids});
    }
    else{
      res.status(400).send({code: 400, message: `No recurrence day found between ${req.body.startDate} TO ${req.body.endDate}.`, data: {}});
    }
  }
  catch (error) {
    // console.log(error)
    next(error);
  }
};


exports.replace = async (req, res, next) => {
  try {
    const { task } = req.locals;
    const newTask = new Task(req.body);
    const newTaskObject = omit(newTask.toObject(), '_id');

    await task.updateOne(newTaskObject, { override: true, upsert: true });
    const savedTask = await task.findById(task._id);

    res.json({code: 200, message: 'Task updated successfully.', data: savedTask.transform()});
  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {
  try{
    const updatedTask = omit(req.body);
    const task = await Task.updateOne({_id : req.params.taskId}, updatedTask, async function(err, data){
      if(err){
        next(err)
      }
      let work = {};
      if(req.body.assignedUser){
        work.userId = req.body.assignedUser;
      }
      if(req.body.status){
        work.status = req.body.status;
      }
      
      work.taskId = req.params.taskId;
      work.note = 'Task updated';
      const activity = new TaskActivity(work);
      const saveActivity = activity.save();
      output = await Task.findOne({_id : req.params.taskId});
      res.json({code : 200, message : 'Task updated successfully.', data: output})
    })
  }
  catch(errors) {
    next(errors)
  }

};

/**
 * Get task list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    
    Task.list(req.query)
    .then((tasks) => {
      res.json({code: 201, message: 'Task list retrieved successfully.', data: tasks});
    })
    .catch((errors) => {
      console.log(errors)
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
  } catch (error) {
    console.log(error)
    next(error);
  }
};


exports.listTask = async (req, res, next) => {
  try {
    const {page = 1, perPage = 25, startDate, endDate, siteId} = req.query;
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

    const options = omitBy({ taskDate, isGroup : true,siteId, assignedUser : {$ne : null}}, isNil);

    // console.log('OPTIONS',options)
   
    
    Task.find(options)
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
    ])
    .sort({taskDate : -1})
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec()
    .then((tasks) => {
      res.json({code: 201, message: 'Task list retrieved successfully.', data: tasks});
    })
    .catch((errors) => {
      console.log(errors)
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
  } catch (error) {
    console.log(error)
    next(error);
  }
};



exports.listGroup = async (req, res, next) => {
  try {
    const {page = 1, perPage = 25, companyId, siteId,taskDate,timeDue} = req.query;
    var options = {};

    if(companyId){
      options['companyId'] = companyId;
    }
    if(siteId){
      options['siteId'] = siteId;
    }
    if(taskDate){
      options['taskDate'] = {$gte : taskDate , $lte : taskDate};
    }
    if(timeDue){
      options['timeDue'] = timeDue ;
    }
    options['groupId'] = req.params.groupId;
    let tasks = await Task.find(options)
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
    ])
    .sort({createdAt : -1})
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec();

    res.json({code: 201, message: 'Task list retrieved successfully.', data: tasks});
  } catch (error) {
    console.log(error)
    next(error);
  }
};


// change status
exports.status = async (req, res, next) => {
  try {
    Task.updateOne({_id : req.params.taskId}, {status : req.body.status}, async function(err, task){
      if(err){
        next(err)
      }
 

      let outPut = await Task.findOne({_id : req.params.taskId})
      .populate([
        {
          path : 'companyId',
          model : 'Company'
        },
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'user',
          model : 'User'
        }
      ]);

      let work = {};
      work.userId = output.assignedUser;
      work.taskId = req.params.taskId;
      work.status = output.status;
      work.note = 'Changed Status';
      const activity = new TaskActivity(work);
      const saveActivity = activity.save();

      res.json({code: 201, message: 'Task list retrieved successfully.', data: outPut});
    })
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 * @public
 */
exports.remove = async(req, res, next) => {
  // const { task } = req.locals;
  let task = await Task.findOne({_id : req.params.taskId});
  let work = {};
  work.userId = task.assignedUser;
  work.taskId = task._id;
  work.status = task.status;
  work.note = 'Task Deleted';
  const activity = new TaskActivity(work);
  const saveActivity = activity.save();
  Task.remove({_id : req.params.taskId})
  .then(() => res.json({code : 200, message : 'Task delete successfully.', data : {}}))
    .catch((e) => next(e));
};


