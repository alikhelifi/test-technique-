import nodemailer from 'nodemailer';
import Email from 'email-templates';
import randomstring from 'randomstring';

export const Error = 'error';
export const Success = 'success';
export const ROLE_ADMIN = 'ADM';
export const ROLE_PDS = 'PDS';
export const ROLE_CBT = 'CBT';

require('dotenv').config();
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORDEMAIL, // generated ethereal password
  },
  tls: { rejectUnauthorized: true },
});

export const sendMail = async ({
  title,
  to,
  from,
  subject,
  type,
  html,
  attachments,
  locals,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const email = new Email({
        transport: transporter,
        send: true,
        preview: false,
      });

      email
        .send({
          template:
            type === 'signup'
              ? 'signup'
              : type === 'pwd'
              ? 'sendReiniPwd'
              : 'origin',
          locals,
          message: {
            from: '',
            to: to,
            subject: subject,
            attachments: attachments,
          },
        })
        .then(e => {
          resolve(true);
        })
        .catch(e => {
          console.log(e);
          resolve(false);
        });
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
};

export const formatJSONResponse = (code, type, message, data = null) => {
  return {
    code,
    type,
    message,
    data,
  };
};

export const generateCode = () => {
  return randomstring.generate({
    length: 16,
    charset: 'alphanumeric',
  });
};

export const removeDuplicates = arr => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};
