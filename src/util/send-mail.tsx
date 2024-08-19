export default async function SendMail({ email, subject, html }: {  email: string, subject: string, html: string }) : Promise<string> {
   
   
    const transporter = require('nodemailer').createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
   
   
    // Email sending logic
    const mailOptions = {
        from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
        to: email,
        subject,
        html,
        // You can also include attachments, images, etc. as per your requirements
    };

    transporter.sendMail(mailOptions, function (error : any, info : any) {
        if (error){
            
            console.log('Email could not be sent: ', error);
            return "error sending email"
        }
        else{
            console.log('Email sent: ' + info.response);
            return "successfully sent mail";


        } 
    });

    return ""


}