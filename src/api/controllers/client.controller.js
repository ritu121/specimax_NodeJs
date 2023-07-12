const httpStatus = require('http-status');
const { omit } = require('lodash');
const { omitBy, isNil } = require('lodash');
const User = require('../models/user.model');
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

exports.get = (req, res) => res.json({code: 200, message: 'Client list retrieved successfully.', data: req.locals.user.transform()});

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
        req.body.password = await bcrypt.hash('12345678', 10);
        // req.body.password = bcrypt.hashSync(req.body.password.trim(), 10);
        // req.body.password  = hash;
        // console.log(await encrypt(req.body.password))
        // req.body.password = await encrypt(req.body.password)
        req.body.login_as = 'COMPANY_CLIENT'
        req.body.roleId = '63dbb11c0ce93618efd01a2a';
        const user = new User(req.body);
        const savedUser = await user.save();
        const getUser = await User.findOne({_id : savedUser._id},'_id firstname lastname email company sites address login_as isVerified latitude longitude').populate('company roleId sites');
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Client created successfully.', data: getUser});
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
    req.body.login_as = 'COMPANY_CLIENT'
    req.body.roleId = '63dbb11c0ce93618efd01a2a';
    const newUser = new User(req.body);
    const newUserObject = omit(newUser.toObject(), '_id');

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await user.findById(user._id);

    res.json({code: 200, message: 'Client updated successfully.', data: savedUser.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  // if(req.body.password){
  //   req.body.password = await bcrypt.hash(req.body.password, 10);
  // }
  req.body.login_as = 'COMPANY_CLIENT'
  req.body.roleId = '63dbb11c0ce93618efd01a2a';
  const updatedUser = omit(req.body);
  await User.updateOne({_id : req.params.userId}, updatedUser, async function(err, user){
     if(err){
        next(err)
     }
     if(user){
        let data = await User.findOne({_id : req.params.userId},'_id firstname lastname email company sites address login_as isVerified latitude longitude').populate('company roleId sites');
        res.json({code : 200, message : 'Client updated successfully.', data: data})
     }

     
  })
};

exports.list = async (req, res, next) => {
  try {
    const {firstname, lastname, email, company, sites, page = 1, perPage = 25, login_as = 'COMPANY_CLIENT'} = req.query;
    const options = omitBy({ firstname,  lastname, email, company, sites, login_as}, isNil);

    const users = await User.find(options,'_id firstname lastname email company sites address login_as isVerified latitude longitude createdAt').populate('company roleId sites')
    .sort({ createdAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec();
    // const transformedUsers = users.map((status) => status.transform());
    res.json({code : 200, message : 'Client list retrieved successfully.', data: users});
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  User.remove({_id : req.params.userId})
    .then(() => res.json({code : 200, message : 'Client delete successfully.', data : {}}))
    .catch((e) => next(e));
};


exports.status = async(req, res, next) => {
  let id = req.params.userId;
  let isVerified = req.body.isVerified;
  await User.updateOne({_id : id, login_as : 'COMPANY_CLIENT'},{isVerified : isVerified}, async function(err, user){
    if(err){
      next(err)
    }

    if(user === null){
      res.json({code : 403, message : 'Client not found.'})
    }

    let newUser = await User.findOne({_id : id},'_id firstname lastname email company sites address login_as isVerified latitude longitude').populate('company roleId sites');
    res.json({code : 200, message : `Client ${isVerified ? 'activated' : 'deactivated'} successfully.`, data : newUser})
  })
};
