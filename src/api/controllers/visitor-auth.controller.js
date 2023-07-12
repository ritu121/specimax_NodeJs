const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/visitor.model');
const VisitorBook = require('../models/visitor-book.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');

function generateTokenResponse(user, accessToken) {
  return {
    code: 200,
    message: 'Token refresh successfully.',
    data : {
      tokenType: 'Bearer',
      refreshToken : RefreshToken.generate(user).token,
      expiresIn : moment().add(jwtExpirationInterval, 'minutes')
    }
  };
}

exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const user = await new User(userData).save();
    const userTransformed = user.transform();
    // const token = generateTokenResponse(user, user.token());
    userTransformed.token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    // return res.json({ token, user: userTransformed });
    return res.json({ code: httpStatus.CREATED, message: 'User created successfully', data: null });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateTokenByEmail(req.body);

    User.findOne({_id : user.id}, async(err, person) => {
      if(err) return res.json({code : 500, message : 'Internal server error', errors : err})
      if(person !== null){
        // person.token = generateTokenResponse(user, accessToken);
        // person.accessToken = accessToken;
        var data = {
         id: person._id,
         firstname: person.firstname,
         lastname: person.lastname,
         email : person.email,
         role: person.role,
         picture : person.picture,
         createdAt: person.createdAt,
         updatedAt: person.updatedAt,
         token : generateTokenResponse(user, accessToken),
         accessToken : accessToken
        }
        let tdate = new Date()
        let visitorBook = {
          siteId:req.body.site,
          visitDate: tdate,
          user: person._id,
          lat: req.body.lat,
          lng: req.body.lng,
          checkIn: new Date(),
        }
        // let log = await VisitorBook.updateOne({user:person._id,siteId:req.body.site},visitorBook,{ upsert: true })
        let log = await VisitorBook.findOne({user:person._id,siteId:req.body.site})
        console.log('aaa',log)
        if(log){
          VisitorBook.updateOne({_id:log._id},visitorBook)
        }else{
         let book = new VisitorBook(visitorBook)
         await book.save()
         log=book
        }
        console.log('aaa',log)
        data.bookId= log._id
        return res.json({ code: 200, message: 'User logged in successfully.', data: data });
      }
      else{
        return res.status(404).json({ code: 404, message: 'Invalid email or password, Please try again.', errors : {} });
      }
    })
    
    // const userTransformed = user.transform();
    // userTransformed.token = generateTokenResponse(user, accessToken);
    // userTransformed.accessToken = accessToken;
    // // return res.json({data: userTransformed});
    // return res.json({ code: 200, message: 'User logged in successfully.', data: userTransformed });
  } catch (error) {
    return next(error);
  }
};

exports.otp = async (req, res, next) => {
  try {
    const otp = 1234;
    const conditions = { email: req.body.email };
    const update = { otp };
    User.findOneAndUpdate(conditions, update, { upsert: true }, (errors, user) => {
      if (errors) return res.send(500, { code: 500, message: 'Internal server error', errors });
      console.log('usr',user)
      emailProvider.sendLoginOtp(conditions, otp);
      res.status(httpStatus.OK);
      return res.json({ code: 200, message: 'Your one time OTP send it on your email.', data: null });
    });
    // User.findOne({ email: req.body.email}, (err, user) => {
    //   if (err) {
    //     return res.json({
    //       code: 404,
    //       message: 'user not found',
    //       errors: [
    //         {
    //           field: 'email',
    //           error: 'Email not found in our records',
    //         },
    //       ],
    //     });
    //   }

    //   if (user === null) {
    //     return res.json({
    //       code: 404,
    //       message: 'user not found',
    //       errors: [
    //         {
    //           field: 'email',
    //           error: 'Email not found in our records',
    //         },
    //       ],
    //     });
    //   }
    //   // const otp = Math.floor(1000 + Math.random() * 9000);
      

    //   User.findOneAndUpdate(conditions, update, { upsert: true }, (errors, user) => {
    //     if (errors) return res.send(500, { code: 500, message: 'Internal server error', errors });
    //     emailProvider.sendLoginOtp(user, otp);
    //     res.status(httpStatus.OK);
    //     return res.json({ code: 200, message: 'Your one time OTP send it on your email.', data: null });
    //   });
    // });
  } catch (error) {
    return next(error);
  }
};

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
      return res.json({code : 200, message: 'Reset password link sent it on email.'});
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
