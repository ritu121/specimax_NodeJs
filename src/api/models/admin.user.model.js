const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/*  1-live, 2-site-team, 3-site-setting, 4- read-roster, 5-write-roster, 6-sitedoc, 7-siteoverviw, 8-inspection form,
9-guard,10 traker,11-timesheet, 12-schedular, 13-reports, 14-users, 15-alert, 16-safetytip,17.app, 18-notifications,19-FAQ, 18-support
*/
const permissions = [ ]

const adminUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  lastName: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 512,
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },
  roleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin_roles',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'VendorClients',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: true,
  },
 
}, {
  timestamps: true,
});


adminUserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});


adminUserSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'firstName', 'lastName', 'email','password', 'companyId', 'siteId', 'createdAt'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },

  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
      mob: this.email
    };
    return jwt.encode(payload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
adminUserSchema.statics = {
  async get(id) {
    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }
    throw new APIError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  async findAndGenerateTokenByEmail(options) {
    const { email, otp, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });
    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (otp) {
      return { user, accessToken: user.token() };
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },


  list({
    page = 1, perPage = 30, firstName, lastName, email, siteId, companyId
  }) {
    const options = omitBy({ firstName, lastName,email, siteId, companyId }, isNil);

    return this.find(options)
      .populate([
        {
          path :"companyId",
          model : 'Company'
        },
        {
            path :"siteId",
            model : 'Site'
        },
        {
          path : "roleId",
          model : "admin_roles"
        },
        {
          path : "vendorId",
          model : "VendorClients"
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },


  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
    }
    return error;
  },

  async oAuthLogin({
    id, email, name, companyId,siteId
  }) {
    const user = await this.findOne({ email });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, firstName, lastName, email, companyId, roleId ,vendorId , siteId,
    });
  },
};


module.exports = mongoose.model('AdminUser', adminUserSchema,'admin_users');
