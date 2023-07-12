const httpStatus = require('http-status');
const { omit } = require('lodash');
const Message = require('../../models/support.message.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const message = await Message.get(id);
    req.locals = { message };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  Message.find({supportId : req.params.messageId})
  .populate([
    {
      path: "userId",
      model: "User",
    },
    {
      path: "supportId",
      model: "Support",
    }
  ])
  .then((messages) => {
    res.json(200, {code: 200, message: 'Reply list retrieved successfully.', data: messages})
  })
  .catch((errors) => {
    res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
  })
};


exports.view = (req, res) => {
  Message.findOne({_id : req.params.messageId})
  .populate([
    {
      path: "userId",
      model: "User",
    },
    {
      path: "supportId",
      model: "Support",
    }
  ])
  .then((messages) => {
    if(messages){
      res.json(200, {code: 200, message: 'Reply message retrieved successfully.', data: messages})
    }
    else{
      res.json(404, {code: 404, message: 'Reply message not found.'})
    }
  })
  .catch((errors) => {
    res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
  })
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.message.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const data = {
      userId : req.user._id,
      supportId : req.body.supportId,
      title : req.body.title,
      uType: req.body.uType,
      description : req.body.description
    };

    const message = new Message(data);
    const savedMessage = await message.save(function(err, getMessage){
      Message.findOne({_id : getMessage._id})
      .populate([
        {
          path: "userId",
          model: "User",
        },
        {
          path: "supportId",
          model: "Support",
        }
      ])
      .then((messages) => {
        res.status(httpStatus.CREATED);
        res.json({code: 201, message: 'Reply created successfully.', data: messages});
      })
      .catch((errors) => {
        res.json(500, {code: 500, message: 'Internal server error.', errors : errors});
      })
      
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {

    const query = {_id : req.prams.messageId, userId : req.user._id};
    const updatedData = {
      title : req.body.title,
      description : req.body.description
    };
    Message.updateOne(query, updatedData, function(err, message){
      if(err){
        res.json(500, {code: 500, message: 'Internal server error.', errors : err});
      }
      if(message){
        Message.findOne({_id : message._id})
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "supportId",
            model: "Support",
          }
        ])
        .then((messages) => {
          res.status(httpStatus.CREATED);
          res.json({code: 201, message: 'Reply created successfully.', data: messages});
        })
        .catch((errors) => {
          res.json(500, {code: 500, message: 'Internal server error.', errors : errors});
        })
      }
    })

  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  try {

    const query = {_id : req.params.messageId, userId : req.user._id};
    const updatedData = {
      title : req.body.title,
      description : req.body.description
    };
    Message.updateOne(query, updatedData, function(err, message){
      if(err){
        res.json(500, {code: 500, message: 'Internal server error.', errors : err});
      }
      if(message){
        Message.findOne({_id : req.params.messageId})
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "supportId",
            model: "Support",
          }
        ])
        .then((messages) => {
          res.status(httpStatus.CREATED);
          res.json({code: 201, message: 'Reply updated successfully.', data: messages});
        })
        .catch((errors) => {
          res.json(500, {code: 500, message: 'Internal server error.', errors : errors});
        })
      }
    })

  } catch (error) {
    next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const messages = await Message.list(req.query);
    const transformedMessages = messages.map((faq) => message.transform());
    res.json({code : 200, message : 'Reply list retrieved successfully.', data: transformedMessages});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  Message.deleteOne({_id : req.params.messageId})
  .then((response) => {
    res.json(200, {code : 200, message : 'Reply message deleted successfully.', data: null})
  })
  .catch((err) => {
    res.json(500, {code : 500, message : 'Internal server error.', errors : err})
  })
};
