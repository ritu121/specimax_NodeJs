const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const roles = ['user', 'admin', 'superadmin', 'schedular'];

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        default: ''
    },
}, {
    timestamps: true,
});

permissionSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'name'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  
   
  });

permissionSchema.statics = {
    roles,
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


    list({
        page = 1, perPage = 30, name, email, role,
    }) {
        const options = omitBy({ name, email, role }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
};


module.exports = mongoose.model('admin_modules', permissionSchema);
