const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) create a transpoter
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) define the email options
  const mailOptions = {
    from: "Aziz hajjem <azizhajjem1920@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) send the email with nodemailer
  await transpoter.sendMail(mailOptions);
};
module.exports = sendEmail;
