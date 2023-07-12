const httpStatus = require('http-status');
const { omit } = require('lodash');
const Task = require('../../models/task.model');
const User = require('../../models/user.model')
const TaskLogs = require('../../models/usertask.logs.model');
const multer = require('multer');
const {uniqueMergeArray} = require('../../utils/helper');
const TaskActivity = require('../../models/task.activity.model')
const emailProvider = require('../../services/emails/emailProvider');


exports.load = async (req, res, next, id) => {
  try {
    const task = await Task.get(id);
    req.locals = { task };
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
        path: 'taskLogs',
        model: 'TaskLogs'
      }
    ])
    .then((task) => {
      res.json({code: 201, message: 'Task retrieved successfully.', data: task});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
};


exports.loggedIn = (req, res) => res.json(req.task.transform());


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

exports.list = async (req, res, next) => {
  try {
    const {page = 1, perPage = 25} = req.query;
    let user = await User.findOne({phone : req.user.mob});
    let tasks = await Task.find({ 
        taskDate : {$gte : new Date()},
        $or : [
          {
            status : 'opened'
          },
          
        ]
      })
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
        path : 'assignedUser',
        model : 'User'
      }
    ])
    .sort({createdAt : -1})
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec()
    // .map((item) => {
    //   if(item.siteId.team.includes(user._id)){
    //     return item;
    //   }
    // })
 
    res.status(201).send({code: 201, message: 'Task list retrieved successfully.', data: tasks});
    
    // .then((tasks) => {
    //   res.status(201).send({code: 201, message: 'Task list retrieved successfully.', data: tasks});
    // })
    // .catch((errors) => {
    //   res.status(201).send(500, {code: 500, message: 'Internal server error.', errors : errors})
    // });
    
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async(req,res,next)=>{
  // console.log('req....',req)
  // return 
  req.body.answers = [req.body.answersOne,req.body.answersTwo,req.body.answersThree]
  const addLog = new TaskLogs({'taskId':req.params.taskId,'answers':req.body.answers,'notes':req.body.notes})
  const saveLog = await addLog.save()
  let task = req.locals.task 
  task.status=req.body.status;
  task.taskLogs = saveLog._id;
  task.assignedUser = req.user.sub
  let updateStatus = await task.save()
  const upload = multer({ storage }).fields([{name: "picture"}, {name: "signature"}]);
  upload(req, res, (err) => {
    if(req.file){
      if (req.fileValidationError) {
        return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
      }
      if (!req.file) {
        return res.send(400, { code: 400, message: 'Please select an image to upload' });
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
      }
      else{

        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const updateData = {
          media: `${baseUrl}/uploads/${req.file.filename}`,
        };
        TaskLogs.updateOne({_id : saveLog._id},updateData, (err, update) => {
          if(err) res.json(500, {code : 200, message : 'Internal server error'})
          if(update){
              TaskLogs.findOne({_id : saveLog._id})
            .then((one) => {
              res.status(httpStatus.CREATED);
              res.json({code: 201, message: 'Logs created successfully.', data: one});
            })
            .catch((errors) => {
              res.send(500, { code: 500, message: 'INternet server error.', errors : errors });
            })
            
          }
          else{
            res.send(500, { code: 500, message: 'INternet server error.' });
          }
        })
      }
    }
    else{
      res.json({code: 201, message: 'Logs created successfully.', data: saveLog});
    }
  }) 
}

// exports.updateStatus = async(req, res, next) =>{
//   try{
//     var user = await User.findOne({phone : req.user.mob})
//     let status = req.body.status;
//     req.body.isGroup = true;
//     let taskOne = await Task.findOne({_id : req.params.taskId})
//     if(taskOne.status !== 'In Process'){
//       if(status === 'In Process'){
//         req.body.assignedUser = user._id;
//         console.log(req.body)
//         let task = await Task.updateOne({_id : req.params.taskId}, req.body, async function(err, data){
//           if(err){
//             next(err)
//           }
//           else{
//             req.body.taskId = req.params.taskId;
//             req.body.userId = user._id;
            
//             let activity = new TaskActivity(req.body);
//             taskActivity = await activity.save();

//             let data = {
//               email : req.body.assignedUse,
//               subject : 'Task Assigned',
//               desc : "New Task assigned to you"
//             };
//             emailProvider.dynamicEmail(data);
//             let updatedTask = await Task.findOne({_id : req.params.taskId});
//             res.status(201).send({code : 201, message : 'Task status updated', data : updatedTask})
//           }
//         })
//       }
//       else{
//         res.status(400).send({code : 400, message : 'You can not change status other than apply.', data : {}})
//       }
//     }
//     else{
//       res.status(400).send({code : 400, message : 'Task already is process.', data : {}})
//     }
//   }
//   catch(errors){
//     console.log(errors)
//     next(errors)
//   }
  
// }

