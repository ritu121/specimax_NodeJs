const httpStatus = require('http-status');
const { omit } = require('lodash');
const Task = require('../../models/task.model');

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

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.companyId = req.user._id;
    const task = new Task(req.body);
    const savedTask = await task.save();
    Task.findOne({_id : savedTask._id})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'siteId',
        model : 'Site'
      }
    ])
    .then((task) => {
      res.json({code: 201, message: 'Task created successfully.', data: task});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
  }
  catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { task } = req.locals;
    const newTask = new Task(req.body);
    const newTaskObject = omit(newTask.toObject(), '_id');

    await task.updateOne(newTaskObject, { override: true, upsert: true });
    const savedTask = await task.findById(task._id)
                            .populate([
                              {
                                path : 'companyId',
                                model : 'Company'
                              },
                              {
                                path : 'siteId',
                                model : 'Site'
                              }
                            ]);

    res.json({code: 200, message: 'Task updated successfully.', data: savedTask.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedTask = omit(req.body);
  const task = Object.assign(req.locals.task, updatedTask);

  task.save()
    .then(async(task) => {
      await Task.findById(req.params.taskId)
        .populate([
          {
            path : 'companyId',
            model : 'Company'
          },
          {
            path : 'siteId',
            model : 'Site'
          }
        ])
        .then((data) => {
          res.json({code: 200, message: 'Task updated successfully.', data: data});
        })
        .catch((error) => {
          res.json({code: 500, message: 'Internal server error.', errors : error});
        })
    })
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    Task.find({ companyId : req.user._id})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'siteId',
        model : 'Site'
      }
    ])
    .then((tasks) => {
      res.json({code: 201, message: 'Task list retrieved successfully.', data: tasks});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { task } = req.locals;

  task.remove()
  .then(() => res.json({code : 200, message : 'Task delete successfully.', data : {}}))
    .catch((e) => next(e));
};
