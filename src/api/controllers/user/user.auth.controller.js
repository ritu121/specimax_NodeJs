/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../../models/user.model');
const UserGpsSetting = require('../../models/user.gps.setting.model');
const UserSetting = require('../../models/user.setting.model');
const RefreshToken = require('../../models/refreshToken.model');
const PasswordResetToken = require('../../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../../config/vars');
const APIError = require('../../errors/api-error');
const emailProvider = require('../../services/emails/emailProvider');
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const stripe = require('stripe')('sk_test_51LLPCjCK0aC99gHRt1NdlldC5A0HLZ8LwVk6dcYV5mvGoFVPZvVJphZQDGo8aw3Ry3mE9LVoTvCiNluJDSp0x0iK00cU8eeJ88');

const {sentPushNotification} = require('../../utils/helper.js')
/**
 * Returns a formated object with tokens
 * @private
 */
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

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    User.findOne({ phone: req.body.phone, isVerified: true}, async (err, doc) => {
      if (err) {
        return res.status(500).send({ code: 500, message: 'Internal server error', errors: err });
      }
      if (doc === null) {
        const userData = omit(req.body, 'role');
        userData.otp = 1234;
        let user;
        try {
          user = new User(userData)
          user = await user.save();
        } catch (error) {
          return next(User.checkDuplicateEmail(error));
          
        }

        const customer = await stripe.customers.create({
          email: req.body.email,
        });

        user.stripeId = customer.id;
        if(req.body.deviceToken){
          user.deviceToken = req.body.deviceToken;
        }
        
        user = await user.save()
        const userTransformed = user.transform();

        // add gps setting to user
        const gps = new UserGpsSetting({
          user: userTransformed.id,
        });
        gps.save((err, result) => {
          if (err) {
            console.log(err)
          }
        });

        // add gps setting to user
        const setting = new UserSetting({
          user: userTransformed.id,
        });
        setting.save((err, result) => {
          if (err) {
            console.log(err)
          }
        });
        // const token = generateTokenResponse(user, user.token());
        userTransformed.token = generateTokenResponse(user, user.token());
        if(req.body.deviceToken){
          sentPushNotification('Secuber','Welcome to secuber', req.body.deviceToken)
        }
        
        // return res.json({ token, user: userTransformed });
        return res.status(201).send({ code: httpStatus.CREATED, message: 'User created successfully', data: null });
      }
      // return res.json({ token, user: userTransformed });
      return res.status(500).send({ code: 500, message: 'User with this mobile number already exist.', data: null });
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.verifySignup = async(req,res,next)=>{
  let getUser = await User.findOne({email:req.body.email});
  if (getUser.otp==req.body.otp){
    getUser.isVerified=true
    getUser.save()
    return res.json({ code: 200, message: 'User registered successfully.', data: getUser.transform() });
  }else{
    let err1 =  new APIError({
      message: 'Otp is not matched',
      status: 400,
    });
    next(err1)
    
  }
}
exports.updateStripe = async(req,res,next)=>{
  try {
    const users = await User.find({})
    users.map(async(e)=>{
      const customer = await stripe.customers.create({
        email: e.email,
      });
      e.stripeId = customer.id;
      await e.save();
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email, otp: req.body.otp }, async (err, record) => {
      if (err) {
        let err1 =  new APIError({
          message: 'Otp is not matched',
          status: 400,
        });
        console.log('ERROR1',err)
        next(err1)
      }
      if (record) {
        if (record.isDeleted) return res.json({ code: 400, message: 'Your account is deactivated, please contact to administrator' });
        const conditions = { email: req.body.email };
        const otp = null;
        let deviceToken = null;
        if(req.body.deviceToken){
          deviceToken = req.body.deviceToken;
        }
        const update = { otp , deviceToken};
        // const update = { otp };
        const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);
        const userTransformed = user.transform();
        userTransformed.token = generateTokenResponse(user, accessToken);
        userTransformed.accessToken = accessToken;
        User.findOneAndUpdate(conditions, update, { upsert: true }, async (errors, data) => {
          if (errors) {
            let err =  new APIError({
              message: 'Internal server error',
              status: httpStatus.INTERNAL_SERVER_ERROR,
            });
            next(err)

            // return res.json({
            //   code: 500,
            //   message: 'Internal server error',
            //   errors: [
            //     {
            //       field: 'error',
            //       error: 'Internal server error',
            //     },
            //   ],
            // });
          }
        });
        if(req.body.deviceToken){
          sentPushNotification('Secuber','Welcome to secuber', req.body.deviceToken)
        }
        return res.json({ code: 200, message: 'User logged in successfully.', data: userTransformed });
      }
      
      return res.json({
        code: 400,
        message: 'Otp is not matched',
        errors: [
          {
            field: 'otp',
            error: 'Otp is not matched',
          },
        ],
      });
    });
  } catch (error) {
    return next(error);
  }
};

exports.otp = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email}, (err, user) => {
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
        
        let err=  new APIError({
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
      var update = {};
      if(req.body.deviceToken){
        update = {otp, deviceToken}
      }
      else{
         update = { otp };
      }
      
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

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
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
