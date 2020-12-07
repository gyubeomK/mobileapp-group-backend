const express = require('express')
const sourceEmail = process.env.SENDER_EMAIL
//TODO: add pool access 
var router = express.Router();
var nodemailer = require("nodemailer");
const crypto = require("crypto")
const bodyParser = require("body-parser")
let getHash = require('../utilities/utils').getHash
let sendEmail = require('../utilities/utils').sendEmail
router.use(bodyParser.json())
router.get("/", (request, response) => {
    // created group email for mailing purposes. mail sent from there
    var address = request.body.email
    if(request.body.email) {
    let salt = crypto.randomBytes(32).toString("hex")
    let salted_hash = getHash(address, salt)
    const url = 'https://mobileapp-group-backend.herokuapp.com/verified?email='
    var intermediateUrl = url.concat(address)
    var penultimateUrl = intermediateUrl.concat('?hash=')
    var finalUrl = penultimateUrl.concat(salted_hash)
    var htmlString1 = '<a href='
    var htmlString2 = '>Verify your email</a>'
    var finalConcat1 = htmlString1.concat(finalUrl)
    var fullMessage = finalConcat1.concat(htmlString2)
    //TODO: SQL Command adding to table of valid register links
    sendEmail(sourceEmail, address, "email", fullMessage) 
    }
})
module.exports = router