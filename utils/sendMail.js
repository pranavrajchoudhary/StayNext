const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

async function sendMail(to, subject, html) {

    try {

        const info = await transporter.sendMail({

            from: `"StayNest" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });

        console.log("Email Sent:", info.messageId);

    }

    catch(err){

        console.log("Mail Error");

        console.log(err);

    }

}

module.exports = sendMail;