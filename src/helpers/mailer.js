import nodemailer from 'nodemailer';
import serverConfig from '../serverConfig';


/*
 * Private
 * Send an email to validate the user's email
 */

 // create reusable transporter object using the default SMTP transport
 const transporter = nodemailer.createTransport({
     host: serverConfig.smtpHost,
     port: serverConfig.smtpPort,
     secure: serverConfig.smtpSecure, // secure:true for port 465, secure:false for port 587
     auth: {
         user: serverConfig.smtpUser,
         pass: serverConfig.smtpPassword,
     },
 });

 export default transporter.sendMail.bind(transporter);
