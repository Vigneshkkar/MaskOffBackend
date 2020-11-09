const nodemailer = require('nodemailer');
// var hbs = require('nodemailer-express-handlebars');
// const path = require('path');
const Email = require('email-templates');

// console.log(process.env.THE_EMAIL, process.env.THE_PASSWORD);
const transport = {
  //all of the configuration for making a site send an email.

  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // type: 'OAuth2',
    user: process.env.THE_EMAIL,
    pass: process.env.THE_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
  if (error) {
    //if error happened code ends here
    console.error(error);
  } else {
    //this means success
    console.log('Email server setup successfull. Ready to mail.');
  }
});

const email = new Email({
  message: {
    from: process.env.THE_EMAIL,
    attachments: [
      {
        filename: 'logo.png',
        path: __dirname + '/../emails/OTP/logo.png',
        cid: 'logo',
      },
    ],
  },
  // uncomment below to send emails in development/test env:
  send: true,
  preview: false,
  transport: transporter,
});

// transporter.use(
//   'compile',
//   hbs({
//     viewEngine: 'express-handlebars',
//     viewPath: 'src/templates/',
//   })
// );

module.exports.transporter = email;
