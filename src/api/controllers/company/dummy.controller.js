const httpStatus = require('http-status');
const moment = require('moment-timezone');
const Company = require('../../models/company.model');
const AdmModules = require('../../models/admin.modules');
const User = require('../../models/user.model');
const APIError = require('../../errors/api-error');
const emailProvider = require('../../services/emails/emailProvider');
const { env, jwtSecret, jwtExpirationInterval } = require('../../../config/vars');
const RefreshToken = require('../../models/refreshToken.model');
const AdminRole = require('../../models/admin.roles.model')


const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const secret = 'MyJwtSpecimaxSecret';


function generateTokenResponse(user, accessToken) {
  return {
    code: 200,
    message: 'Token refresh successfully.',
    data: {
      tokenType: 'Bearer',
      refreshToken: RefreshToken.generate(user).token,
      expiresIn: moment().add(jwtExpirationInterval, 'minutes'),
    },
  };
}


exports.login = async (req, res, next) => {
  try {

    // User.findOne({ email: req.body.email, otp: req.body.otp, login_as:{$in:['CLIENT','GUARD','VENDOR']}, role:'admin' })
    var user =  await User.findOne({email : req.body.email});
    if(user){
      if(user.login_as == 'CLIENT_USER'){
        User.findOne({ email: req.body.email, otp: req.body.otp, login_as:'CLIENT_USER' })
        .select("_id firstname lastname email company roleId vendor sites login_as")
        .populate([
          {
            path : 'company',
            model : 'Company'
          },
          {
            path : 'roleId',
            model : 'admin_roles'
          },
          {
            path : 'vendor',
            model : 'VendorClients'
          },
          {
            path : 'sites',
            model : 'Site'
          }
        ])
        .then(async (data) => {
          
          if (data) {
            // console.log('Data ', data)
            // const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);
            // data.type='company';
            // data.role = 'admin'
            // // data.permissions = await 
            // let permissions = await AdminRole.findOne({_id : data.roleId._id}).populate('admin_modules');
            // console.log('PERMISSSION',permissions.permissions);
            // data.permissions = permissions.permissions;
            // data.token = generateTokenResponse(user, accessToken);
            // data.accessToken = accessToken;

            data.type = 'company'
            // let token = await jwt.encode(data, jwtSecret);
            req.body.password = 12345678;
            const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);
            // console.log('BODY @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', req.body)
            const modules = await AdmModules.find({});
            user.type='company';
            const userTransformed = user.transform();
            userTransformed.role = 'admin'
            userTransformed.permissions = data.roleId.permissions
            userTransformed.permissions = modules
            userTransformed.token = generateTokenResponse(user, accessToken);
            userTransformed.accessToken = accessToken;
            return res.send({ code: 200, message: 'User logged in successfully.', data: userTransformed });

          //   data.type = 'company'
          // if(data.login_as!='GUARD')
          // companyData = await Company.findOne({email:data.email})
          // else
          // companyData = {}
          // // let token = await jwt.encode(data, jwtSecret);
          // const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);
          // const modules = await AdmModules.find({});
          // user.type='company';
          // user.companyId=companyData._id
          // const userTransformed = user.transform();
          // userTransformed.role = 'admin'
          // userTransformed.permissions = data.roleId.permissions
          // // userTransformed.permissions = modules
          // userTransformed.token = generateTokenResponse(user, accessToken);
          // userTransformed.accessToken = accessToken;
  
          }
          let err2 = new APIError({
            message: 'Invalid OTP',
            status: httpStatus.INTERNAL_SERVER_ERROR,
          });
          next(err2)
  
        })
        .catch((errors) => {
          console.log(errors)
          return res.send({ code: 404, message: 'Company not found related with this email.' });
        })
      }
      else{
        User.findOne({ email: req.body.email, otp: req.body.otp, login_as:'CLIENT', role:'admin' })
        .populate([
          {
            path: "roleId",
            populate: "permissions"
          }
        ])
        .then(async (data) => {
          if (data) {
            console.log('ENtered')
            // const conditions = { email: req.body.email };
            // const otp = null;
            // const update = { otp };
            // const { user, accessToken } = await Company.findAndGenerateTokenByEmail(req.body);
            // const userTransformed = user.transform();
            // userTransformed.token = generateTokenResponse(user, accessToken);
            // userTransformed.accessToken = accessToken;
            // Company.findOneAndUpdate(conditions, update, { upsert: true }, async (errors, data) => {
            //   if (errors) {
            //     let err =  new APIError({
            //       message: 'Internal server error',
            //       status: httpStatus.INTERNAL_SERVER_ERROR,
            //     });
            //     next(err)
  
            //     // return res.json({
            //     //   code: 500,
            //     //   message: 'Internal server error',
            //     //   errors: [
            //     //     {
            //     //       field: 'error',
            //     //       error: 'Internal server error',
            //     //     },
            //     //   ],
            //     // });
            //   }
            // });
            data.type = 'company'
            if(data.login_as!='GUARD')
            companyData = await Company.findOne({email:data.email})
            else
            companyData = {}
            // let token = await jwt.encode(data, jwtSecret);
            req.body.password = 12345678;
            const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);
            // console.log('BODY @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', req.body)
            const modules = await AdmModules.find({});
            user.type='company';
            user.companyId=companyData._id
            const userTransformed = user.transform();
            userTransformed.role = 'admin'
            userTransformed.permissions = data.roleId.permissions
            userTransformed.permissions = modules
            userTransformed.token = generateTokenResponse(user, accessToken);
            userTransformed.accessToken = accessToken;
  
            // var user = {
            //   _id : data._id,
            //   name : data.name,
            //   email : data.email,
            //   phone : data.phone,
            //   roleId : data.roleId,
            //   createdAt : data.createdAt,
            //   updatedAt : data.updatedAt,
            //   token : token
            // };
  
            return res.send({ code: 200, message: 'User logged in successfully.', data: userTransformed });
  
          }
          let err2 = new APIError({
            message: 'Invalid OTP',
            status: httpStatus.INTERNAL_SERVER_ERROR,
          });
          next(err2)
  
        })
        .catch((errors) => {
          console.log(errors)
          return res.send({ code: 404, message: 'Company not found related with this email.' });
        })
      }
    }
    else{
      res.json( { code: 404, message: 'Company not found related with this email.' })
    }
   
  }
  catch (errors) {
    return res.json(500, { code: 500, message: 'Internal server error.', errors: errors });
  };
};

