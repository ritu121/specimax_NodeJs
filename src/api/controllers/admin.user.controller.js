const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/admin.user.model');
const bcrypt = require('bcryptjs');
const {encrypt, decrypt} = require('../utils/encryptDecrypt')

exports.load = async (req, res, next, id) => {
  try {
    const user = null;
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json({code: 200, message: 'City list retrieved successfully.', data: req.locals.user.transform()});

exports.loggedIn = (req, res) => res.json(req.user.transform());

exports.create = async (req, res, next) => {
  try {
    User.findOne({email : req.body.email}, async function(err, data){
      if(err){
        res.json(500, {code: 500, message: 'Internal server error.', errors: err});
      }
      if(data){
        res.json(400, {code: 400, message: 'Email address already exists try different one.'});
      }
      else{
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = await bcrypt.hash(12345678, 10);
        // req.body.password = bcrypt.hashSync(req.body.password.trim(), 10);
        // req.body.password  = hash;
        // console.log(await encrypt(req.body.password))
        // req.body.password = await encrypt(req.body.password)
        req.body.login_as = 'CLIENT_USER'
        const user = new User(req.body);
        const savedUser = await user.save();
        const getUser = await User.findOne({_id : savedUser._id},'_id firstName lastName email companyId roleId vendorId siteId password').populate('companyId roleId vendorId siteId');
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Admin user created successfully.', data: getUser});
        // res.json({code: 201, message: 'Admin user created successfully.', data: {}});
      }
    })
    
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const newUserObject = omit(newUser.toObject(), '_id');

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await user.findById(user._id);

    res.json({code: 200, message: 'Admin user updated successfully.', data: savedUser.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  // if(req.body.password){
  //   req.body.password = await bcrypt.hash(req.body.password, 10);
  // }
  req.body.login_as = 'CLIENT_USER'
  const updatedUser = omit(req.body);
  await User.updateOne({_id : req.params.userId}, updatedUser, async function(err, user){
     if(err){
        next(err)
     }

     let data = await User.findOne({_id : req.params.userId},'_id firstName lastName email companyId roleId vendorId siteId password').populate('companyId roleId vendorId siteId');
     res.json({code : 200, message : 'Admin user updated successfully.', data: data})
  })
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((status) => status.transform());
    res.json({code : 200, message : 'Admin user list retrieved successfully.', data: transformedUsers});
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  User.remove({_id : req.params.userId})
    .then(() => res.json({code : 200, message : 'Admin user delete successfully.', data : {}}))
    .catch((e) => next(e));
};


exports.status = async(req, res, next) => {
  let id = req.params.userId;
  let isVerified = req.body.isVerified;
  await User.updateOne({_id : id, login_as : 'CLIENT_USER'},{isVerified : isVerified}, function(err, user){
    if(err){
      next(err)
    }

    if(user === null){
      res.json({code : 403, message : 'User not found.'})
    }

    res.json({code : 200, message : `Admin user ${isVerified ? 'activated' : 'deactivated'} successfully.`, data : user})
  })
};
