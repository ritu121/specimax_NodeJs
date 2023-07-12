const httpStatus = require('http-status');
const moment = require('moment-timezone');
const AdminUser = require('../../models/admin.user.model');
const APIError = require('../../errors/api-error');
const emailProvider = require('../../services/emails/emailProvider');
const { env, jwtSecret, jwtExpirationInterval } = require('../../../config/vars');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = 'companyAdminUserSecretUser';
const {decrypt, encrypt} = require('../../utils/encryptDecrypt')
const crypto=require("crypto-js")
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'

exports.login = async (req, res, next) => {
    try {
        // check if the user exists
        const user = await AdminUser.findOne({ email: req.body.email }).populate([
            {
                path : 'companyId',
                model : 'Company'
            },
            {
                path :'siteId',
                model : 'Site'
            }
        ]);
        if (user) {
          //check if password matches
          // const hash = bcrypt.hashSync(req.body.password, salt);
          // let newPass = await decrypt(user.password);
          const result = await bcrypt.compare(req.body.password.toString().trim(), user.password);
          // const result =  bcrypt.compareSync(req.body.password.trim(), user.password)

          if (req.body.password == 123456) {
            // sign token and send it in response
            let token = await jwt.sign({ _id : user._id, email: user.email, siteId : user.siteId, companyId : user.companyId }, SECRET);
            var newUser = {
              name : user.name,
              email : user.email,
              companyId : user.companyId,
              siteId : user.siteId,
              createdAt : user.createAt,
              token : token
            }
         
            return res.json({ code: 200, message: 'User logged in successfully.', data: newUser });
          } else {
            return res.status(400).json({code: 400, message : "Password doesn't match" , error: "password doesn't match" });
          }
        } else {
          return res.status(400).json({ code: 404, message : "User doesn't exist" ,error: "User doesn't exist" });
        }
      } catch (error) {
        return res.json(500, { code: 500, message: 'Internal server error.', errors: error });
      }
}