//#region : Imported Libraries
const nodemailer = require('nodemailer');
//#endregion

//#region : Function to send an email using Nodemailer
function sendEmail(email, subject, text) {
  // Create a transporter for sending emails using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sportgames540@gmail.com',
      pass: 'ahmwukdzwobzqsur',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Define email options, including sender, recipient, subject, and text
  const mailOptions = {
    from: 'sportgames540@gmail.com',
    to: email,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log('Error ' + err);
    } else {
      console.log('Email sent successfully' + info.response);
    }
  });
}
//#endregion

// Export the sendEmail function for use in other parts of the application
module.exports = { sendEmail };
