//Get the connection to Heroku Database
let pool = require('./sql_conn.js')
const sourceEmailPw = process.env.SENDER_EMAIL_PW
//We use this create the SHA256 hash
const crypto = require("crypto");
var nodemailer = require("nodemailer")
function sendEmail(origin, receiver, subj, message) {
  //research nodemailer for sending email from node.
  // https://nodemailer.com/about/
  // https://www.w3schools.com/nodejs/nodejs_email.asp
  //create a burner gmail account 
  //make sure you add the password to the environmental variables
  //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab)
  var subjectLine = ''
  if(subj === 'email') {
    subjectLine = 'Verify your email with Group 1\'s app'
  } else if(subj === 'recovery') {
    subjectLine = 'Password change requested with Group 1\'s app'
  }
  if(receiver) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: origin, 
      pass: sourceEmailPw
      }
    })
    var mailOptions = {
      from: origin,
      to: receiver,
      subject: subjectLine,
      html: message
    }
    transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
        console.log(error)
      } else {
        console.log('Email successfully sent:' + info.response)
      }
    })
  } 
  console.log('Email sent to: ' + origin);
}

/**
 * Method to get a salted hash.
 * We put this in its own method to keep consistency
 * @param {string} pw the password to hash
 * @param {string} salt the salt to use when hashing
 */
function getHash(pw, salt) {
    return crypto.createHash("sha256").update(pw + salt).digest("hex");
}

let messaging = require('./pushy_utilities.js') 
module.exports = { 
  pool, getHash , sendEmail, messaging 
}