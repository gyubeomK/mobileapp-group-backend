const express = require('express')
//Get the connection to Heroku Database
let pool = require('../utilities/utils').pool
const sourceEmail = process.env.SENDER_EMAIL
var router = express.Router();
var nodemailer = require("nodemailer");
const crypto = require("crypto")
const bodyParser = require("body-parser")
let getHash = require('../utilities/utils').getHash
let sendEmail = require('../utilities/utils').sendEmail
router.use(bodyParser.json())
router.get("/", (request, response) => {
    // created group email for mailing purposes. mail sent from there
    var address = request.query.email
    if(request.query.email) {
    let salt = crypto.randomBytes(32).toString("hex")
    let salted_hash = getHash(address, salt)
    //secure but not in terms of malicious inconvenience. there's a better way, this is too simple
    var url = 'https://mobileapp-group-backend.herokuapp.com/forgotpw?email='
                    + address
    var htmlString1 = '<a href='
    var htmlString2 = '>Generate a temporary password</a>'
    var finalConcat1 = htmlString1.concat(url)
    var fullMessage = finalConcat1.concat(htmlString2)
    sendEmail(sourceEmail, address, "recovery", fullMessage) 
    }
})

module.exports = router