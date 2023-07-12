const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');
const Site = require('../models/site.model');
const { omitBy, isNil } = require('lodash');


exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};


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


exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json({code : 200, message : 'User updated successfully.', data: savedUser.transform()});
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};


exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  // const findUser = {_id : req.user._id};
  // const updatedData = req.body;

  // User.updateOne(findUser, updatedData, (err, user) => {
  //   if(err){
  //     res.json({code : 500, message : 'Internal server error.', errors : err });
  //   }

  //   if(user){
  //     res.json({code : 200, message : 'User updated successfully.', data : user });
  //   }
  //   else{
  //     res.json({code : 501, message : 'Something went wrong.', errors : {}  });
  //   }
  // })

  user.save()
    .then((savedUser) => res.json({code : 200, message : 'User updated successfully.', data: savedUser.transform()}))
    .catch((e) => {
      // next(User.checkDuplicateEmail(e))
    });
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    req.query.role='user'
    req.query.isDeleted=false
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    const total = await User.find({role:'user'}).count()
    res.json({code : 200, message : 'User list retrieved successfully.', data: transformedUsers, totalRecords:total});
  } catch (error) {
    next(error);
  }
};


exports.listCompanyUser = async (req, res, next) => {
  try {
    // const {name, email, role, isDeleted} = req.query;
    const sites = await Site.find({companyId : req.params.companyId}).populate('team');
    const siteUsers = [];
    sites.forEach((item) =>{
      if(item.team.length > 0){
        for(var i =0; i < item.team.length; i++){
          siteUsers.push(item.team[i]);
        }
      }
    })
      res.json({code : 200, message : 'Company User list retrieved successfully.', data: siteUsers, total : siteUsers.length});
    } catch (error) {
      next(error);
    }
};

exports.listApp = async (req, res, next) => {
  try {
    const {name, email, role, isDeleted} = req.query;
    const options = omitBy({ name, email, role, isDeleted, login_as : {$nin : ['CLIENT','COMPANY_CLIENT','COMPANY_USER','CLIENT_USER','VENDOR']} }, isNil);

    const users = await User.find(options)
      .populate([
        {
          path :"country",
          model : 'Country'
        }
      ])
      .sort({ createdAt: -1 })
      .exec();

      res.json({code : 200, message : 'User list retrieved successfully.', data: users, total : users.length});
    } catch (error) {
      next(error);
    }
}

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
