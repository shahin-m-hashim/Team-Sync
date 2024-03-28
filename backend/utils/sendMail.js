const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendMail = async (user, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    // Render the email template
    const emailTemplatePath = path.join(
      __dirname,
      "../templates/resetPassEmail.ejs"
    );
    const renderedEmailTemplate = await ejs.renderFile(emailTemplatePath, {
      name: user.name,
      otp,
    });

    // Define email options
    let mailOptions = {
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: "Password Reset OTP",
      html: renderedEmailTemplate,
    };

    // Send email
    const { envelope } = await transporter.sendMail(mailOptions);
    console.log("Email sent:", envelope);
  } catch (e) {
    console.log("Error in sending email:", e.message);
  }
};

module.exports = sendMail;
