const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        User: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password mapping
      },
    });

    const mailOptions = {
      from: `"LemonCart Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = sendEmail;