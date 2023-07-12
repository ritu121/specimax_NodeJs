const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../../models/user.model');
const UserExperience = require('../../models/user.experience.model');
const multer = require('multer');
const emailProvider = require('../../services/emails/emailProvider');
const columnList = 'firstname lastname email phone country postcode about login_as licenseNumber expiryDate company jobDecription duration companyRole experiences picture';

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  User.findOne({ _id: req.user._id }, columnList).populate([
    {
      path: 'country',
      model: 'Country',
    },
    {
      path: 'company',
    },
    {
      path: 'companyRole',
    },
    {
      path: 'experiences',
    },
    // eslint-disable-next-line consistent-return
  ]).then((user) => {
    if (user) {
      res.json({ code: 200, message: 'Profile retrieved successfully.', data: user });
    } else {
      return res.send(401, { code: 401, message: 'Unauthorized' });
    }
  }).catch((err) => res.send(401, { code: 401, message: 'Unauthorized', err }));
};

exports.getById = (req, res) => {
  User.findOne({ _id: req.params.userId }, columnList).populate([
    {
      path: 'country',
      model: 'Country',
    },
    {
      path: 'company',
    },
    {
      path: 'companyRole',
    },
    {
      path: 'experiences',
    },
    // eslint-disable-next-line consistent-return
  ]).then((user) => {
    if (user) {
      res.json({ code: 200, message: 'Profile retrieved successfully.', data: user });
    } else {
      return res.send(401, { code: 401, message: 'Unauthorized' });
    }
  }).catch((err) => res.send(401, { code: 401, message: 'Unauthorized', err }));
};

/**
 * Update existing user
 * @public
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
exports.updateProfileImage = async (req, res, next) => {
  const upload = multer({ storage }).single('picture');
  const query = { _id: req.user._id };
  upload(req, res, async (err) => {
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
    req.body.picture = `${baseUrl}/uploads/${req.files.picture[0].filename}`;

    User.findOneAndUpdate(query, req.body, { upsert: true }, (err, user) => {
      if (err) { return res.send(500, { code: 500, message: 'Internal server error', err }); }

      if (user) {
        User.findOne({ _id: req.user._id }, columnList).populate([
          {
            path: 'country',
            model: 'Country',
          },
          {
            path: 'experiences',
          }
          // eslint-disable-next-line consistent-return
        ]).then((data) => {
          if (data) {
            res.json({ code: 200, message: 'Profile updated successfully.', data });
          } else {
            return res.send(500, { code: 500, message: 'Internal server error' });
          }
        }).catch((errors) => res.send(500, { code: 500, message: 'Internal server error', errors }));
      } else {
        return res.send(500, { code: 500, message: 'Internal server error' });
      }
    });

  })
}
exports.update = async (req, res, next) => {
  const query = { _id: req.user._id };
  let exper = []
  for (var i = 0; i < req.body.experience.length; i++) {
    req.body.experience[i].user = req.user._id
    let exp = new UserExperience(req.body.experience[i]);
    let saveExp = await exp.save()
    exper.push(saveExp._id.toString());
    // .then((ans) => {
    //   let id = ans._id;
    // })
    // .catch((error) => {
    //   res.json(500, {code : 500, message : 'Internal server error!', errors : error});
    // })
  }
  req.body.experiences = exper
  User.findOneAndUpdate(query, req.body, { upsert: true }, (err, user) => {
    if (err) { return res.send(500, { code: 500, message: 'Internal server error', err }); }

    if (user) {
      User.findOne({ _id: req.user._id }, columnList).populate([
        {
          path: 'country',
          model: 'Country',
        },
        {
          path: 'experiences',
        }
        // eslint-disable-next-line consistent-return
      ]).then((data) => {
        if (data) {
          // User.findOne(query , (error, upUser) => {
          //   if(error){
          //     res.json({code : 500, message : "Internal server error.",errors : error})
          //   }

          //   if(upUser){
          //     res.json({code : 200, message : 'Profile updated successfully.', data : upUser})
          //   }
          //   else{
          //     res.json({ code : 500, message : 'Internal server error', errors : {}})
          //   }
          // })
          res.json({ code: 200, message: 'Profile updated successfully.', data });
        } else {
          return res.send(500, { code: 500, message: 'Internal server error' });
        }
      }).catch((errors) => res.send(500, { code: 500, message: 'Internal server error', errors }));
    } else {
      return res.send(500, { code: 500, message: 'Internal server error' });
    }
  });
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId,
      { $pull: { experiences: req.params.exprId } },
      { new: true }).exec();
    await UserExperience.findByIdAndDelete(req.params.exprId);
    if (user) {
      return res.json({ code: 200, message: 'Experience deleted successfully.', data: user});
    } else {
      return res.json({ code: 400, message: 'User not found', data: null })
    }
  } catch (error) {
    next(error)
  }
}

exports.updateById = async (req, res, next) => {
  const query = { _id: req.params.userId };
  let exper = []
  for (var i = 0; i < req.body.experience.length; i++) {
    req.body.experience[i].user = req.params.userId
    let exp = new UserExperience(req.body.experience[i]);
    let saveExp = await exp.save()
    exper.push(saveExp._id.toString());
    // .then((ans) => {
    //   let id = ans._id;
    // })
    // .catch((error) => {
    //   res.json(500, {code : 500, message : 'Internal server error!', errors : error});
    // })
  }
  req.body.experiences = exper
  User.findOneAndUpdate(query, req.body, { upsert: true }, (err, user) => {
    if (err) { return res.send(500, { code: 500, message: 'Internal server error', err }); }

    if (user) {
      User.findOne({ _id: req.params.userId }, columnList).populate([
        {
          path: 'country',
          model: 'Country',
        },
        {
          path: 'experiences',
        }
        // eslint-disable-next-line consistent-return
      ]).then((data) => {
        if (data) {
          // User.findOne(query , (error, upUser) => {
          //   if(error){
          //     res.json({code : 500, message : "Internal server error.",errors : error})
          //   }

          //   if(upUser){
          //     res.json({code : 200, message : 'Profile updated successfully.', data : upUser})
          //   }
          //   else{
          //     res.json({ code : 500, message : 'Internal server error', errors : {}})
          //   }
          // })
          res.json({ code: 200, message: 'Profile updated successfully.', data });
        } else {
          return res.send(500, { code: 500, message: 'Internal server error' });
        }
      }).catch((errors) => res.send(500, { code: 500, message: 'Internal server error', errors }));
    } else {
      return res.send(500, { code: 500, message: 'Internal server error' });
    }
  });
};

exports.delete = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },{isVerified : false, isDeleted : true}, (err, user) => {
    if (err) {
      return res.send(401, { code: 401, message: 'Unauthorized' });
    }
   
    emailProvider.cancelSubscription(user);
    res.json({ code: 200, message: 'Profile retrieved successfully.', data: user });
  });
};