exports.otp = async (req, res, next) => {
  try {
    // role:'admin'
    User.findOne({ email: req.body.email,login_as:{$in:['CLIENT','GUARD','VENDOR','CLIENT_USER']}}, (err, user) => {
      if (err) {
        let err = new APIError({
          message: 'User does not exist',
          status: httpStatus.NOT_FOUND,
        });
        return next(err)

        // return res.json({
        //   code: 404,
        //   message: 'user not found',
        //   errors: [
        //     {
        //       field: 'email',
        //       error: 'Email not found in our records',
        //     },
        //   ],
        // });
      }

      if (user === null) {

        let err = new APIError({
          message: 'User does not exist',
          status: httpStatus.NOT_FOUND,
        });
        return next(err)
        // return res.json({
        //   code: 404,
        //   message: 'user not found',
        //   errors: [
        //     {
        //       field: 'email',
        //       error: 'Email not found in our records',
        //     },
        //   ],
        // });
      }
      // const otp = Math.floor(1000 + Math.random() * 9000);
      const otp = 1234;
      const conditions = { email: req.body.email };
      const update = { otp };

      User.findOneAndUpdate(conditions, update, { upsert: true }, (errors, user) => {
        if (errors) return res.send(500, { code: 500, message: 'Internal server error', errors });
        emailProvider.sendLoginOtp(user, otp);
        res.status(httpStatus.OK);
        return res.json({ code: 200, message: 'Your one time OTP send it on your email.', data: null });
      });
    });
  } catch (error) {
    return next(error);
  }
};


exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json({ code: 200, message: 'Reset password link sent it on email.' });
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
