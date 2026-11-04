const User = require('../models/userModel')
const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//Registration
let registrationController = async (req, res) => {
  console.log(req.file);
  
  try {
  let {name,email} = req.body

  let existingMail = await User.findOne({email: email})
  if (existingMail) {
    return res.send("mail ache")
  }

  let user = new User({
    name: name,
    email: email
  })
  await user.save()
  
    const info = await transporter.sendMail({
      from: `"Example Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Hw",
      html: `<body style=margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif><table cellpadding=0 cellspacing=0 style="padding:40px 15px;background:#f5f5f5"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style=max-width:550px;background:#fff;border-radius:10px;overflow:hidden width=100%><tr><td align=center style=background:#171717;padding:30px><h1 style=margin:0;color:#fff;font-size:28px;letter-spacing:2px>SHOPZONE</h1><p style="margin:8px 0 0;color:#d4d4d4;font-size:11px;letter-spacing:2px">YOUR STYLE. YOUR CHOICE.<tr><td style="padding:40px 30px"><h2 style="text-align:center;color:#171717;font-size:25px;margin:0 0 10px">Welcome to ShopZone!</h2><h3 style=text-align:center;color:#404040;font-size:18px;font-weight:400>Verify Your Email Address</h3><p style=color:#404040;font-size:15px;line-height:1.8;margin-top:30px>Hey <strong>${name}</strong>,<p style=color:#525252;font-size:14px;line-height:1.8>Thank you for joining ShopZone! We're excited to have you. Please verify your email address to activate your account and start shopping with us.(sir ajke ki tik pabo hw te)<div style="text-align:center;margin:35px 0"><a href={{verificationUrl}} style="display:inline-block;background:#171717;color:#fff;padding:16px 35px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:1px">VERIFY MY EMAIL</a></div><p style=text-align:center;color:#737373;font-size:12px>This verification link expires in <strong>15 minutes.</strong><p style=color:#737373;font-size:13px;line-height:1.7;margin-top:25px>If the button doesn't work, copy and paste this link into your browser:</p><a href={{verificationUrl}} style=color:#2563eb;font-size:12px;word-break:break-all>{{verificationUrl}}</a><tr><td align=center style="background:#f8f8f8;padding:25px;border-top:1px solid #eee"><p style=color:#737373;font-size:12px;line-height:1.7>If you didn't create an account, you can safely ignore this email.<p style=color:#a3a3a3;font-size:11px>© 2026 ShopZone. All rights reserved.</table></table>`,
    });
  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error("Error while sending mail:", err);
    }

  res.status(201).json({
    message: "Pass"
  })
}

module.exports = {registrationController}