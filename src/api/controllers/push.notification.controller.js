const httpStatus = require('http-status');
const { omit } = require('lodash');
const Notification = require('../models/push.notification.model');
const gcm = require("node-gcm");

exports.addToken = async (data) => {
    let { user } = data;
    let { token } = data;
    let { platform } = data;
    //

    let noti = await Notification.findOne({ user });
    if (noti) {
        noti.token = token;
        noti.platform = platform
        noti.save()
    } else {
        let notification = new Notification(data);
        await notification.save()
    }
    // update token
    // await PushDevice.update({ token: token }, { where: whereQuery });
    return true
}

exports.sendNotification = async (title, message, user) => {
    let message = message;

    const deviceTokens = await Notification.find({
        user
    });
    const tokensArray = deviceTokens.map((u) => u.token);

    // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
    var sender = new gcm.Sender(process.env.FCM_SERVER_KEY);

    // Prepare a message to be sent
    var gcmMessage = new gcm.Message();
    gcmMessage.addNotification("title", title);
    gcmMessage.addNotification("body", message);

    // Actually send the message
    sender.send(gcmMessage, { registrationTokens: tokensArray });

}