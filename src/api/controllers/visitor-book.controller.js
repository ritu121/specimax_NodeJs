const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/visitor-book.model');
const Site = require('../models/site.model');
const { omitBy, isNil } = require('lodash');
const multer = require('multer');


exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
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

exports.get = (req, res) => res.json({code: 200, message: 'User list retrieved successfully.', data: req.locals.user.transform()});


exports.loggedIn = (req, res) => res.json(req.user.transform());


exports.create = async (req, res, next) => {
  try {
    req.body.login_as='GUARD'
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'User created successfully.', data: savedUser.transform()});
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};


// exports.replace = async (req, res, next) => {
//   try {
//     const { user } = req.locals;
//     const newUser = new User(req.body);
//     const ommitRole = user.role !== 'admin' ? 'role' : '';
//     const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//     await user.updateOne(newUserObject, { override: true, upsert: true });
//     const savedUser = await User.findById(user._id);

//     res.json({code : 200, message : 'User updated successfully.', data: savedUser.transform()});
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };


exports.addSites = async(req, res, next) => {
  // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  let {docId} = req.body
  let up = await User.updateOne({_id:req.body.bookId},{$push:{siteDocuments:docId}})
  res.json({code : 200, message : 'Document updated successfully.', data: up});

};
exports.updateInduction = async(req, res, next) => {
  // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  let {date,siteId} = req.body
  // let up = await User.updateOne({_id:req.body.bookId},{$push:{siteDocuments:docId}})
  res.json({code : 200, message : 'Document updated successfully.',});

};
exports.updateReason = async(req, res, next) => {
  // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  let {purpose} = req.body
  let up = await User.updateOne({_id:req.body.bookId},{$set:{purpose:purpose}})
  res.json({code : 200, message : 'Document updated successfully.', data: up});

};
exports.clockOut = async(req, res, next) => {
  // req.body.answers = [req.body.answersOne,req.body.answersTwo,req.body.answersThree]
  // const addLog = new TaskLogs({'taskId':req.params.taskId,'answers':req.body.answers,'notes':req.body.notes})
  // const saveLog = await addLog.save()
  const {injurySuffered,taskCompleted,reportableIssue,notes}=req.body
  const task = await User.get(req.body.bookId);
  // let task = req.locals.task 
  task.clockOutData={
    injurySuffered,
    taskCompleted,
    reportableIssue,
    notes
  }
  task.checkOut = new Date()
  task.save()
  const upload = multer({ storage }).fields([{name: "picture"}]);
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
        task.clockOutData.media = updateData.media;
        task.save()
        res.json({code: 201, message: 'Clockout successfully.', data: one});
        // TaskLogs.updateOne({_id : saveLog._id},updateData, (err, update) => {
        //   if(err) res.json(500, {code : 200, message : 'Internal server error'})
        //   if(update){
        //       TaskLogs.findOne({_id : saveLog._id})
        //     .then((one) => {
        //       res.status(httpStatus.CREATED);
        //       res.json({code: 201, message: 'Logs created successfully.', data: one});
        //     })
        //     .catch((errors) => {
        //       res.send(500, { code: 500, message: 'INternet server error.', errors : errors });
        //     })
            
        //   }
        //   else{
        //     res.send(500, { code: 500, message: 'INternet server error.' });
        //   }
        // })
      }
    }
    else{
      res.json({code: 201, message: 'Logs created successfully.'});
    }
  }) 
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {

    const users = await User.list(req.query);
    // const transformedUsers = users.map((user) => user.transform());
    // const total = await User.find({role:'user'}).count()
    res.json({code : 200, message : 'User list retrieved successfully.', data: users});
  } catch (error) {
    next(error);
  }
};
exports.history = async (req, res, next) => {
  try {
    req.query.user = req.user.sub
    console.log('aaa',req.user.sub)
    const users = await User.list(req.query);
    // const transformedUsers = users.map((user) => user.transform());
    // const total = await User.find({role:'user'}).count()
    res.json({code : 200, message : 'User list retrieved successfully.', data: users});
  } catch (error) {
    next(error);
  }
};


// exports.listCompanyUser = async (req, res, next) => {
//   try {
//     // const {name, email, role, isDeleted} = req.query;
//     const sites = await Site.find({companyId : req.params.companyId}).populate('team');
//     const siteUsers = [];
//     sites.forEach((item) =>{
//       if(item.team.length > 0){
//         for(var i =0; i < item.team.length; i++){
//           siteUsers.push(item.team[i]);
//         }
//       }
//     })
//       res.json({code : 200, message : 'Company User list retrieved successfully.', data: siteUsers, total : siteUsers.length});
//     } catch (error) {
//       next(error);
//     }
// };

// exports.listApp = async (req, res, next) => {
//   try {
//     const {name, email, role, isDeleted} = req.query;
//     const options = omitBy({ name, email, role, isDeleted, login_as : {$nin : ['CLIENT','COMPANY_CLIENT','COMPANY_USER','CLIENT_USER','VENDOR']} }, isNil);

//     const users = await User.find(options)
//       .populate([
//         {
//           path :"country",
//           model : 'Country'
//         }
//       ])
//       .sort({ createdAt: -1 })
//       .exec();

//       res.json({code : 200, message : 'User list retrieved successfully.', data: users, total : users.length});
//     } catch (error) {
//       next(error);
//     }
// }

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;
  user.isDeleted=true
  user.save()
  .then(() => res.json({code : 200, message : 'User delete successfully.', data : {}}))
    .catch((e) => next(e));
};
