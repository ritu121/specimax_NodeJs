const httpStatus = require('http-status');
const { omit } = require('lodash');
const UserGpsSetting = require('../../models/user.gps.setting.model');

const columnList = 'user gpsTrackingDuringShift gpsTrackingHistory allowClientViewGpsTracking';

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  UserGpsSetting.findOne({ user: req.user._id }, columnList).populate([
    {
      path: 'user',
      model: 'User',
    },
  // eslint-disable-next-line consistent-return
  ]).then((gps) => {
    if (gps) {
      res.json({ code: 200, message: 'User gps setting retrieved successfully.', data: gps });
    } else {
      const gps = new UserGpsSetting({
        user: req.user._id,
      });
      gps.save((err, result) => {
        if (err) {
          console.log(err)
        }
      res.json({ code: 200, message: 'User gps setting retrieved successfully.', data: result });
        
      });
      // return res.send(404, { code: 404, message: 'User not found.' });
    }
  }).catch((err) => res.send(401, { code: 401, message: 'Unauthorized', err }));
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const {
    gpsTrackingDuringShift, gpsTrackingHistory, allowClientViewGpsTracking
  } = req.body;
  const user = req.user._id;
  const updatedGps = {
    user, gpsTrackingDuringShift, gpsTrackingHistory, allowClientViewGpsTracking
  };
  const query = { user: req.user._id };

  UserGpsSetting.findOneAndUpdate(query, updatedGps, { new: true }, (err, user) => {
    if (err) { return res.send(500, { code: 500, message: 'Internal server error', err }); }

    if (user) {
      UserGpsSetting.findOne({ user: req.user._id }, columnList).populate([
        {
          path: 'user',
          model: 'User',
        },
      // eslint-disable-next-line consistent-return
      ]).then((data) => {
        if (data) {
          res.json({ code: 200, message: 'Gps setting updated successfully.', data });
        } else {
          return res.send(500, { code: 500, message: 'Internal server error' });
        }
      }).catch((errors) => res.send(500, { code: 500, message: 'Internal server error', errors }));
    } else {
      return res.send(500, { code: 500, message: 'Internal server error' });
    }
  });
};
