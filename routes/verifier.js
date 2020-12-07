const express = require('express')
//TODO: add pool access 
var router = express.Router();
var nodemailer = require("nodemailer");
const crypto = require("crypto")
const bodyParser = require("body-parser")
const getHash = require('../utilities/utils').getHash
const sendEmail = require('../utilities/utils').sendEmail
router.use(bodyParser.json())
router.get("/", (request, response) => {
    // created group email for mailing purposes. mail sent from there
    var address = request.body.email
    if(request.body.email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: '450g1au2020@gmail.com', 
        pass: 'Seventy1!' 
        }
    })
    
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
    const srcEmail = '450g1au2020@gmail.com' //TODO: use enviro var
    const subject = 'Mobile App Group 1 Verification'
    //TODO: SQL Command adding to table of valid register links
    router.sendEmail(srcEmail, address, subject, fullMessage) 
    }

})
module.exports = router