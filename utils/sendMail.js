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
        console.log("Sending email to:", to);
        const info = await transporter.sendMail({

            from: `"StayNest" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });

        console.log("Email Sent:", info.messageId);

    }

    catch(err){

    console.log("========== MAIL ERROR ==========");

    console.error(err);

    console.log("===============================");

    throw err;

}

}

module.exports = sendMail;