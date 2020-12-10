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
    var address = request.body.email
    if(request.body.email) {
    let salt = crypto.randomBytes(32).toString("hex")
    let salted_hash = getHash(address, salt)
    const url = 'https://mobileapp-group-backend.herokuapp.com/verified?email=\''
    var intermediateUrl = url.concat(address)
    var penultimateUrl = intermediateUrl.concat('\'&hash=\'')
    var finalUrl = penultimateUrl.concat(salted_hash)
    var finalestUrl = finalUrl.concat('\'')
    var htmlString1 = '<a href='
    var htmlString2 = '>Verify your email</a>'
    var finalConcat1 = htmlString1.concat(finalestUrl)
    var fullMessage = finalConcat1.concat(htmlString2)
    addLink(address, salted_hash, response)
    sendEmail(sourceEmail, address, "email", fullMessage) 
    }
})
/**
 * 
 * @apiParam {String} email email to be added to database to await verification
 * @apiParam {String} theUrl url to be added to database to be checked as valid
 */
function addLink(email, theHash, res) {

    let theQuery = "INSERT INTO Valid_Verifiers(mHash, Email) VALUES($1, $2) RETURNING *"
    
    let values = [theHash, email]
    pool.query(theQuery, values)
            .then(result => {
                //We add the url to the table
                res.status(201).send({
                    success: true,
                     theEmail: result.rows[0].Email,
                     theHash: result.rows[0].mHash
                 })
             })
            .catch((err)=> {
                if(err.constraint == "valid_verifiers_email_key") {
                    res.status(400).send({
                        message: "Email already awaiting verification, check your email"
                    })
                } else if(err.constraint == "valid_verifiers_mhash_key"){
                    res.status(400).send({
                        message: "Hash taken"
                    })
                } else {
                    res.status(400).send({
                        message: err.detail
                    })
                }
            })
    return
}
module.exports = router