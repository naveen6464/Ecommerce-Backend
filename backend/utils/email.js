 const nodemailer= require ("nodemailer");

const sendEmail = async options=>
{
    const transport={
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    }
    const transpoter=nodemailer.createTransport(transport);
const message={
    from:`${process.env.SMTP_FORM_NAME} < ${process.env.SMTP_FORM_EMAIL}>`,
    to:options.email,
    subject:options.object,
    text:options.message
}

  await  transpoter.sendMail(message)

}

module.exports= sendEmail;