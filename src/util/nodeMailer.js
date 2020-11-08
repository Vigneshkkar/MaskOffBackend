const nodemailer = require('nodemailer');

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

module.exports.transporter = transporter;
