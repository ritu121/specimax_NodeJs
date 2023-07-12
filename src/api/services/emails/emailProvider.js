const Email = require('email-templates');
const nodemailer = require('nodemailer');
const { emailConfig } = require('../../../config/vars');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  requireTLS: true,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: false, // upgrades later with STARTTLS -- change this based on the PORT
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log('error with email connection');
  }
});

exports.sendLoginOtp = async (user, otp) => {
  const smtp = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  smtp.sendMail({
    to: user.email,
    // from: 'support@spacimax.com',
    from: process.env.EMAIL_USERNAME,
    subject: 'Spacimax OTP',
    html: `<h3>Your Spacimax log in OTP is - ${otp}.</h3>`,
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.log(err);
  });
};

exports.dynamicEmail = async (data) => {
  const smtp = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  smtp.sendMail({
    to: data.email,
    // from: 'support@spacimax.com',
    from: process.env.EMAIL_USERNAME,
    subject: data.subject,
    html: `<h3>${data.desc}</h3>`,
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.log(err);
  });
}


exports.cancelSubscription = async (user) => {
  const smtp = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  smtp.sendMail({
    to: user.email,
    // from: 'support@spacimax.com',
    from: process.env.EMAIL_USERNAME,
    subject: 'Spacimax Subscription canceled',
    html: `<h3>Dear ${user.firstname} ${user.lastname}, Your Spacimax subscription has been cancelled.</h3>`,
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.log(err);
  });
};

exports.resendShiftCode = async (user, otp) => {
  const smtp = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  smtp.sendMail({
    to: user.email,
    // from: 'support@spacimax.com',
    from: process.env.EMAIL_USERNAME,
    subject: 'Spacimax Shift Code',
    html: `<h3>Your Spacimax shift code is - ${otp}.</h3>`,
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.log(err);
  });
};


exports.resendShiftStatus = async (user_email, status) => {
  const smtp = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  smtp.sendMail({
    to: user_email,
    // from: 'support@spacimax.com',
    from: process.env.EMAIL_USERNAME,
    subject: 'Spacimax Shift Status',
    html: `<h3>Your Spacimax shift status changed as - ${status}.</h3>`,
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.log(err);
  });
};

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@your-app.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: 'Test App',
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://your-app/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => console.log('error sending password reset email'));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@your-app.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: 'Test App',
        name: user.name,
      },
    })
    .catch(() => console.log('error sending change password email'));
};
