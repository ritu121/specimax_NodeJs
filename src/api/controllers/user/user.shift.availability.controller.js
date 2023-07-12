const httpStatus = require('http-status');
const { omit } = require('lodash');
const Availability = require('../../models/shift.availability.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const availability = await Availability.get(id);
    req.locals = { availability };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async(req, res) => {
  await Availability.find({ user: req.user._id }).sort({dayId:1})
    .then((availability) => {
      if (availability.length === 0) {
        const user_id = req.user._id;
        const sample = [
          {user: user_id, dayId: 1, day: 'Monday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 2, day: 'Tuesday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 3, day: 'Wednesday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 4, day: 'Thursday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 5, day: 'Friday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 6, day: 'Saturday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
          {user: user_id, dayId: 7, day: 'Sunday', startTime: '10:00 AM', endTime: '07:00 PM', availability: false},
        ];

        Availability.insertMany(sample).then((data) => {
          res.send(200, { code: 200, message: 'Availability list retrieved successfully.', data });
        }).catch((error) => {
          res.send(500, { code: 500, message: 'Internal server error.', errors: error });
        });
      } else {
        res.send(200, { code: 200, message: 'Availability list retrieved successfully.', data: availability });
      }
    }).catch((errors) => {
      res.send(500, { code: 500, message: 'Internal server error.', errors });
    });
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.availability.transform());

exports.update = (req, res, next) => {
  const updateSetting = omit(req.body);
  const query = { user: req.user._id, _id : req.params.availabilityId};

  Availability.findOneAndUpdate(query, updateSetting, { upsert: true }, (err, doc) => {
    if (err) return res.send(500, { code: 500, message: 'Internal server error', errors: err });
    if (doc) {
      Availability.findOne({ _id: doc._id }, (err, data) => {
        if (err) return res.send(500, { code: 500, message: 'Internal server error', errors: err });
        res.json(200, { code: 200, message: 'Availability updated successfully.', data });
      });
    } else {
      return res.send(500, { code: 500, message: 'Internal server error' });
    }
  });
};
