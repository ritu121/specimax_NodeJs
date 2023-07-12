const jwt = require('jwt-simple');
const Company = require('../models/company.model');
const APIError = require('../errors/api-error');
const secret = 'MyJwtSpecimaxSecret';
exports.ADMIN = 'admin';
exports.MANAGER = 'manager';

exports.authorize = (role) => (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ code : 403,message: 'No credentials sent!' });
  }
  else{
    try{
      let token = req.headers.authorization.replace('Bearer ','');
      let decoded = jwt.decode(token, secret, true, 'HS256')
      console.log('USER INFO ######################################', decoded)
      req.user = decoded
      next();
    }
    catch(err){
      res.send(401,{code : 401, message : 'User Unauthorized'});
    }
  }
  
}


