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
        let theQuery = 'SELECT Password, Salt FROM Members WHERE Email=$1'
        let values = [address]
        pool.query(theQuery, values)
            .then(result => {
                if (result.rowCount == 0) {
                    res.status(404).send({
                        message: "User Information not found"
                    })
                    return
                } 
                let newSalt = crypt.randomBytes(32).toString('hex')
                let mySaltNewPass = getHash("randomPassword", newSalt) //hash for new password
                let update =`UPDATE Members 
                             SET Password=$1, Salt=$2 WHERE email=$3`
                let vals = [mySaltNewPass, newSalt, address]
                pool.query(update, vals)
                        .then(result => {
                            let message1 = "Your password with Group 1's app has been changed." +
                            " Your new password is:\n" + mySaltNewPass
                    sendEmail(sourceEmail, email, "changed", message1)
                })
                
            })
            return 
    }
})

module.exports = router